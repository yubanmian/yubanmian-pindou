
import { GoogleGenAI } from "@google/genai";

// Fixed: The API key must be obtained exclusively from process.env.API_KEY and used directly in initialization.
export const generatePixelArtFromPrompt = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fullPrompt = `Create a high-quality pixel art design for Perler Beads (2D, flat colors, clear edges, sprite style) of: ${prompt}. Use a white background.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: fullPrompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
};

export const convertImageToPixelArt = async (base64Image: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = "Please convert this image into a clean, simplified 2D pixel art style suitable for Perler beads. Minimal shading, flat colors, and simplified shapes.";
  
  // Strip mime type prefix if exists
  const cleanBase64 = base64Image.split(',')[1] || base64Image;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: cleanBase64, mimeType: 'image/png' } },
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to convert image");
};

/**
 * Utility to process a generated pixel image back into an editable grid
 */
export const imageToGrid = (imgUrl: string, size: number = 50): Promise<string[][]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);
      
      ctx.drawImage(img, 0, 0, size, size);
      const imageData = ctx.getImageData(0, 0, size, size).data;
      const grid: string[][] = [];
      
      for (let y = 0; y < size; y++) {
        const row: string[] = [];
        for (let x = 0; x < size; x++) {
          const i = (y * size + x) * 4;
          const r = imageData[i];
          const g = imageData[i + 1];
          const b = imageData[i + 2];
          const a = imageData[i + 3];
          
          // Treat bright white or transparent as empty
          if (a < 50 || (r > 250 && g > 250 && b > 250)) {
            row.push(""); 
          } else {
            row.push(`#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`);
          }
        }
        grid.push(row);
      }
      resolve(grid);
    };
  });
};
