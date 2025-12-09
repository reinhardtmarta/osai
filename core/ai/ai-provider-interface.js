export class AIProviderInterface {
    async query(prompt) {
        throw new Error("query() não implementado");
    }

    async train(data) {
        throw new Error("train() não implementado");
    }

    async info() {
        return {
            name: "Unnamed Provider",
            type: "unknown",
            features: []
        };
    }
}
