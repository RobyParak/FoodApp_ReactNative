import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { KeychainService } from '../../lib/services/keychain.service';
import { CacheService } from '../../lib/services/cache.service';
import { ProfileService } from '../../lib/services/profile.service';
import { ArrowLeft, Eye, EyeOff, Key, Trash2, Shield, Database, UserCog } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const router = useRouter();
  const { isDark, colors } = useTheme();

  useEffect(() => {
    loadKey();
  }, []);

  const loadKey = async () => {
    const key = await KeychainService.getGeminiApiKey();
    if (key) setApiKey(key);
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Alert.alert('Error', 'Please enter an API key');
      return;
    }
    const success = await KeychainService.setGeminiApiKey(apiKey.trim());
    if (success) {
      Alert.alert('Saved', 'API Key stored securely', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } else {
      Alert.alert('Error', 'Failed to save API key');
    }
  };

  const handleReset = () => {
    Alert.alert('Reset API Key', 'This will remove your stored key. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await KeychainService.resetGeminiApiKey();
          setApiKey('');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#000000' : '#F2F2F7' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 32,
            marginTop: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: isDark ? colors.elevated : '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: isDark ? 1 : 0,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.2 : 0.08,
              shadowRadius: 6,
            }}
          >
            <ArrowLeft size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: colors.textPrimary,
            }}
          >
            Settings
          </Text>
          <View style={{ width: 38 }} />
        </View>

        {/* API Key Section */}
        <View
          style={{
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            borderRadius: 18,
            overflow: 'hidden',
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.06,
            shadowRadius: 8,
            marginBottom: 20,
          }}
        >
          {/* Section Header */}
          <View style={{ paddingHorizontal: 18, paddingTop: 18, paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: isDark ? 'rgba(48, 209, 88, 0.18)' : 'rgba(52, 199, 89, 0.12)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Key size={16} color={colors.primary} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: colors.textPrimary,
                }}
              >
                Gemini API Key
              </Text>
            </View>
          </View>

          {/* Separator */}
          <View
            style={{
              height: 0.5,
              backgroundColor: colors.border,
              marginHorizontal: 18,
            }}
          />

          {/* Input Row */}
          <View
            style={{
              paddingHorizontal: 18,
              paddingVertical: 14,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <TextInput
              value={apiKey}
              onChangeText={setApiKey}
              placeholder="Enter your API key"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showKey}
              style={{
                flex: 1,
                fontSize: 16,
                color: colors.textPrimary,
                paddingVertical: 4,
              }}
            />
            <TouchableOpacity
              onPress={() => setShowKey(!showKey)}
              activeOpacity={0.7}
              style={{ paddingLeft: 12 }}
            >
              {showKey ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Note */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingHorizontal: 4,
            marginBottom: 28,
          }}
        >
          <Shield size={14} color={colors.textSecondary} style={{ marginTop: 1, marginRight: 6 }} />
          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              lineHeight: 18,
              flex: 1,
            }}
          >
            Your API key is stored securely on-device and is only used locally to communicate with Gemini.
          </Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.primary,
            paddingVertical: 16,
            borderRadius: 14,
            alignItems: 'center',
            marginBottom: 14,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '600' }}>
            Save Configuration
          </Text>
        </TouchableOpacity>

        {/* Clear Cache */}
        <TouchableOpacity
          onPress={async () => {
            const count = await CacheService.clearCache();
            Alert.alert('Cache Cleared', `Removed ${count} cached food ${count === 1 ? 'entry' : 'entries'}.`);
          }}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            borderRadius: 14,
            marginBottom: 14,
            backgroundColor: isDark ? 'rgba(94, 92, 230, 0.12)' : 'rgba(94, 92, 230, 0.08)',
          }}
        >
          <Database size={16} color="#5E5CE6" />
          <Text
            style={{
              color: '#5E5CE6',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            Clear Food Cache
          </Text>
        </TouchableOpacity>

        {/* Reset Key */}
        <TouchableOpacity
          onPress={handleReset}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            borderRadius: 14,
            backgroundColor: isDark ? 'rgba(255, 69, 58, 0.12)' : 'rgba(255, 59, 48, 0.08)',
          }}
        >
          <Trash2 size={16} color="#FF453A" />
          <Text
            style={{
              color: '#FF453A',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            Reset API Key
          </Text>
        </TouchableOpacity>

        {/* Reset Profile */}
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Reset Profile', 'This will clear your profile and restart onboarding.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: async () => {
                  await ProfileService.clearProfile();
                  router.replace('/onboarding');
                },
              },
            ]);
          }}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            borderRadius: 14,
            marginTop: 14,
            backgroundColor: isDark ? 'rgba(255, 149, 0, 0.12)' : 'rgba(255, 149, 0, 0.08)',
          }}
        >
          <UserCog size={16} color="#FF9500" />
          <Text
            style={{
              color: '#FF9500',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            Reset Profile
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
