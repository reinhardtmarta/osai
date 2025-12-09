export const Sandbox = {
    allowCommunication(pid) {
        return {
            send(msg) {
                parent.postMessage({ pid, data: msg }, "*");
            }
        }
    }
};
