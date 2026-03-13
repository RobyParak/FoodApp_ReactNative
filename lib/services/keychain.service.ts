import * as SecureStore from 'expo-secure-store';

const GEMINI_API_KEY = 'gemini_api_key';

export const KeychainService = {
  async setGeminiApiKey(key: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(GEMINI_API_KEY, key);
      return true;
    } catch (error) {
      console.error('Error saving Gemini API key:', error);
      return false;
    }
  },

  async getGeminiApiKey(): Promise<string | null> {
    try {
      const value = await SecureStore.getItemAsync(GEMINI_API_KEY);
      return value;
    } catch (error) {
      console.error('Error retrieving Gemini API key:', error);
      return null;
    }
  },

  async resetGeminiApiKey(): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(GEMINI_API_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting Gemini API key:', error);
      return false;
    }
  },
};
