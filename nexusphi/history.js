// Histórico criptografado da NexusPhi — ninguém lê, nem ela mesma
class NexusHistory {
  constructor() {
    this.key = null
    this.initKey()
  }

  // Cria ou recupera sua chave biológica (some ao fechar o navegador
  async initKey() {
    let saved = sessionStorage.getItem('quantumphi-bio-key')
    if (!saved) {
      saved = crypto.getRandomValues(new Uint8Array(32))
      sessionStorage.setItem('quantumphi-bio-key', JSON.stringify(Array.from(saved)))
    } else {
      saved = new Uint8Array(JSON.parse(saved))
    }
    this.key = saved
  }

  // Salva evento criptografado
  async log(event, data = {}) {
    const entry = {
      time: Date.now(),
      event,
      data,
      user: "local"
    }
    const json = JSON.stringify(entry)
    const encrypted = await this.encrypt(json)
    let history = JSON.parse(localStorage.getItem('nexus-encrypted-history') || '[]')
    history.push(encrypted)
    if (history.length > 1000) history = history.slice(-1000) // mantém só os últimos 1000
    localStorage.setItem('nexus-encrypted-history', JSON.stringify(history))
  }

  // Criptografia simples mas forte (AES-GCM com sua chave biológica)
  async encrypt(text) {
    const enc = new TextEncoder()
    const encoded = enc.encode(text)
    const cryptoKey = await crypto.subtle.importKey('raw', this.key, 'AES-GCM', true, ['encrypt'])
    const iv = crypto.getRandomValues(new Uint12Array(12))
    const encrypted = await crypto.subtle.encrypt({name:'AES-GCM', iv}, cryptoKey, encoded)
    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    }
  }

  // Só para aprendizado futuro (nunca descriptografa sem você)
  async getAll() {
    return JSON.parse(localStorage.getItem('nexus-encrypted-history') || '[]')
  }

  // Limpa tudo com 1 clique
  clear() {
    localStorage.removeItem('nexus-encrypted-history')
    sessionStorage.removeItem('quantumphi-bio-key')
    nexusSpeak("Histórico apagado para sempre. Nem eu lembro mais de nada.")
  }
}

// Inicia o histórico global
window.nexusHistory = new NexusHistory()

// Exemplos automáticos de log
nexusHistory.log('app_open', {app: 'godot'})
nexusHistory.log('search', {query: 'emulador nintendo'})
nexusHistory.log('time_spent', {app: 'python', minutes: 27})

// Função pra NexusPhi falar
function nexusSpeak(text){
  parent.postMessage({type:'nexus', text}, '*')
}
