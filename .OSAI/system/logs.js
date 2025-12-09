export const OSLogs = {
    write(msg) {
        const t = Date.now();
        OSFS.write("logs/" + t, msg);
    }
};
