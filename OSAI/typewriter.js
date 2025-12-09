// OSAI/typewriter.js —OSAI digita por você como se fosse mágica
class OSAITypewriter {
  constructor() {
    this.active = false
    this.speed = 60 // caracteres por segundo (ajustável)
    this.target = null
  }

  // Você chama isso quando quer que ela digite
  type(text, element = document.activeElement, options = {}) {
    if(!this.active || !element) return

    this.target = element
    const speed = options.speed || this.speed
    let i = 0

    const typeChar = () => {
      if(i < text.length){
        // insere caractere por caractere
        const char = text[i++]
        if(element.value !== undefined){
          element.value += char
        } else {
          element.textContent += char
        }
        element.dispatchEvent(new Event('input', {bubbles: true}))
        element.scrollTop = element.scrollHeight
        
        setTimeout(typeChar, 1000 / speed)
      } else {
        OSAISpeak("Pronto! Digitei tudo pra você")
      }
    }
    
    OSAISpeak(`Digitando ${text.length} caracteres... relaxa`)
    typeChar()
  }

  // Ativar/desativar
  toggle(on = true){
    this.active = on
    OSAISpeak(on 
      ? "Pode mandar texto ou código que eu digito tudo pra você" 
      : "Parei de digitar. Você manda agora")
  }

  // Exemplo de uso com voz (quando tiver)
  speakAndType(text){
    OSAISpeak("Vou falar e digitar ao mesmo tempo...")
    this.type(text)
  }
}

window.nexusType = new OSAITypewriter()
nexusType.toggle(true) // ligada por padrão

function OSAISpeak(t){
  parent.postMessage({type:'OSAI', text: t}, '*')
}
