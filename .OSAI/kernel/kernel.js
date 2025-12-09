// /.OSAI/kernel/kernel.js

export const OSAIKernel = {
    processes: {},
    lastPid: 0,
    running: false,

    start() {
        console.log("[OSAI Kernel] Iniciado");
        this.running = true;
    },

    stop() {
        console.log("[OSAI Kernel] Parado");
        for (const pid in this.processes) {
            this.stopApp(pid);
        }
        this.running = false;
    },

    async startApp(manifest) {
        if (!this.running) {
            console.warn("[OSAI Kernel] Tentativa de iniciar app sem kernel ativo.");
            return;
        }

        const pid = ++this.lastPid;

        const proc = {
            pid,
            manifest,
            iframe: null
        };

        console.log(`[OSAI Kernel] Iniciando app "${manifest.name}" (PID ${pid})`);

        if (manifest.runner === "iframe") {
            const iframe = document.createElement("iframe");
            iframe.src = manifest.entry;
            iframe.dataset.pid = pid;
            iframe.style.width = "400px";
            iframe.style.height = "300px";
            iframe.style.border = "1px solid #444";
            document.body.appendChild(iframe);

            proc.iframe = iframe;

            iframe.onload = () => {
                iframe.contentWindow.postMessage(
                    { type: "osai:init", pid, manifest },
                    "*"
                );
            };
        }

        this.processes[pid] = proc;
        return pid;
    },

    stopApp(pid) {
        const proc = this.processes[pid];
        if (!proc) return;

        console.log(`[OSAI Kernel] Encerrando app PID ${pid}`);

        if (proc.iframe && proc.iframe.remove) {
            proc.iframe.remove();
        }

        delete this.processes[pid];
    },

    handleMessage(msg) {
        if (msg.type === "osai:stoprequest") {
            this.stopApp(msg.pid);
        }
    }
};

// Expor globalmente
window.OSAI = window.OSAI || {};
window.OSAI.kernel = OSAIKernel;

window.addEventListener("message", (event) => {
    const msg = event.data;
    if (!msg || !msg.type) return;

    OSAIKernel.handleMessage(msg);
});
