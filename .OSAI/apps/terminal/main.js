document.getElementById("cmd").onkeydown = (e) => {
    if (e.key === "Enter") {
        document.getElementById("out").textContent += "> " + e.target.value + "\n";
        e.target.value = "";
    }
};
