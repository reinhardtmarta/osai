import { AIProviderInterface } from "./ai-provider-interface.js";

export class AINullProvider extends AIProviderInterface {
    async query(prompt) {
        return {
            success: false,
            response: "Nenhuma IA configurada.",
            provider: "none"
        };
    }

    async train(data) {
        return {
            success: false,
            message: "Treinamento indisponível — IA não configurada."
        };
    }

    async info() {
        return {
            name: "AINullProvider",
            type: "placeholder",
            features: ["none"]
        };
    }
}
