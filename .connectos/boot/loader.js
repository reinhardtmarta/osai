/*
    ConnectOS — Boot Loader
    Loads system modules, security layer, themes, and NexusPhi.
    Runs safely on top of any OS without modifying the underlying system.
*/

const ConnectOS = {
    device: null,
    theme: "light-theme",
    modules: {},
    ready: false,

    async boot() {
        console.log("[ConnectOS] Boot sequence started...");

        // 1. Detect device type
        this.device = this.detectDevice();
        console.log("[ConnectOS] Device:", this.device);

        // 2. Load system config
        await this.loadConfig();

        // 3. Load theme
        await this.loadTheme(this.theme);

        // 4. Initialize security layer
        await this.loadModule("/security/sandbox.js", "sandbox");
        await this.loadModule("/security/firewall.js", "firewall");

        // 5. Initialize system modules
        await this.loadModule("/system/device-detect.js", "deviceDetect");
        await this.loadModule("/system/window-manager.js", "windowManager");
        await this.loadModule("/system/overlay.js", "overlay");
        await this.loadModule("/system/universal-exec.js", "universalExec");

        // 6. Load NexusPhi
        await this.loadNexus();

        // 7. Display UI
        await this.startUI();

        this.ready = true;
        console.log("[ConnectOS] Boot complete.");
    },

    detectDevice() {
        const width = window.innerWidth;

        if (width <= 600) return "mobile";
        if (width <= 1024) return "tablet";
        return "desktop";
    },

    async loadConfig() {
        try {
            const config = await fetch("/system/config.js").then(r => r.text());
            this.modules.config = config;
            console.log("[ConnectOS] Config loaded.");
        } catch {
            console.warn("[ConnectOS] Failed to load config.");
        }
    },

    async loadTheme(name) {
        try {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `/themes/${name}.css`;
            document.head.appendChild(link);
            console.log("[ConnectOS] Theme loaded:", name);
        } catch {
            console.warn("[ConnectOS] Failed to load theme.");
        }
    },

    async loadModule(path, name) {
        try {
            const module = await import(path);
            this.modules[name] = module;
            console.log(`[ConnectOS] Module loaded: ${name}`);
        } catch (err) {
            console.warn(`[ConnectOS] Failed to load module: ${name}`, err);
        }
    },

    async loadNexus() {
        console.log("[ConnectOS] Loading NexusPhi...");

        try {
            await this.loadModule("/nexusphi/core/memory.py", "nexusMemory");
            await this.loadModule("/nexusphi/core/adaptive_engine.py", "nexusAdaptive");
            await this.loadModule("/nexusphi/core/performance.py", "nexusPerformance");
            await this.loadModule("/nexusphi/core/permissions.py", "nexusPermissions");
            await this.loadModule("/nexusphi/core/security_guard.py", "nexusSecurity");

            console.log("[ConnectOS] NexusPhi core loaded.");
        } catch {
            console.warn("[ConnectOS] NexusPhi failed to load.");
        }
    },

    async startUI() {
        try {
            const panel = await fetch("/web/nexus-panel.html").then(r => r.text());
            const container = document.createElement("div");
            container.innerHTML = panel;
            document.body.appendChild(container);

            // Load floating avatar
            const avatar = await fetch("/nexusphi/ui/avatar.html").then(r => r.text());
            const avatarBox = document.createElement("div");
            avatarBox.innerHTML = avatar;
            document.body.appendChild(avatarBox);

            console.log("[ConnectOS] UI ready.");
        } catch {
            console.warn("[ConnectOS] Failed to start UI.");
        }
    }
};

// Start boot after DOM loads
window.addEventListener("DOMContentLoaded", () => ConnectOS.boot());
