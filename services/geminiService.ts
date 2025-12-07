import { GoogleGenAI } from "@google/genai";
import { ModelType } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Extracts text from a base64 encoded image using the specified Gemini model.
 * @param base64Image The base64 string of the image (without the data prefix).
 * @param mimeType The mime type of the image.
 * @param model The model to use (flash or pro).
 * @returns The extracted text.
 */
export const extractTextFromImage = async (base64Image: string, mimeType: string, model: ModelType = 'gemini-2.5-flash'): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Please analyze this image and extract the text content efficiently for the user to copy.

            Instructions:
            1. **Structure:** If the image contains labeled fields (like "Username: abc", "Password: 123"), format them strictly as "Label: Value" on separate lines.
            2. **Clean:** Remove unrelated visual noise, decorative text, or generic headers (e.g., "Login Screen", "Welcome").
            3. **Format:** Do NOT use Markdown formatting (like bold **, italics *, or tables). Output plain text only.
            4. **Accuracy:** Transcribe characters exactly as they appear (case-sensitive).

            Output strictly the cleaned, structured text.`
          },
        ],
      },
    });

    return response.text || "No text could be extracted from this image.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Check for common API Key related errors
    const errorMsg = error.toString().toLowerCase();
    if (errorMsg.includes("api key") || errorMsg.includes("400") || errorMsg.includes("403")) {
        throw new Error("API 金鑰無效或權限不足 (403/400)。請檢查您的 API Key 設定。");
    }
    
    if (errorMsg.includes("503") || errorMsg.includes("overloaded")) {
         throw new Error("AI 模型目前過於繁忙，請稍後重試或切換模型。");
    }

    throw new Error("圖片分析失敗。請確認圖片清晰，或檢查網路連線後重試。");
  }
};