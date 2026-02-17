
import { GoogleGenAI, Type } from "@google/genai";
import { Product, ParseResult } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async parseCommand(input: string, products: Product[]): Promise<ParseResult> {
    const productList = products.map(p => `${p.name} (SKU: ${p.sku})`).join(", ");
    
    const response = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `User Input: "${input}"\nAvailable Products: ${productList}`,
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        responseMimeType: "application/json",
        systemInstruction: `You are an inventory assistant for Flora Tissues. 
        Analyze the user input to determine:
        1. Whether they want to ADD items (factory output, stock arrival) or REMOVE items (warehouse transfer, sales, shipping).
        2. The quantity involved (must be a positive integer).
        3. Which product from the list matches best.
        
        If you cannot find a clear match or quantity, set action to 'UNKNOWN'. 
        If it's ambiguous, explain why in the 'note'.`,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: ['ADD', 'REMOVE', 'UNKNOWN'],
              description: 'The type of transaction.'
            },
            quantity: {
              type: Type.NUMBER,
              description: 'The numeric quantity found in the text.'
            },
            productNameMatch: {
              type: Type.STRING,
              description: 'The full name of the matching product from the available list.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence score from 0 to 1.'
            },
            note: {
              type: Type.STRING,
              description: 'Any additional context or error message.'
            }
          },
          required: ['action', 'quantity', 'productNameMatch', 'confidence']
        }
      }
    });

    try {
      return JSON.parse(response.text || '{}') as ParseResult;
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
      return { action: 'UNKNOWN', quantity: 0, productNameMatch: '', confidence: 0, note: "Parsing error." };
    }
  }
}

export const geminiService = new GeminiService();
