import express from "express";
import GeminiService from "../services/gemini.service.ts";
import OllamaService from "../services/ollama.service.ts";

const router = express.Router();

router.post(
  "/gemini/chat",
  async (req: express.Request, res: express.Response) => {
    const messages = req.body.messages;
    const prompt  = messages[0].content.trim();

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    console.log(`Received message: ${prompt}`);

    try {
      const gemini = new GeminiService(
        process.env.GEMINI_API_KEY!,
        process.env.GEMINI_MODEL!,
      );

      const response = await gemini.generateResponse(prompt);
      console.log(`Gemini response: ${response}`);

      res.json({ reply: response });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ error: "Failed to get response from AI model" });
    }
  },
);

router.post('/ollama/chat', async (req, res) => {
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
});

export default router;
