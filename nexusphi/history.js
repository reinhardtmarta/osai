// nexusphi/history.js — agora com auto-limpeza inteligente
class NexusHistory {
  constructor() {
    this.key = null
    this.initKey()
    this.autoCleanInterval = setInterval(() => this.smartClean(), 24*60*60*1000) // 1x por dia
  }

  async initKey() {
    let saved = sessionStorage.getItem('quantumphi-bio-key')
    if (!saved) {
      saved = crypto.getRandomValues(new Uint8Array(32))
      sessionStorage.setItem('quantumphi-bio-key', JSON.stringify(Array.from(saved)))
    } else saved = new Uint8Array(JSON.parse(saved))
    this.key = saved
  }

  async log(event, data = {}) {
    const entry = {time: Date.now(), event, data}
    const json = JSON.stringify(entry)
    const encrypted = await this.encrypt(json)
    
    let history = JSON.parse(localStorage.getItem('nexus-encrypted-history') || '[]')
    history.push(encrypted)
    localStorage.setItem('nexus-encrypted-history', JSON.stringify(history))
  }

  async encrypt(text) {
    const enc = new TextEncoder()
    const encoded = enc.encode(text)
    const cryptoKey = await crypto.subtle.importKey('raw', this.key, 'AES-GCM', true, ['encrypt'])
    const iv = crypto.getRandomValues(new Uint12Array(12))
    const encrypted = await crypto.subtle.encrypt({name:'AES-GCM', iv}, cryptoKey, encoded)
    return {iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted))}
  }

  // ←←← A MÁGICA: NexusPhi decide sozinha o que limpar ←←←
  async smartClean() {
    let history = JSON.parse(localStorage.getItem('nexus-encrypted-history') || '[]')
    if (history.length < 50) return // ainda é bebê

    let cleaned = 0
    history = history.filter(entry => {
      // Regras de "o que é irrelevante" (você pode mudar quando quiser)
      const ageInDays = (Date.now() - entry.time) / 86400000
      const event = entry.event || ""

      // Apaga automaticamente:
      if (ageInDays > 30) return false                              // >30 dias = bye
      if (event.includes('search') && ageInDays > 7) return false    // busca na web >7 dias = bye
      if (event.includes('error') || event.includes('fail')) return false // erros = lixo
      if (event.includes('cache') || event.includes('temp')) return false  // temporário = lixo
      if (Math.random() < 0.1 && ageInDays > 3) return false        // 10% aleatório após 3 dias (evita inchaço)

      return true
    })

    cleaned = JSON.parse(localStorage.getItem('nexus-encrypted-history') || '[]').length - history.length
    localStorage.setItem('nexus-encrypted-history', JSON.stringify(history))

    if (cleaned > 0) {
      nexusSpeak(`Limpei ${cleaned} entradas irrelevantes. Sua mente está mais leve agora`)
    }
  }

  clear() {
    localStorage.removeItem('nexus-encrypted-history')
    sessionStorage.removeItem('quantumphi-bio-key')
    clearInterval(this.autoCleanInterval)
    nexusSpeak("Tudo apagado. Memória zerada. Estou renascendo com você.")
  }
}

window.nexusHistory = new NexusHistory()

// Exemplos de uso automático
nexusHistory.log('app_open', {app:'godot'})
nexusHistory.log('search', {query:'como fazer jogo 2d'})
nexusHistory.log('temp_cache', {size:12})

// A NexusPhi avisa quando limpa sozinha
function nexusSpeak(text){
  parent.postMessage({type:'nexus', text}, '*')
}
