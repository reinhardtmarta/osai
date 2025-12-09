export const Settings = {
    get(key) { return OSFS.read("settings/" + key); },
    set(key, val) { OSFS.write("settings/" + key, val); }
};
