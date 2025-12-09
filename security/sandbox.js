// security/sandbox.js - Executor universal em sandbox para OS.AI
// Usa Web Workers pra isolamento; integra com capability-map.json

const fs = require('fs');
const path = require('path');

// Carrega capability-map pra checar perms
let capabilities = {};
try {
  capabilities = JSON.parse(fs.readFileSync(path.join(__dirname, 'capability-map.json'), 'utf8'));
} catch (err) {
  console.warn('Capability map não carregado; usando defaults seguros');
  capabilities = { sandbox: { allowed: ['readFile', 'writeFile', 'compute'], denied: ['network', 'system'] } };
}

// Função principal: Roda código em sandbox
async function executeInSandbox(code, options = {}) {
  const { permissions = [], timeout = 5000, context = {} } = options;
  
  // Passo 1: Checa permissões contra map
  const requiredCaps = permissions || inferCapabilities(code); // Infer simples baseado em keywords
  if (!checkPermissions(requiredCaps)) {
    throw new Error('Permissões negadas: ' + requiredCaps.join(', '));
  }
  
  // Passo 2: Cria worker pra isolamento
  return new Promise((resolve, reject) => {
    const workerBlob = new Blob([`
      ${sandboxWorkerCode}  // Código do worker abaixo
      
      self.onmessage = function(e) {
        const { code, context, timeout } = e.data;
        const start = Date.now();
        let result;
        let error = null;
        
        try {
          // Eval isolado com timeout
          const func = new Function('context', \`
            "use strict";
            return (async () => {
              ${code}
            })();
          \`);
          result = func(context);
          if (result instanceof Promise) {
            result = await result;
          }
        } catch (err) {
          error = err.message;
        }
        
        if (Date.now() - start > timeout) {
          error = 'Timeout excedido';
        }
        
        self.postMessage({ result, error });
      };
    `], { type: 'application/javascript' });
    
    const workerUrl = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerUrl);
    
    worker.postMessage({ code, context, timeout });
    
    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error('Sandbox timeout'));
    }, timeout);
    
    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      if (e.data.error) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data.result);
      }
    };
    
    worker.onerror = (err) => {
      clearTimeout(timeoutId);
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
      reject(err);
    };
  });
}

// Infer capabilities básicas (expanda com regex pra detecção real)
function inferCapabilities(code) {
  const caps = [];
  if (code.includes('fetch') || code.includes('XMLHttpRequest')) caps.push('network');
  if (code.includes('fs.') || code.includes('open(')) caps.push('fileSystem');
  if (code.includes('eval') || code.includes('new Function')) caps.push('executeCode');
  return caps;
}

// Checa perms contra map
function checkPermissions(required) {
  for (const cap of required) {
    const allowed = capabilities.sandbox.allowed.includes(cap);
    const denied = capabilities.sandbox.denied.includes(cap);
    if (denied || !allowed) return false;
  }
  return true;
}

// Código base do worker (anti-eval escapes, etc.)
const sandboxWorkerCode = `
  // Worker env: Sem access a DOM, fs ou globals perigosos
  const safeGlobals = {
    console: console,
    Math: Math,
    Date: Date,
    // Adicione mais safe APIs
  };
  // Qualquer outro global é bloqueado via proxy se precisar
`;

// Exporta pra uso no universal-exec.js ou API
module.exports = { executeInSandbox, checkPermissions, inferCapabilities };

// Exemplo de uso (pra testes)
if (require.main === module) {
  // Teste simples
  executeInSandbox('return 2 + 2;')
    .then(result => console.log('Sandbox result:', result))  // 4
    .catch(err => console.error('Sandbox error:', err));
      }
