import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DEFAULT_PROFILE } from '../models/profile';

const PROFILE_KEY = '@foodchat_profile';
const SETUP_COMPLETE_KEY = '@foodchat_setup_complete';

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const raw = await AsyncStorage.getItem(PROFILE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
      return { ...DEFAULT_PROFILE };
    } catch (error) {
      console.warn('Error reading profile:', error);
      return { ...DEFAULT_PROFILE };
    }
  },

  async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      await AsyncStorage.setItem(SETUP_COMPLETE_KEY, 'true');
      return true;
    } catch (error) {
      console.warn('Error saving profile:', error);
      return false;
    }
  },

  async hasCompletedSetup(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(SETUP_COMPLETE_KEY);
      return value === 'true';
    } catch {
      return false;
    }
  },

  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([PROFILE_KEY, SETUP_COMPLETE_KEY]);
    } catch (error) {
      console.warn('Error clearing profile:', error);
    }
  },
};
