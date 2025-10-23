
import { GoogleGenAI, Type } from "@google/genai";
import { PhotoStyle } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function parseMenu(menu: string): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Parse the following restaurant menu. Extract only the names of the dishes. Return the result as a JSON array of strings. Do not include descriptions, prices, or categories. Menu: \n\n ${menu}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "The name of a single dish from the menu."
          }
        },
      },
    });

    const jsonString = response.text;
    const dishNames = JSON.parse(jsonString);
    
    if (Array.isArray(dishNames) && dishNames.every(item => typeof item === 'string')) {
      return dishNames;
    } else {
      throw new Error("Parsed menu is not a string array.");
    }

  } catch (error) {
    console.error("Error parsing menu with Gemini:", error);
    throw new Error("Failed to parse menu. The AI could not understand the format.");
  }
}

const getStylePrompt = (style: PhotoStyle): string => {
  switch (style) {
    case PhotoStyle.RUSTIC:
      return "Dark, moody, rustic aesthetic with dramatic side lighting. Shot on a dark wood or slate background with vintage props and a shallow depth of field.";
    case PhotoStyle.MODERN:
      return "Bright, clean, modern aesthetic with soft, natural light. Shot on a white or light-colored marble background with minimalist plating and sharp focus.";
    case PhotoStyle.SOCIAL:
      return "Vibrant, eye-catching social media style. Top-down flat lay perspective with bold colors, interesting composition, and props that tell a story. Perfect for Instagram.";
    default:
      return "A standard, high-quality food photograph.";
  }
};

export async function generateFoodImage(dishName: string, style: PhotoStyle): Promise<string> {
  const styleDescription = getStylePrompt(style);
  const prompt = `Professional, ultra-realistic, high-end food photography of "${dishName}". ${styleDescription} The food should look delicious and appealing. Shot with a professional DSLR camera, magazine quality.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '4:3',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages[0].image.imageBytes;
    } else {
      throw new Error("API did not return any images.");
    }
  } catch (error) {
    console.error(`Error generating image for "${dishName}":`, error);
    throw new Error(`Failed to generate an image for ${dishName}.`);
  }
}
