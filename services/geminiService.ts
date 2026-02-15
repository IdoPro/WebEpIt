
import { GoogleGenAI, Type } from "@google/genai";
import { SiteConfig, GenerationResult } from "../types";

export const generateSite = async (config: SiteConfig): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Generate a full production-ready React Vite application based on these specifications:
    - Prototype: ${config.prototype}
    - App Name: ${config.name}
    - Primary Color: "${config.primaryColor}"
    - Secondary Color: "${config.secondaryColor}"
    - Description: ${config.description}
    - Key Features: ${config.features.join(', ')}
    - Backend: MongoDB integration (use ${config.mongodbUri || 'placeholder'} if provided)
    - Storage: Backblaze (use ${config.backblazeKey || 'placeholder'} if provided)
    - IMPORTANT Language/Localization: The website content (titles, text, labels) MUST be in ${config.language === 'he' ? 'Hebrew (RTL supported)' : 'English'}.

    Specific Instructions for ${config.prototype}:
    ${config.prototype === 'Memorial Site' ? 'Make the UI dignified and respectful. Include a "Digital Candle" component that users can toggle. Ensure there is a section for life timeline and location map for memorials.' : ''}

    The output must be a JSON object containing an array of files with 'path' and 'content'.
    Include:
    - package.json (with dependencies like tailwindcss, lucide-react, framer-motion, axios)
    - tailwind.config.js (include RTL plugins if needed)
    - vite.config.ts
    - src/App.tsx (Full functional code. If Hebrew, use dir="rtl" on appropriate containers)
    - src/main.tsx
    - src/index.css
    - src/components/ (at least 3 components relevant to the prototype, e.g., for Memorial: Candle.tsx, Timeline.tsx, Gallery.tsx)
    - README.md with deployment instructions for Vercel and Render.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          files: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                path: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ['path', 'content']
            }
          },
          instructions: { type: Type.STRING }
        },
        required: ['files', 'instructions']
      }
    }
  });

  try {
    const text = response.text || '{}';
    const data = JSON.parse(text);
    return data as GenerationResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate site code. Please try again.");
  }
};
