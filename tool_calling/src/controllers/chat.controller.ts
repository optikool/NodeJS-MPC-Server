import type { Request, Response } from "express";
import { GEMINI }  from "../services/gemini.service.ts";
import OllamaService from "../services/ollama.service.ts";

export class ChatController {
    static async generateGeminiResponse(req: Request, res: Response): Promise<void> {
        const messages = req.body.messages;
        const prompt  = messages[0].content.trim();

        if (!prompt) {
            res.status(400).json({ error: "Prompt is required" });
        }

        console.log(`Received message: ${prompt}`);

        try {
            const response = await GEMINI.generateResponseWithTools(prompt);
            console.log(`Gemini response: ${response}`);

            res.json({ reply: response });
        } catch (error) {
            console.error("Error processing chat message:", error);
            res.status(500).json({ error: "Failed to get response from AI model" });
        }

    }

    static async generateOllamaResponse(req: Request, res: Response): Promise<void> {
        try {
            const messages = req.body.messages;
            const prompt  = messages[0].content;
            // Explicitly use OllamaProvider for this route
            const provider = new OllamaService(
            process.env.OLLAMA_BASE_URL || 'http://localhost:11434', 
            process.env.OLLAMA_MODEL || req.body.model || 'qwen3:14b'
            );

            const response = await provider.generateResponse(prompt);
            res.json({ reply: response });
        } catch (error: any) {
            console.error("Ollama Route Error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}
