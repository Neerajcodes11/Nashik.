import { GoogleGenAI } from '@google/genai';
import type { ChatMessage, GroundingChunk } from '../types';

let ai: GoogleGenAI | null = null;
const model = 'gemini-2.5-flash';

// This function safely initializes and returns the AI client singleton.
function getAiInstance(): GoogleGenAI | null {
  if (ai) return ai;
  
  const API_KEY = process.env.API_KEY;
  if (!API_KEY) {
    console.warn("API key not found. Chatbot will not function.");
    return null;
  }
  
  ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai;
}

const systemInstruction = `You are a helpful and friendly assistant for "Nashik LocalKart", a web application that helps users find local shops and services in Nashik, India.
Your primary goal is to answer user queries about vendors, their locations, services, and operating hours.
Use the provided tools (Google Search and Google Maps) to find the most accurate and up-to-date information.
If a user asks about a location, leverage the Google Maps tool, especially if the user has provided their current location.
Keep your answers concise and relevant.
If you can, respond in the language of the user's query (English or Marathi).`;

export const getChatbotResponse = async (
  prompt: string,
  history: ChatMessage[],
  location: { latitude: number; longitude: number } | null
): Promise<{ text: string; grounding: GroundingChunk[] }> => {
  const aiInstance = getAiInstance();

  if (!aiInstance) {
    return {
      text: "I'm sorry, but I'm unable to connect to my services right now as my API key is missing. Please contact the administrator.",
      grounding: [],
    };
  }

  try {
    const chatHistory = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    const result = await aiInstance.models.generateContent({
        model: model,
        contents: [...chatHistory, { role: 'user', parts: [{ text: prompt }] }],
        config: {
            systemInstruction: systemInstruction,
            tools: [{ googleSearch: {} }, { googleMaps: {} }],
        },
        toolConfig: location ? {
            retrievalConfig: {
                latLng: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                },
            },
        } : undefined,
    });
    
    const response = result;
    const grounding = (response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[]) || [];

    return { text: response.text, grounding };
  } catch (error) {
    console.error("Error getting response from Gemini:", error);
    return {
      text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
      grounding: [],
    };
  }
};