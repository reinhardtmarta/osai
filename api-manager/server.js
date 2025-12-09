const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Chave secreta pra JWT (mude pra algo forte em prod!)
const JWT_SECRET = 'osai-super-secret-key-2025'; // TODO: Use env var

// Middleware pra auth (simples, pra endpoints protegidos)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Endpoint público: Status do OS.AI
app.get('/status', (req, res) => {
  res.json({ status: 'OS.AI ativo', version: '0.1.0', connectedDevices: io.engine.clientsCount });
});

// Endpoint protegido: Otimizar performance (ex.: bateria ou CPU)
app.post('/optimize/:type', authenticateToken, (req, res) => {
  const { type } = req.params; // 'battery' ou 'cpu'
  const { intensity } = req.body; // 1-10, opcional

  // Aqui integra com seu universal-exec.js — simula execução
  console.log(`Otimizando \( {type} com intensidade \){intensity || 'padrão'}`);
  
  // Exemplo de ação: Em um real, chame sandbox.optimize(type)
  const result = { success: true, message: `\( {type} otimizado! Economia: \){Math.random() * 20 + 10}%` };

  // Emite via Socket pra assistência ativa
  io.emit('optimization-complete', result);

  res.json(result);
});

// WebSocket pra assistência ativa (conecta e escuta comandos)
io.on('connection', (socket) => {
  console.log('Device conectado:', socket.id);

  // Autentica via token no connect (envia token na handshake)
  socket.on('authenticate', (token) => {
    try {
      const user = jwt.verify(token, JWT_SECRET);
      socket.user = user;
      socket.emit('authenticated', { message: 'Assistente ativa!' });
    } catch (err) {
      socket.disconnect();
    }
  });

  // Escuta comandos do assistente (ex.: de um LLM integrado)
  socket.on('assist-command', (command) => {
    if (!socket.user) return;
    
    // Processa comando simples — expanda pra IA
    let response;
    if (command === 'check-memory') {
      response = { memory: { short: 'Alta', long: 'Estável' } }; // Integra com sua memória module
    } else if (command === 'predict-task') {
      response = { prediction: 'Próxima tarefa: Backup automático em 5min' };
    } else {
      response = { error: 'Comando inválido' };
    }
    
    socket.emit('assist-response', response);
  });

  socket.on('disconnect', () => {
    console.log('Device desconectado:', socket.id);
  });
});

// Gere token pra testes (rode isso uma vez pra pegar um token)
app.get('/generate-token', (req, res) => {
  const token = jwt.sign({ deviceId: 'test-device' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`OS.AI API rodando em http://localhost:${PORT}`);
  console.log(`Gere token: http://localhost:${PORT}/generate-token`);
});
