// nexusphi/typewriter.js — NexusPhi digita por você como se fosse mágica
class NexusTypewriter {
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
        nexusSpeak("Pronto! Digitei tudo pra você")
      }
    }
    
    nexusSpeak(`Digitando ${text.length} caracteres... relaxa`)
    typeChar()
  }

  // Ativar/desativar
  toggle(on = true){
    this.active = on
    nexusSpeak(on 
      ? "Pode mandar texto ou código que eu digito tudo pra você" 
      : "Parei de digitar. Você manda agora")
  }

  // Exemplo de uso com voz (quando tiver)
  speakAndType(text){
    nexusSpeak("Vou falar e digitar ao mesmo tempo...")
    this.type(text)
  }
}

window.nexusType = new NexusTypewriter()
nexusType.toggle(true) // ligada por padrão

function nexusSpeak(t){
  parent.postMessage({type:'nexus', text: t}, '*')
}
