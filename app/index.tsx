import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useEffect, useRef } from 'react';
import { Apple, Chrome, Sparkles, UtensilsCrossed } from 'lucide-react-native';
import { useTheme } from '../lib/ThemeContext';

export default function LandingPage() {
  const router = useRouter();
  const { isDark, colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignIn = () => {
    router.replace('/onboarding');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 48 }}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* App Icon */}
          <View style={{ alignItems: 'center', marginBottom: 36 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? 'rgba(48, 209, 88, 0.18)' : 'rgba(52, 199, 89, 0.12)',
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 20,
              }}
            >
              <UtensilsCrossed size={44} color={colors.primary} strokeWidth={1.8} />
            </View>
          </View>

          {/* Welcome Text */}
          <View style={{ alignItems: 'center', marginBottom: 44 }}>
            <Text
              style={{
                fontSize: 36,
                fontWeight: '800',
                color: colors.textPrimary,
                textAlign: 'center',
                letterSpacing: -0.8,
                marginBottom: 12,
              }}
            >
              FoodChat
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: colors.textSecondary,
                textAlign: 'center',
                lineHeight: 24,
                paddingHorizontal: 16,
              }}
            >
              Log your food with natural language.{'\n'}From words to nutrition, instantly.
            </Text>
          </View>

          {/* Feature Cards */}
          <View style={{ marginBottom: 44 }}>
            <View
              style={{
                backgroundColor: isDark ? colors.card : colors.surface,
                padding: 20,
                borderRadius: 20,
                marginBottom: 12,
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: isDark ? 'rgba(48, 209, 88, 0.18)' : 'rgba(52, 199, 89, 0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Sparkles size={18} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
                  AI-Powered Logging
                </Text>
              </View>
              <Text style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22 }}>
                Just describe what you ate — our AI handles the nutrition breakdown for you.
              </Text>
            </View>

            <View
              style={{
                backgroundColor: isDark ? colors.card : colors.surface,
                padding: 20,
                borderRadius: 20,
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255, 159, 10, 0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 16 }}>🎯</Text>
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
                  Flexible Goals
                </Text>
              </View>
              <Text style={{ fontSize: 15, color: colors.textSecondary, lineHeight: 22 }}>
                Set daily, weekly, or cycle-based nutrition targets that fit your lifestyle.
              </Text>
            </View>
          </View>

          {/* Auth Buttons */}
          <View style={{ gap: 12 }}>
            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.textPrimary,
                paddingVertical: 16,
                borderRadius: 14,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDark ? 0.4 : 0.15,
                shadowRadius: 12,
              }}
            >
              <Apple size={20} color={colors.background} />
              <Text
                style={{
                  color: colors.background,
                  fontSize: 17,
                  fontWeight: '600',
                  marginLeft: 8,
                }}
              >
                Continue with Apple
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignIn}
              activeOpacity={0.85}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isDark ? colors.elevated : colors.surface,
                paddingVertical: 16,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Chrome size={18} color="#4285F4" />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 17,
                  fontWeight: '600',
                  marginLeft: 8,
                }}
              >
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}
