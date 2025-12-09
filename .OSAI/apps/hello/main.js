// Handshake inicial com o kernel
window.addEventListener("message", (event) => {
    if (event.data && event.data.type === "osai:init") {
        window.OSAI = event.data.kernel;
        const pid = event.data.pid;

        document.getElementById("info").innerText =
            `App iniciado com PID: ${pid}`;

        console.log("[HelloApp] Kernel conectado via IPC", event.data);

        // Envia mensagem para o kernel
        OSAI.ipc.send(pid, { msg: "Olá Kernel! App iniciado." });

        // Escuta mensagens vindas do Kernel
        OSAI.ipc.onMessage((packet) => {
            console.log("[HelloApp] Mensagem do Kernel:", packet);
        });

        // Finaliza o app em 5 segundos
        setTimeout(() => {
            console.log("[HelloApp] Encerrando...");
            OSAI.kernel.stopApp(pid);
        }, 5000);
    }
});
