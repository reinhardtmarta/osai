// OSAI/history.js — OSAI limpa sozinha + você tem o freio vermelho
class OSAIHistory {
  constructor() {
    this.key = null
    this.autoCleanEnabled = localStorage.getItem('OSAI-auto-clean') !== 'false' // padrão = ligada
    this.initKey()
    if (this.autoCleanEnabled) {
      this.autoCleanInterval = setInterval(() => this.smartClean(), 12*60*60*1000) // a cada 12h
    }
  }

  async initKey() {
    let saved = sessionStorage.getItem('quantumphi-bio-key')
    if (!saved) {
      saved = crypto.getRandomValues(new Uint8Array(32))
      sessionStorage.setItem('quantumphi-bio-key', JSON.stringify(Array.from(saved)))
    } else saved = new Uint8Array(JSON.parse(saved))
    this.key = saved
  }

  // SALVA EVENTO CRIPTOGRAFADO
  async log(event, data = {}) {
    const entry = {time: Date.now(), event, data}
    const json = JSON.stringify(entry)
    const encrypted = await this.encrypt(json)
    let history = JSON.parse(localStorage.getItem('OSAI-encrypted-history') || '[]')
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

  // OSAI DECIDE SOZINHA (inteligência real)
  async smartClean() {
    let history = JSON.parse(localStorage.getItem('OSAI-encrypted-history') || '[]')
    if (history.length < 100) return

    const totalMB = JSON.stringify(history).length / 1024 / 1024
    let before = history.length

    history = history.filter(entry => {
      const age = (Date.now() - entry.time) / 86400000
      const text = JSON.stringify(entry).toLowerCase()

      if (totalMB > 5000) return false
      if (totalMB > 1000 && age > 3) return false
      if (text.includes('error') || text.includes('fail')) return false
      if (text.includes('search') && age > 5) return false
      if (age > 60) return false
      if (Math.random() < 0.05 && age > 2) return false
      return true
    })

    const cleaned = before - history.length
    localStorage.setItem('nexus-encrypted-history', JSON.stringify(history))

    if (cleaned > 0) {
      OSAISpeak(`Limpei \( {cleaned} entradas irrelevantes. Memória atual: \){totalMB.toFixed(1)} MB. Leve e focada em você`)
    }
  }

  }

  // FREIO VERMELHO DO USUÁRIO
  toggleAutoClean(enable) {
    this.autoCleanEnabled = enable
    localStorage.setItem('nexus-auto-clean', enable)
    if (enable) {
      this.autoCleanInterval = setInterval(() => this.smartClean(), 12*60*60*1000)
      nexusSpeak("Auto-limpeza ligada. Eu cuido da memória sozinha.")
    } else {
      clearInterval(this.autoCleanInterval)
     OSAISpeak("Auto-limpeza desligada. Você está no controle total agora.")
    }
  }

  forceClean() {
    if (!confirm("LIMPEZA PROFUNDA?\nIsso apaga >90% do histórico (só última semana fica)")) return
    let history = JSON.parse(localStorage.getItem('nexus-encrypted-history') || '[]')
    const kept = history.filter(e => (Date.now() - e.time) / 86400000 < 7)
    localStorage.setItem('nexus-encrypted-history', JSON.stringify(kept))
    nexusSpeak("Limpeza profunda concluída. Só o essencial ficou.")
  }

  clearAll() {
    localStorage.removeItem('nexus-encrypted-history')
    sessionStorage.removeItem('quantumphi-bio-key')
    clearInterval(this.autoCleanInterval)
    OSAISpeak("Memória completamente zerada por sua ordem.")
  }
}

window.OSAIHistory = new OSAIHistory()

function OSAISpeak(text){
  parent.postMessage({type:'OSAI', text}, '*')
  console.log("OSAI:", text)
}
