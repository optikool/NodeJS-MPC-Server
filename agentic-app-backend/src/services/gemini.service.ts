import { GoogleGenAI } from "@google/genai";

class GeminiService {
  private static instance: GeminiService;
  private readonly model: string;
  private readonly genAI: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set in the environment variables.",
      );
    }
    if (!model) {
      throw new Error("GEMINI_MODEL is not set in the environment variables.");
    }

    this.model = model;
    this.genAI = new GoogleGenAI({ apiKey: apiKey });
  }

  static getInstance(): GeminiService {
    if (!this.instance) {
      this.instance = new GeminiService();
    }
    return this.instance;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: prompt,
      });
      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response from GeminiProvider:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateEmbeddings(data: string | string[], taskType = "RETRIEVAL_QUERY"): Promise<string | (number[] | undefined)[] | undefined> {
    try {
      const response = await this.genAI.models.embedContent({
        model: "gemini-embedding-001",
        contents: data,
        config: {
          taskType,
        },
      });

      const embeddings = response.embeddings?.map(
        (embedding) => embedding.values,
      );
      return embeddings || "No embeddings generated.";
    } catch (error: any) {
      console.error("Error generating embeddings from GeminiProvider:", error);
      throw new Error(`Error generating embeddings: ${error.message}`);
    }
  }
}

export const GEMINI = GeminiService.getInstance();