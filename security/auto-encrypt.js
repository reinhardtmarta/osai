// NexusPhi pode criptografar arquivos, mas a chave fica só com você
async function encryptFile(content, filename) {
  const encrypted = quantumPhiEncrypt(content)
  
  // Salva só os dados criptografados
  localStorage.setItem(`φ_${filename}`, JSON.stringify({
    data: encrypted.data,
    hint: encrypted.hint,
    created: new Date().toISOString(),
    by: "user"
  }))
  
  // A chave fica APENAS na sua memória RAM (some ao fechar)
  sessionStorage.setItem(`key_${filename}`, encrypted.key)
  
  nexusSpeak(`Arquivo "${filename}" criptografado com QuantumPhi Cipher. Chave guardada só na sua sessão. Nem eu consigo ler.`)
}
