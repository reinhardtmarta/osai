// /.OSAI/panel/panel-loader.js

(async () => {
    const kernelModule = await import("../kernel/kernel.js");
    console.log("[OSAI Panel] Kernel carregado no painel.");
})();
