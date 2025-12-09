export const OSAIKernel = {
    processes: {},
    pid: 0,
    running: false,
    permissions: {},

    async boot() {
        console.log("[OSAI Kernel] Boot");

        this.running = true;

        this.permissions = await (await fetch("permissions.json")).json();
    },

    async startApp(manifest, source="system") {
        if (!this.running) return;

        const pid = ++this.pid;

        const proc = {
            pid,
            manifest,
            iframe: null
        };

        const iframe = document.createElement("iframe");
        iframe.src = manifest.entry;
        iframe.className = "osai-window";
        iframe.dataset.pid = pid;

        document.body.appendChild(iframe);
        proc.iframe = iframe;

        iframe.onload = () => iframe.contentWindow.postMessage(
            { type: "osai:init", pid, manifest },
            "*"
        );

        this.processes[pid] = proc;
        return pid;
    },

    stopApp(pid) {
        if (!this.processes[pid]) return;
        this.processes[pid].iframe.remove();
        delete this.processes[pid];
    }
};

window.OSAI = { kernel: OSAIKernel };
