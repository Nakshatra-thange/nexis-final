import OpenAI from "openai";

export const aiClient = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
   // 🔥 must exist in .env
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:5173",
    "X-Title": "Smooth AI",
  },
  
});
console.log("AI KEY LOADED:", !!process.env.OPENROUTER_API_KEY);

