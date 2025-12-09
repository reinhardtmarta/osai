/*
    OSAI — Boot Loader
    Loads system modules, security layer, themes, and OSAI Core.
    Runs safely on top of any OS without modifying the underlying system.
*/

const OSAI = {
    device: null,
    theme: "light-theme",
    modules: {},
    ready: false,

    async boot() {
        console.log("[OSAI] Boot sequence started...");

        // 1. Detect device type
        this.device = this.detectDevice();
        console.log("[OSAI] Device:", this.device);

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

        // 6. Load OSAI Core
        await this.loadOSAI();

        // 7. Display UI
        await this.startUI();

        this.ready = true;
        console.log("[OSAI] Boot complete.");
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
            console.log("[OSAI] Config loaded.");
        } catch {
            console.warn("[OSAI] Failed to load config.");
        }
    },

    async loadTheme(name) {
        try {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = `/themes/${name}.css`;
            document.head.appendChild(link);
            console.log("[OSAI] Theme loaded:", name);
        } catch {
            console.warn("[OSAI] Failed to load theme.");
        }
    },

    async loadModule(path, name) {
        try {
            const module = await import(path);
            this.modules[name] = module;
            console.log(`[OSAI] Module loaded: ${name}`);
        } catch (err) {
            console.warn(`[OSAI] Failed to load module: ${name}`, err);
        }
    },

    async loadOSAI() {
        console.log("[OSAI] Loading OSAI Core...");

        try {
            await this.loadModule("/OSAI/core/memory.py", "osaiMemory");
            await this.loadModule("/OSAI/core/adaptive_engine.py", "osaiAdaptive");
            await this.loadModule("/OSAI/core/performance.py", "osaiPerformance");
            await this.loadModule("/OSAI/core/permissions.py", "osaiPermissions");
            await this.loadModule("/OSAI/core/security_guard.py", "osaiSecurity");
            await this.loadModule("/OSAI/core/phi_attention.py", "osaiAttention");

            console.log("[OSAI] OSAI Core loaded.");
        } catch {
            console.warn("[OSAI] OSAI Core failed to load.");
        }
    },

    async startUI() {
        try {
            const panel = await fetch("/web/nexus-panel.html").then(r => r.text());
            const container = document.createElement("div");
            container.innerHTML = panel;
            document.body.appendChild(container);

            const avatar = await fetch("/osAI/ui/avatar.html").then(r => r.text());
            const avatarBox = document.createElement("div");
            avatarBox.innerHTML = avatar;
            document.body.appendChild(avatarBox);

            console.log("[OSAI] UI ready.");
        } catch {
            console.warn("[OSAI] Failed to start UI.");
        }
    }
};

// Start boot after DOM loads
window.addEventListener("DOMContentLoaded", () => OSAI.boot());
