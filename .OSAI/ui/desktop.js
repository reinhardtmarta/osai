import { WindowManager } from "./window-manager.js";
import { OSAIKernel } from "../kernel/kernel.js";

window.onload = async () => {
    await OSAIKernel.boot();
    WindowManager.init();

    console.log("[OSAI Desktop] Sistema carregado.");
};
