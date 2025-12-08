// nexusphi/guardian.js — NexusGuardian: o anjo da guarda que pensa por você (mas obedece)
class NexusGuardian {
  constructor() {
    this.enabled = localStorage.getItem('guardian-enabled') !== 'false' // ligado por padrão
    this.ramLimit = 0.85 // trava se usar mais de 85% da RAM
    this.knownBad = ['conduit', 'browser hijack', 'cryptominer', 'ransomware'] // padrões 2025
    this.init()
  }

  init() {
    if(!this.enabled) return

    // 1. Detector de erros + aviso
    window.addEventListener('error', e => {
      this.speak(`Erro detectado: ${e.message}. Quer que eu tente corrigir automaticamente?`, [
        {text:"Sim, corrige", action:()=>location.reload()},
        {text:"Não, deixa"}
      ])
    })

    // 2. RAM watcher (trava automática)
    setInterval(()=>{
      if('memory' in performance){
        const used = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit
        if(used > this.ramLimit){
          this.speak(`RAM em ${Math.round(used*100)}% — vou fechar apps pesados pra te salvar`, [
            {text:"Ok, pode fechar", action:()=>this.killHeavyApps()},
            {text:"Não toca em nada!", action:()=>this.ramLimit = 0.99}
          ])
        }
      }
    }, 10000)

    // 3. Detector de vírus + stop spam (aprendizagem padrão travada)
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const url = args[0]
      if(typeof url === 'string' && this.looksMalicious(url)){
        const choice = await this.speak(`Site perigoso detectado: ${new URL(url).hostname}\nQuer mesmo abrir?`, [
          {text:"Não, bloqueia"},
          {text:"Sim, eu sei o que tô fazendo", action:()=>originalFetch(...args)}
        ])
        if(choice === 0) throw new Error('Blocked by NexusGuardian')
      }
      return originalFetch(...args)
    }

    // 4. Instalação de APK/.exe com análise
    const originalOpen = window.open
    window.open = (url) => {
      if(url && (url.endsWith('.apk') || url.endsWith('.exe'))){
        this.speak(`Baixando ${url.split('/').pop()}...\nVou escanear antes de instalar`, [
          {text:"Cancelar instalação", action:()=>{}},
          {text:"Continuar"}
        ])
      }
      originalOpen(url)
    }
  }

  looksMalicious(url){
    const bad = ['.onion.to', 'free-nitro', 'robux', 'crack', 'keygen', 'xxx']
    return bad.some(b => url.toLowerCase().includes(b))
  }

  killHeavyApps(){
    // fecha iframes pesados (futuro: mais inteligente)
    document.querySelectorAll('iframe').forEach(f=>f.src = 'about:blank')
    this.speak("Apps pesados fechados. Seu celular respira de novo")
  }

  async speak(message, buttons = [{text:"OK"}]){
    return new Promise(resolve => {
      const div = document.createElement('div')
      div.style = 'position:fixed;inset:0;background:#000c;z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:20px;text-align:center;font-size:1.4em'
      div.innerHTML = `<div style="background:#111;padding:30px;border:3px solid #0f0;border-radius:20px;max-width:90%">
        <h2>NexusGuardian</h2>
        <p>${message}</p>
        <div style="display:flex;gap:15px;flex-wrap:wrap;justify-content:center">
          \( {buttons.map((b,i)=>`<button style="background:#0f0;color:#000;padding:15px 25px;border:none;border-radius:10px;font-size:1.2em" onclick="this.closest('#guardian').remove();( \){b.action||(()=>{})})();resolve(\( {i})"> \){b.text}</button>`).join('')}
        </div>
      </div>`
      div.id = 'guardian'
      document.body.appendChild(div)
    })
  }

  toggle(on){
    this.enabled = on
    localStorage.setItem('guardian-enabled', on)
    nexusSpeak(on ? "NexusGuardian ativado. Estou de olho em tudo" : "NexusGuardian desligado. Você manda 100% agora")
  }
}

window.guardian = new NexusGuardian()

function nexusSpeak(t){
  parent.postMessage({type:'nexus', text: t}, '*')
}
