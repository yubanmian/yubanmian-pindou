
import { GoogleGenAI, Type } from "@google/genai";
import { Inspiration } from "../types";

// Fixed: The API key must be obtained exclusively from process.env.API_KEY and used directly in initialization.
export const fetchDailyInspiration = async (topic: string = "random science fact"): Promise<Inspiration> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a daily inspiration encyclopedia card about: ${topic}. 
    IMPORTANT: Provide the response in JSON format. 
    IMPORTANT: All text content (title, category, explanation, tags, discipline) must be in Simplified Chinese (简体中文).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          category: { type: Type.STRING, description: "e.g., 今日百科" },
          explanation: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          discipline: { type: Type.STRING },
          imageUrl: { type: Type.STRING, description: "A high-quality Unsplash image URL related to the topic" }
        },
        required: ["title", "category", "explanation", "tags", "discipline", "imageUrl"]
      }
    }
  });

  try {
    // Fixed: Always access the generated text via the .text property (not a method).
    const data = JSON.parse(response.text || "{}") as Inspiration;
    // Overriding image for reliability if gemini returns placeholder or broken link
    if (!data.imageUrl || data.imageUrl.includes('placeholder')) {
        data.imageUrl = `https://picsum.photos/800/1000?random=${Math.random()}`;
    }
    return data;
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      title: "为什么天空是蓝色的？",
      category: "今日百科",
      explanation: "瑞利散射效应。当阳光进入地球大气层，与空气分子发生碰撞，波长较短的蓝紫光更容易被散射到各个方向。",
      tags: ["瑞利散射"],
      discipline: "光学物理",
      imageUrl: "https://picsum.photos/800/1000?random=1"
    };
  }
};
