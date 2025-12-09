(async () => {
    console.log("[OSAI Boot] Iniciando...");

    // Carrega kernel
    await import("../kernel/kernel.js");

    // Carrega UI principal
    window.location.href = "../ui/desktop.html";
})();
