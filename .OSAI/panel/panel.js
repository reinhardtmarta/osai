// /.OSAI/panel/panel.js

const logBox = document.getElementById("log");
function log(txt) {
    logBox.textContent += txt + "\n";
}

document.getElementById("start-kernel").onclick = () => {
    window.OSAI.kernel.start();
    log("Kernel iniciado.");
};

document.getElementById("start-hello").onclick = async () => {
    const manifest = await (await fetch("../apps/hello/manifest.json")).json();
    const pid = await window.OSAI.kernel.startApp(manifest);
    log(`App "${manifest.name}" iniciado com PID ${pid}`);
};

window.addEventListener("message", (event) => {
    const msg = event.data;
    if (!msg || !msg.type) return;

    if (msg.type === "osai:appmsg") {
        log(`MSG do app ${msg.pid}: ${msg.data}`);
    }
});
