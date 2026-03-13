import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatSendResponseDTO } from '../models/chat';

const CACHE_PREFIX = '@foodchat_cache:';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  response: ChatSendResponseDTO;
  timestamp: number;
}

/**
 * Normalize user input into a stable cache key.
 * Lowercases, strips punctuation, collapses whitespace.
 * e.g. "I had a Banana!" → "i had a banana"
 */
function normalizeKey(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const CacheService = {
  /**
   * Look up a cached nutrition response for the given input.
   * Returns null if no cache hit or if the entry has expired.
   */
  async getCached(input: string): Promise<ChatSendResponseDTO | null> {
    try {
      const key = CACHE_PREFIX + normalizeKey(input);
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;

      const entry: CacheEntry = JSON.parse(raw);
      const age = Date.now() - entry.timestamp;

      if (age > CACHE_TTL_MS) {
        // Expired — remove silently
        await AsyncStorage.removeItem(key);
        return null;
      }

      return { ...entry.response, fromCache: true };
    } catch (error) {
      console.warn('Cache read error:', error);
      return null;
    }
  },

  /**
   * Store a nutrition response in the local cache.
   */
  async setCached(input: string, response: ChatSendResponseDTO): Promise<void> {
    try {
      const key = CACHE_PREFIX + normalizeKey(input);
      const entry: CacheEntry = {
        response,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.warn('Cache write error:', error);
    }
  },

  /**
   * Clear all cached nutrition responses.
   */
  async clearCache(): Promise<number> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter((k) => k.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
      return cacheKeys.length;
    } catch (error) {
      console.warn('Cache clear error:', error);
      return 0;
    }
  },
};
