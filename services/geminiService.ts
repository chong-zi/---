import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

// Initialize the client
// API Key is assumed to be in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

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