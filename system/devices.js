// system/devices.js — o connectOS agora vê o mundo ao redor
class DeviceWatcher {
  constructor() {
    this.status = {
      online: 'offline',
      bluetooth: 'unknown',
      storage: 'none',
      camera: false,
      mic: false,
      battery: 100,
      charging: false,
      touch: 'ontouchstart' in window
    }
    this.init()
  }

  async init() {
    // Internet
    navigator.onLine ? this.set('online') : this.set('offline')
    window.addEventListener('online', () => this.set('online'))
    window.addEventListener('offline', () => this.set('offline'))

    // Bluetooth
    if ('bluetooth' in navigator) {
      navigator.bluetooth.getAvailability().then(avail => {
        this.set(avail ? 'bluetooth-on' : 'bluetooth-off')
      })
    }

    // Drives USB / SD (File System Access API)
    if ('showDirectoryPicker' in window) {
      this.status.storage = 'available'
      this.updateUI()
    }

    // Câmera e mic
    navigator.mediaDevices.enumerateDevices().then(devices => {
      this.status.camera = devices.some(d => d.kind === 'videoinput')
      this.status.mic = devices.some(d => d.kind === 'audioinput')
      this.updateUI()
    })

    // Bateria
    if ('getBattery' in navigator) {
      navigator.getBattery().then(b => {
        this.status.battery = Math.round(b.level * 100)
        this.status.charging = b.charging
        b.addEventListener('levelchange', () => {
          this.status.battery = Math.round(b.level * 100)
          this.updateUI()
        })
        b.addEventListener('chargingchange', () => {
          this.status.charging = b.charging
          this.updateUI()
        })
        this.updateUI()
      })
    }

    this.updateUI()
  }

  set(type) {
    this.status.online = type === 'online' ? 'online' : 'offline'
    this.updateUI()
    nexusSpeak(
      type === 'online' 
        ? "Internet voltou! Estou feliz" 
        : "Sem internet… mas eu funciono 100% offline mesmo"
    )
  }

  updateUI() {
    let bar = document.getElementById('status-bar')
    if (!bar) {
      bar = document.createElement('div')
      bar.id = 'status-bar'
      bar.style = 'position:fixed;top:0;right:0;padding:8px;background:#0008;font-size:14px;z-index:999'
      document.body.appendChild(bar)
    }
    bar.innerHTML = `
      ${this.status.online === 'online' ? 'WiFi' : 'Offline'} |
      ${this.status.bluetooth === 'bluetooth-on' ? 'Bluetooth' : ''} |
      \( {this.status.battery}% \){this.status.charging ? ' Charging' : ''} |
      ${this.status.touch ? 'Touch' : 'Mouse'}
    `
  }
}

window.deviceWatcher = new DeviceWatcher()

function nexusSpeak(t){
  parent.postMessage({type:'nexus', text: t}, '*')
}
