import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ChatMessage, GroundingChunk } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ChatbotResponse {
  text: string;
  grounding?: GroundingChunk[];
}

export async function getChatbotResponse(
  userMessage: string,
  chatHistory: ChatMessage[],
  location?: { latitude: number; longitude: number }
): Promise<ChatbotResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build context with location and vendor information
    let contextPrompt = `You are a helpful assistant for Nashik LocalKart, a platform connecting local vendors and customers in Nashik, Maharashtra, India.

Key information about Nashik LocalKart:
- Bilingual platform (English and Marathi)
- Focus on "Vocal for Local" initiative
- Main areas: Mhasrul, Panchavati, Tidke Nagar, Gangapur Road, College Road
- Vendor categories: Food, Grocery, Tailor, Electronics, Chemist, General Store, Cafe

Available vendors in the system:
- Bhavani Sweets & Snacks (Food) - Mhasrul Link Road
- Modern Tailors (Tailor) - Panchavati Karanja
- Nashik Kirana Store (Grocery) - Near Mhasrul Police Station
- Digital World Electronics (Electronics) - Opposite BYK College
- Wellness Medical (Chemist) - Serene Meadows, Gangapur Road
- Cafe Brewpoint (Cafe) - Near Ramkund, Panchavati

`;

    if (location) {
      contextPrompt += `User's current location: Latitude ${location.latitude}, Longitude ${location.longitude} (approximately Nashik area)\n\n`;
    }

    contextPrompt += `Please provide helpful, accurate information about local vendors, directions, or general questions about Nashik. If asked about vendors not in our system, suggest similar alternatives or general advice.

Chat history:
${chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n')}

User's new message: ${userMessage}

Respond in a helpful, friendly manner. If providing vendor information, include relevant details like location, contact info, and services.`;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    // For now, return without grounding chunks (can be enhanced later)
    return {
      text: text,
      grounding: []
    };

  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      text: 'Sorry, I encountered an error while processing your request. Please try again later.',
      grounding: []
    };
  }
}
