// system/universal-exec.js — o cérebro que roda QUALQUER coisa em QUALQUER dispositivo
class UniversalExecutor {
  constructor() {
    this.dropZone = null
    this.initDropZone()
  }

  initDropZone() {
    this.dropZone = document.body
    this.dropZone.style.position = 'relative'
    
    this.dropZone.ondragover = e => { e.preventDefault(); this.showHint() }
    this.dropZone.ondragleave = () => this.hideHint()
    this.dropZone.ondrop = e => {
      e.preventDefault()
      this.hideHint()
      if (e.dataTransfer.files[0]) this.execute(e.dataTransfer.files[0])
    }

    this.showHint()
  }

  showHint() {
    if (document.getElementById('drop-hint')) return
    const hint = document.createElement('div')
    hint.id = 'drop-hint'
    hint.innerHTML = `
      <h2>Arraste qualquer arquivo aqui</h2>
      <p>.exe · .apk · .py · .pdf · .mp4 · .zip · jogos · qualquer coisa</p>
      <p>NexusPhi adapta tudo pro seu dispositivo</p>
    `
    hint.style = 'position:fixed;inset:0;background:#000c;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#0f0;font-size:1.4em;z-index:9999;pointer-events:none'
    document.body.appendChild(hint)
  }

  hideHint() {
    const hint = document.getElementById('drop-hint')
    if (hint) hint.remove()
  }

  async execute(file) {
    const name = file.name.toLowerCase()
    const url = URL.createObjectURL(file)
    
    nexusSpeak(`Analisando ${file.name}... um segundo`)
    
    // DETECÇÃO AUTOMÁTICA DO DISPOSITIVO
    const isTouch = 'ontouchstart' in window
    const isDesktop = window.innerWidth > 1024
    const hasKeyboard = !isTouch

    // EXECUÇÃO INTELIGENTE POR TIPO
    if (name.endsWith('.exe') || name.endsWith('.msi')) {
      nexusSpeak("Windows executável detectado. Abrindo em modo compatibilidade...")
      this.openInIframe('runtimes/wine-wasm.html?file=' + encodeURIComponent(url))
    }
    else if (name.endsWith('.apk')) {
      if (isTouch) {
        nexusSpeak("APK nativo no celular. Instalando em sandbox...")
        location.href = url // Android abre direto
      } else {
        nexusSpeak("APK no PC. Transformando em janela desktop...")
        this.openInIframe('runtimes/apk-desktop.html?file=' + encodeURIComponent(url))
      }
    }
    else if (name.endsWith('.py')) {
      nexusSpeak("Python! Abrindo editor com seu código...")
      this.openInIframe('apps/python.html?script=' + encodeURIComponent(url))
    }
    else if (name.endsWith('.html') || name.endsWith('.htm')) {
      nexusSpeak("Página web local. Abrindo com gestos se for celular...")
      this.openInIframe(url)
    }
    else if (name.endsWith('.pdf')) {
      nexusSpeak("PDF detectado. Abrindo leitor com zoom por toque...")
      this.openInIframe('runtimes/pdf-viewer.html?file=' + encodeURIComponent(url))
    }
    else if (name.match(/\.(mp4|webm|ogg|mov)$/)) {
      nexusSpeak("Vídeo! Tela cheia com controles por toque...")
      const video = document.createElement('video')
      video.src = url
      video.controls = true
      video.autoplay = true
      video.style = 'width:100%;height:100%;object-fit:contain;background:#000'
      document.getElementById('window')?.appendChild(video)
    )
    }
    else {
      nexusSpeak("Não reconheço ainda, mas vou tentar abrir do mesmo jeito...")
      window.open(url)
    }
  }

  openInIframe(src) {
    const win = document.getElementById('window')
    win.style.display = 'block'
    win.src = src
  }
}

window.executor = new UniversalExecutor()

function nexusSpeak(t){
  parent.postMessage({type:'nexus', text: t}, '*')
}
