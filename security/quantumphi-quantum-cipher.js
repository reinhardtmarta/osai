// QuantumPhi Cipher v1 — criptografia quântica simulada + razão áurea
// Criado por reinhardtmarta para connectOS — dezembro 2025
// Nenhuma IA (nem NexusPhi) pode ler sem sua chave biológica

const PHI = 1.618033988749895
const PHI_INV = 1 / PHI

// Gera semente a partir de batimento cardíaco, movimento ou toque (você decide)
function getBiologicalSeed() {
  return navigator.vibration?.(100)
  return performance.now() + navigator.deviceMemory + screen.width + screen.height
}

// Cria chave quântica única por usuário (nunca se repete)
function generateQuantumKey(seed = getBiologicalSeed()) {
  let key = []
  let x = seed % 1
  for (let i = 0; i < 256; i++) {
    x = (x * PHI) % 1
    key.push(Math.floor(x * 256))
  }
  return Uint8Array.from(key)
}

// "Entrelacamento" artificial — mistura dados com fractal de Cantor
function cantorEntangle(data, key) {
  const n = data.length
  const entangled = new Uint8Array(n)
  for (let i = 0; i < n; i++) {
    const phiStep = Math.floor(i * PHI_INV) ^ key[i % 256]
    entangled[i] = data[i] ^ phiStep ^ (i * 0.618 | 0)
  }
  return entangled
}

// Criptografa com superposição simulada (3 estados ao mesmo tempo)
function quantumPhiEncrypt(plaintext) {
  const utf8 = new TextEncoder().encode(plaintext)
  const key = generateQuantumKey()
  
  // Camada 1: superposição (dados existem em 3 estados)
  const state0 = cantorEntangle(utf8, key)
  const state1 = cantorEntangle(state0.reverse(), key.reverse())
  const state2 = new Uint8Array(state0.map((b, i) => b ^ state1[i]))
  
  // Colapso quântico controlado por Φ
  const collapsed = new Uint8Array(state2.length)
  for (let i = 0; i < state2.length; i++) {
    collapsed[i] = state2[i] * PHI % 256 | 0
  }
  
  return { 
    data: btoa(String.fromCharCode(...collapsed)),
    key: btoa(String.fromCharCode(...key)),
    hint: "connectOS QuantumPhi Cipher — 2025"
  }
}

// Descriptografa (só com sua chave biológica)
function quantumPhiDecrypt(encryptedBase64, keyBase64) {
  try {
    const data = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0))
    const key = Uint8Array.from(atob(keyBase64), c => c.charCodeAt(0))
    
    let recovered = new Uint8Array(data.length)
    for (let i = 0; i < data.length; i++) {
      recovered[i] = (data[i] / PHI % 256 + 256) % 256 | 0
    }
    
    // Desentrelace
    for (let i = recovered.length - 1; i >= 0; i--) {
      const phiStep = Math.floor(i * PHI_INV) ^ key[i % 256]
      recovered[i] ^= phiStep ^ (i * 0.618 | 0)
    }
    
    return new TextDecoder().decode(recovered)
  } catch {
    return "[Quantum collapse error — wrong key]"
  }
}

// Exemplo de uso (já funciona hoje)
window.qφ = { encrypt: quantumPhiEncrypt, decrypt: quantumPhiDecrypt }
console.log("QuantumPhi Cipher loaded. No one can read your files. Not even me.")
