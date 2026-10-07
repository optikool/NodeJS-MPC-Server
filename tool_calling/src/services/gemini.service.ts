import { FunctionCallingConfigMode, GenerateContentResponse, GoogleGenAI, Type, type FunctionDeclaration, type ContentListUnion, type ToolListUnion, type FunctionCall } from "@google/genai";
import { WeatherService } from "./weather.service.ts";
import { CustomerService } from "./customer.service.ts";

class GeminiService {
  private static instance: GeminiService;
  private readonly model: string;
  private readonly genAI: GoogleGenAI;

  constructor(model: string = process.env.GEMINI_MODEL || "gemini-1.5-turbo") {
    const apiKey = process.env.GEMINI_API_KEY;

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

  async callLLM(contents: ContentListUnion, tools: ToolListUnion): Promise<GenerateContentResponse> {
    try {
      const response = await this.genAI.models.generateContent({
        model: this.model,
        contents,
        config: {
          tools,
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingConfigMode.AUTO,
            }
          }
          // systemInstruction: "",
          // thinkingConfig: {
          //   thinkingBudget: 0
          // }
        }
      });
      return response || "No response generated.";
    } catch (error: any) {
      console.error("Error generating response from GeminiProvider:", error);
      throw new Error(`Error generating response: ${error.message}`);
    }
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

  async generateResponseWithTools(prompt: string): Promise<string> {
    try {
      const getWeatherFn: FunctionDeclaration = {
        name: "get_current_weather",
        description: "Fetches live weather data from a given location.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            location: {
              type: Type.STRING,
              description: "The city and state, e.g., San Francisco, CA",
            }
          },
          required: ["location"],
        },
      }

      const getCustomerFn: FunctionDeclaration = {
        name: "get_all_customers",
        description: "Fetches all customers from the database.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            limit: {
              type: Type.INTEGER,
              description: "The maximum number of customers to fetch.",
            }
          },
          required: [],
        },
      }

      const tools = [
        {functionDeclarations: [getWeatherFn, getCustomerFn]}
      ]

      let response = await this.callLLM(prompt, tools);

      if (response.functionCalls && response.functionCalls.length > 0) {
        const functionCall = response.functionCalls[0];
        console.log("Function call detected:", functionCall)
        const { name, args } = functionCall as FunctionCall;
        
        let result: any;

        switch (name) {
          case "get_current_weather":
            const location = (args as { location: string }).location;
            if (typeof location !== "string") {
              throw new Error("Invalid argument for get_current_weather: location must be a string.");
            }

            result = await WeatherService.fetchWeatherData(location);
            break;
          case "get_all_customers":
            result = await CustomerService.getLatestCustomers();
            break;
          default:
            throw new Error(`Unknown function call: ${name}`);
        }

        // if(!result) {
        //   throw new Error(`No result returned from function call: ${name}`);
        // }

        // send result back to the model for further processing
        response = await this.callLLM([
          {
            role: "user",
            parts: [{
              text: prompt
            }]
          },
          {
            role: "user",
            parts: [{
              functionResponse: {
                name,
                response: {
                  result
                }
              }
            }]
          }
        ], tools)
      }

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