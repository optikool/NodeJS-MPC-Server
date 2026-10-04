import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  apiKey: string;
  model: string;
  genAI: GoogleGenAI;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;

    if (!this.apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set in the environment variables.",
      );
    }
    if (!this.model) {
      throw new Error("GEMINI_MODEL is not set in the environment variables.");
    }

    this.genAI = new GoogleGenAI({ apiKey: this.apiKey });
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents: prompt,
        // config: {
        //     systemInstruction: "You are a cat. Your name is Neko.",
        //     thinkingConfig: {
        //         thinkingBudget: 0,
        //     }
        // }
      });
      return response.text || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response from GeminiProvider:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }

  async generateEmbeddings(data: string | string[], taskType = "RETRIEVAL_QUERY") {
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
