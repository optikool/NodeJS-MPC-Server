import ollama from 'ollama';

class OllamaService {
    model: string;
    baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'qwen3:14b') {
    this.model = model;
    this.baseUrl = baseUrl;

    if (!this.model) {
      throw new Error("OLLAMA_MODEL is not set in the environment variables.");
    }
  }

  async generateResponse(prompt: string) {
    try {
      // Using the official library's generate method
      const response = await ollama.generate({
        model: this.model,
        prompt: prompt,
        stream: false, // This ensures we get a single object back instead of a stream
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      });

      return response.response || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response from OllamaProvider:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
  }
}

export default OllamaService;