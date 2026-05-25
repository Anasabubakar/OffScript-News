import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key present:", !!apiKey);
  if (!apiKey) {
    console.log("No GEMINI_API_KEY in environment.");
    return;
  }
  
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } }
  });

  try {
    console.log("Testing basic generateContent...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello",
    });
    console.log("Success! Basic text:", response.text);
  } catch (err: any) {
    console.error("Failed basic generateContent:", err);
  }

  try {
    console.log("Testing search grounding generateContent...");
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "What is the latest news about Nigeria?",
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    console.log("Success! Grounding text:", response.text);
    console.log("Grounding metadata chunks:", JSON.stringify(response.candidates?.[0]?.groundingMetadata, null, 2));
  } catch (err: any) {
    console.error("Failed grounding generateContent:", err);
  }
}

main();
