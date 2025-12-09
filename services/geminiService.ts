import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

// IMPORTANT: This client is initialized in the browser bundle for demo
// purposes using the Vite-injected `import.meta.env.VITE_GEMINI_API_KEY`.
// For production, avoid shipping secret API keys to the browser. Instead,
// proxy requests through a server-side endpoint or use server-hosted
// credentials.
// Initialize the client using the Vite-provided env var.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

/**
 * Send a prompt plus conversation history to the Gemini model and return
 * the generated text.
 *
 * NOTE: This client is initialized on the client side for demo purposes
 * using `import.meta.env.VITE_GEMINI_API_KEY`. Do NOT expose production
 * API keys in browser bundles — route requests through a server endpoint
 * that holds secrets instead.
 *
 * @param prompt - The user prompt to send to the model
 * @param history - Array of prior messages to include as context
 * @returns The text response from Gemini, or an error message string
 */
export const sendMessageToGemini = async (
  prompt: string,
  history: Message[]
): Promise<string> => {
  try {
    // Map internal history to Gemini format if needed, 
    // but for simple single-turn or limited context, we can just use the model directly.
    // For this demo, we will use a fresh conversation for simplicity or reconstruct context.
    
    // Constructing a chat context
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful, precise data assistant. Format your answers using Markdown. Use tables for data representation where possible. Keep responses concise but informative.",
      },
      history: history.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: prompt
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error communicating with the AI service.";
  }
};