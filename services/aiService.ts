
import { GoogleGenAI } from "@google/genai";
import { PERLER_PALETTE } from "../types";

/**
 * Helper to find the nearest color in the palette
 */
const getNearestPaletteColor = (r: number, g: number, b: number): string => {
  let minDistance = Infinity;
  let nearestHex = PERLER_PALETTE[0].hex;

  for (const color of PERLER_PALETTE) {
    const pr = parseInt(color.hex.slice(1, 3), 16);
    const pg = parseInt(color.hex.slice(3, 5), 16);
    const pb = parseInt(color.hex.slice(5, 7), 16);

    const distance = Math.sqrt(
      Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestHex = color.hex;
    }
  }
  return nearestHex;
};

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
          if (a < 50 || (r > 245 && g > 245 && b > 245)) {
            row.push(""); 
          } else {
            // Snap to nearest palette color
            row.push(getNearestPaletteColor(r, g, b));
          }
        }
        grid.push(row);
      }
      resolve(grid);
    };
  });
};
