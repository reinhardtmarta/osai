export const OSFS = {
    read(path) {
        return localStorage.getItem("osai:" + path);
    },
    write(path, content) {
        localStorage.setItem("osai:" + path, content);
    }
};
