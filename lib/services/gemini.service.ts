import { KeychainService } from './keychain.service';
import { CacheService } from './cache.service';
import { ChatSendResponseDTO } from '../models/chat';

const SYSTEM_PROMPT = `You are a concise nutrition assistant. For food input, return ONLY this JSON:
{"replyText":"<1-2 sentence reply>","nutritionSummary":{"nutrients":[{"key":"calories","value":<num>,"unit":"kcal"},{"key":"protein","value":<num>,"unit":"g"},{"key":"carbs","value":<num>,"unit":"g"},{"key":"fat","value":<num>,"unit":"g"},{"key":"fiber","value":<num>,"unit":"g"},{"key":"sugar","value":<num>,"unit":"g"}]}}
If no food detected, return: {"replyText":"<helpful reply>"}
No markdown. No explanation. Only valid JSON.`;

export const GeminiService = {
  async sendMessage(message: string): Promise<ChatSendResponseDTO> {
    // 1. Check local cache first
    const cached = await CacheService.getCached(message);
    if (cached) {
      return cached;
    }

    // 2. Validate API key
    const apiKey = await KeychainService.getGeminiApiKey();
    if (!apiKey) {
      throw new Error('Gemini API Key not found. Please configure it in Settings.');
    }

    // 3. Call Gemini API
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: message }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 300,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || `API error ${response.status}`;
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Empty response from AI.');
      }

      // Extract JSON from response (handles potential markdown wrapping)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed: ChatSendResponseDTO = JSON.parse(jsonMatch[0]);

        // 4. Cache the successful response
        await CacheService.setCached(message, parsed);

        return parsed;
      }

      return { replyText: text };
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      throw new Error(error.message || 'Failed to communicate with AI.');
    }
  },
};
