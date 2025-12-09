export const AI = {
    enabled: false,
    async query(q) {
        if (!this.enabled) throw "IA não integrada ainda.";
        return "pending integration";
    }
};
