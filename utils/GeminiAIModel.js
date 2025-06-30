// GeminiAI.js
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

const config = {
  thinkingConfig: {
    thinkingBudget: 0,
  },
  responseMimeType: 'text/plain',
};

const model = 'gemini-1.5-flash';

export async function getGeminiResponse(userInput) {
  const contents = [
    {
      role: 'user',
      parts: [{ text: userInput }],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullText = '';
  for await (const chunk of response) {
    fullText += chunk.text || '';
  }

  return fullText;
}
