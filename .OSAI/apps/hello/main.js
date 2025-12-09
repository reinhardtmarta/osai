// Hello App - main.js

let myPid = null;

window.addEventListener("message", (event) => {
    const msg = event.data;
    if (!msg || msg.type !== "osai:init") return;

    myPid = msg.pid;
    document.getElementById("pid").textContent = "PID: " + myPid;

    parent.postMessage(
        { type: "osai:appmsg", pid: myPid, data: "Hello App iniciado!" },
        "*"
    );

    setTimeout(() => {
        parent.postMessage(
            { type: "osai:stoprequest", pid: myPid },
            "*"
        );
    }, 5000);
});
