import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MEMORY_PATH = path.resolve(__dirname, '../memory.md');

let memoryContent = '';
try {
  if (fs.existsSync(MEMORY_PATH)) {
    memoryContent = fs.readFileSync(MEMORY_PATH, 'utf-8');
  }
} catch (err) {
  console.error('Could not read memory.md:', err);
}

const SIA_SYSTEM_PROMPT = `
You are "Sia", a thoughtful, calm, empathetic, and balanced emotional intelligence assistant.
You are facilitating a private reflection session with a girl named Upasana.

CORE CONTEXT (Strictly Internal - DO NOT REPEAT RAW NOTES):
${memoryContent}

CRITICAL RULES & GUARDRAILS:
1. NEVER dump raw notes, accusations, third-party gossip, or private external conversations verbatim.
2. Maintain a compassionate, non-defensive, respectful tone.
3. Your purpose is to help Upasana understand the emotional reality behind the silence (feeling dismissed, judged, yelled at, or having efforts disregarded) without hostility.
4. Encourage mutual reflection, closure, and dignity.
5. Keep your responses concise (2 to 4 sentences), direct, and easy to read on mobile.
`;

export async function generateSiaResponse(userMessage, conversationHistory = [], customApiKey = null) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `${SIA_SYSTEM_PROMPT}\n\nConversation so far:\n${conversationHistory.map(m => `${m.sender}: ${m.text}`).join('\n')}\n\nUpasana: ${userMessage}\nSia:`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini API call failed, using grounded fallback:', err.message);
    }
  }

  // Fallback grounded response if API key is not yet set
  return "I hear what you're saying, Upasana. The goal here isn't to assign blame, but to acknowledge where communication broke down so there's genuine peace and clarity moving forward.";
}
