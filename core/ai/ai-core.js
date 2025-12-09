import { AINullProvider } from "./ai-null-provider.js";

export const OSAI_AI = {
    provider: new AINullProvider(),

    setProvider(provider) {
        this.provider = provider;
    },

    async query(prompt) {
        return this.provider.query(prompt);
    },

    async train(data) {
        return this.provider.train(data);
    },

    async info() {
        return this.provider.info();
    }
};
