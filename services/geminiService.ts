import { PhotoStyle } from '../types';
import 'react-native-get-random-values';
import * as FileSystem from 'expo-file-system';

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("EXPO_PUBLIC_GEMINI_API_KEY environment variable not set");
}

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

export async function parseMenu(menu: string): Promise<string[]> {
  try {
    const requestBody = {
      contents: [{
        parts: [{
          text: `Parse the following restaurant menu. Extract only the names of the dishes. Return the result as a JSON array of strings. Do not include descriptions, prices, or categories. If the input is just a single dish name or a few words, treat each line or comma-separated item as a dish. Menu: \n\n ${menu}`
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "STRING",
            description: "The name of a single dish from the menu."
          }
        }
      }
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      if (__DEV__) {
        console.error('Gemini API error response:', errorData);
      }
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const jsonString = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const dishNames = JSON.parse(jsonString);

    if (Array.isArray(dishNames) && dishNames.every(item => typeof item === 'string')) {
      return dishNames;
    } else {
      throw new Error("Parsed menu is not a string array.");
    }

  } catch (error: any) {
    if (__DEV__) {
      console.error("Error parsing menu with Gemini:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    }

    // Get error details from various possible error structures
    const errorMsg = error?.message || '';
    const errorStatus = error?.status || error?.error?.status || '';
    const errorCode = error?.code || error?.error?.code || 0;

    if (__DEV__) {
      console.log('Error breakdown:', { errorMsg, errorStatus, errorCode });
    }

    // Check for specific error types and provide user-friendly messages
    if (errorCode === 503 || errorStatus === 'UNAVAILABLE' || errorMsg.includes('503') || errorMsg.includes('overloaded') || errorMsg.includes('UNAVAILABLE')) {
      throw new Error("The AI service is currently overloaded. Please wait a moment and try again.");
    } else if (errorCode === 429 || errorStatus === 'RESOURCE_EXHAUSTED' || errorMsg.includes('429') || errorMsg.includes('rate limit') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("Too many requests. Please wait a minute and try again.");
    } else if (errorStatus === 'NETWORK_ERROR' || errorMsg.includes('network') || errorMsg.includes('NETWORK_ERROR') || errorMsg.includes('Network request failed')) {
      throw new Error("Network error. Please check your internet connection and try again.");
    } else if (errorCode === 400 || errorStatus === 'INVALID_ARGUMENT' || errorMsg.includes('400') || errorMsg.includes('INVALID_ARGUMENT')) {
      throw new Error("Invalid menu format. Please check your menu text and try again.");
    } else {
      // Include more details in the error for debugging
      const debugInfo = errorMsg || errorStatus || 'Unknown error';
      throw new Error(`Failed to parse menu: ${debugInfo}. Please try again.`);
    }
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

export async function extractTextFromImage(imageUri: string): Promise<string> {
  try {
    if (__DEV__) {
      console.log('Extracting text from menu image...');
    }

    // Read the image as base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Use Gemini's multimodal capabilities to extract text via REST API
    const requestBody = {
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          },
          {
            text: "Extract all the text from this menu image. Return only the text content, preserving the structure and layout as much as possible. Include dish names, descriptions, and any other text visible in the menu."
          }
        ]
      }]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      if (__DEV__) {
        console.error('Gemini API error response:', errorData);
      }
      throw new Error(`HTTP ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (__DEV__) {
      console.log('Text extracted successfully from image');
    }
    return extractedText;
  } catch (error: any) {
    if (__DEV__) {
      console.error("Error extracting text from image:", error);
    }

    // Get error details from various possible error structures
    const errorMsg = error?.message || '';
    const errorStatus = error?.status || error?.error?.status || '';
    const errorCode = error?.code || error?.error?.code || 0;

    // Check for specific error types and provide user-friendly messages
    if (errorCode === 503 || errorStatus === 'UNAVAILABLE' || errorMsg.includes('503') || errorMsg.includes('overloaded') || errorMsg.includes('UNAVAILABLE')) {
      throw new Error("The AI service is currently overloaded. Please wait a moment and try scanning again.");
    } else if (errorCode === 429 || errorStatus === 'RESOURCE_EXHAUSTED' || errorMsg.includes('429') || errorMsg.includes('rate limit') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
      throw new Error("Too many requests. Please wait a minute and try again.");
    } else if (errorStatus === 'NETWORK_ERROR' || errorMsg.includes('network') || errorMsg.includes('NETWORK_ERROR') || errorMsg.includes('Network request failed')) {
      throw new Error("Network error. Please check your internet connection and try again.");
    } else if (errorCode === 400 || errorStatus === 'INVALID_ARGUMENT' || errorMsg.includes('400') || errorMsg.includes('INVALID_ARGUMENT')) {
      throw new Error("Could not process the image. Please try taking another photo.");
    } else {
      throw new Error("Failed to extract text from the menu image. Please try again or type the menu manually.");
    }
  }
}

export async function generateFoodImage(dishName: string, style: PhotoStyle): Promise<string> {
  const styleDescription = getStylePrompt(style);
  const prompt = `Professional, ultra-realistic, high-end food photography of "${dishName}". ${styleDescription} The food should look delicious and appealing. Shot with a professional DSLR camera, magazine quality.`;

  try {
    // Using Pollinations.ai - free image generation API
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&enhance=true`;

    if (__DEV__) {
      console.log(`Generating image for "${dishName}"...`);
    }

    // Download and convert to base64 using expo-file-system
    const fileUri = FileSystem.cacheDirectory + `${dishName.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`;
    const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

    if (downloadResult.status !== 200) {
      throw new Error(`Image download failed: ${downloadResult.status}`);
    }

    // Read as base64
    const base64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (__DEV__) {
      console.log(`Image generated successfully for "${dishName}"`);
    }
    return base64;
  } catch (error) {
    if (__DEV__) {
      console.error(`Error generating image for "${dishName}":`, error);
    }
    throw new Error(`Failed to generate an image for ${dishName}.`);
  }
}
