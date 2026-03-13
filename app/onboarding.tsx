import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import { useTheme } from '../lib/ThemeContext';
import { ProfileService } from '../lib/services/profile.service';
import {
  UserProfile,
  ChromosomeType,
  UnitSystem,
  WeightType,
  GoalType,
  CHROMOSOME_OPTIONS,
  GOAL_OPTIONS,
  TINT_COLORS,
  DEFAULT_PROFILE,
} from '../lib/models/profile';

export default function OnboardingScreen() {
  const [profile, setProfile] = useState<UserProfile>({ ...DEFAULT_PROFILE });
  const [saving, setSaving] = useState(false);
  const { isDark, colors } = useTheme();
  const router = useRouter();

  const isCompleteEnabled = profile.chromosome !== null;

  const update = (partial: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...partial }));
  };

  const handleComplete = async () => {
    if (!isCompleteEnabled || saving) return;
    setSaving(true);
    await ProfileService.saveProfile(profile);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 12 }}>
          {/* Progress Bar */}
          <View
            style={{
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.primary,
              marginBottom: 16,
            }}
          />
          <Text
            style={{
              fontSize: 34,
              fontWeight: '800',
              color: colors.textPrimary,
              letterSpacing: -0.8,
            }}
          >
            Your Profile
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: colors.textSecondary,
              marginTop: 8,
            }}
          >
            Help us personalize your nutrition goals
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Biological Sex */}
          <SectionTitle text="Biological Sex *" colors={colors} />
          {CHROMOSOME_OPTIONS.map((option) => {
            const isSelected = profile.chromosome === option.value;
            const tintColor = TINT_COLORS[option.tint];
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => update({ chromosome: option.value })}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  marginBottom: 10,
                  backgroundColor: isDark ? colors.card : colors.surface,
                  borderRadius: 20,
                  borderWidth: 2,
                  borderColor: isSelected ? tintColor : colors.border,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 14,
                    backgroundColor: isSelected
                      ? `${tintColor}1F`
                      : isDark
                        ? colors.elevated
                        : colors.surface,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 28,
                      color: isSelected ? tintColor : colors.textSecondary,
                    }}
                  >
                    {option.symbol}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 20,
                    fontWeight: '600',
                    color: isSelected ? tintColor : colors.textPrimary,
                    marginLeft: 16,
                  }}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: `${tintColor}33`,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color={tintColor} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Divider */}
          <View
            style={{
              height: 0.5,
              backgroundColor: colors.border,
              marginVertical: 20,
            }}
          />

          {/* Unit System */}
          <SectionTitle text="Unit System" colors={colors} />
          <View
            style={{
              flexDirection: 'row',
              padding: 4,
              backgroundColor: isDark ? colors.card : colors.surface,
              borderRadius: 12,
              marginBottom: 22,
            }}
          >
            {(['metric', 'imperial'] as UnitSystem[]).map((unit) => {
              const isSelected = profile.unit === unit;
              return (
                <TouchableOpacity
                  key={unit}
                  onPress={() => update({ unit })}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    shadowColor: isSelected ? '#000' : 'transparent',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: isSelected ? 0.1 : 0,
                    shadowRadius: 3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '500',
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Age */}
          <SectionTitle text="Age" colors={colors} />
          <TextInput
            placeholder="Enter your age"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            value={profile.age?.toString() ?? ''}
            onChangeText={(text) => {
              const num = parseInt(text, 10);
              update({ age: isNaN(num) ? null : num });
            }}
            style={{
              fontSize: 17,
              color: colors.textPrimary,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: isDark ? colors.card : colors.surface,
              borderRadius: 12,
              marginBottom: 22,
            }}
          />

          {/* Weight */}
          <SectionTitle text="Weight (Optional)" colors={colors} />
          <View
            style={{
              flexDirection: 'row',
              padding: 4,
              backgroundColor: isDark ? colors.card : colors.surface,
              borderRadius: 12,
              marginBottom: 12,
            }}
          >
            {(['precise', 'range'] as WeightType[]).map((wt) => {
              const isSelected = profile.weightType === wt;
              return (
                <TouchableOpacity
                  key={wt}
                  onPress={() => update({ weightType: wt, weight: null })}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      textTransform: 'capitalize',
                    }}
                  >
                    {wt === 'precise' ? 'Precise Value' : 'Range'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <TextInput
              placeholder={profile.weightType === 'range' ? 'e.g., 65-70' : 'e.g., 68'}
              placeholderTextColor={colors.textSecondary}
              keyboardType="default"
              value={profile.weight ?? ''}
              onChangeText={(text) => update({ weight: text || null })}
              style={{
                flex: 1,
                fontSize: 17,
                color: colors.textPrimary,
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: isDark ? colors.card : colors.surface,
                borderRadius: 12,
              }}
            />
            <Text style={{ fontSize: 17, color: colors.textSecondary, width: 46, textAlign: 'center' }}>
              {profile.unit === 'metric' ? 'kg' : 'lbs'}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 22 }}>
            {profile.weightType === 'range'
              ? 'Enter a range if you prefer not to specify exact weight'
              : 'Can be left blank if you prefer not to share'}
          </Text>

          {/* Height */}
          <SectionTitle text="Height" colors={colors} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 }}>
            <TextInput
              placeholder={profile.unit === 'metric' ? 'e.g., 175' : 'e.g., 5\'10"'}
              placeholderTextColor={colors.textSecondary}
              keyboardType="default"
              value={profile.height ?? ''}
              onChangeText={(text) => update({ height: text || null })}
              style={{
                flex: 1,
                fontSize: 17,
                color: colors.textPrimary,
                paddingHorizontal: 16,
                paddingVertical: 14,
                backgroundColor: isDark ? colors.card : colors.surface,
                borderRadius: 12,
              }}
            />
            <Text style={{ fontSize: 17, color: colors.textSecondary, width: 46, textAlign: 'center' }}>
              {profile.unit === 'metric' ? 'cm' : 'ft/in'}
            </Text>
          </View>

          {/* Goal */}
          <SectionTitle text="Goal *" colors={colors} />
          {GOAL_OPTIONS.map((option) => {
            const isSelected = profile.goal === option.value;
            return (
              <TouchableOpacity
                key={option.value}
                onPress={() => update({ goal: option.value })}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  marginBottom: 10,
                  backgroundColor: isDark ? colors.card : colors.surface,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: isSelected ? colors.primary : colors.border,
                }}
              >
                <Text style={{ fontSize: 28, marginRight: 14 }}>{option.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: isSelected ? colors.primary : colors.textPrimary,
                      marginBottom: 4,
                    }}
                  >
                    {option.label}
                  </Text>
                  <Text style={{ fontSize: 15, color: colors.textSecondary }}>
                    {option.subtitle}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: colors.primary,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          <TouchableOpacity
            onPress={handleComplete}
            disabled={!isCompleteEnabled || saving}
            activeOpacity={0.85}
            style={{
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor: colors.primary,
              opacity: isCompleteEnabled ? 1 : 0.5,
              shadowColor: isCompleteEnabled ? colors.primary : 'transparent',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isCompleteEnabled ? 0.3 : 0,
              shadowRadius: 10,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#FFFFFF' }}>
              {saving ? 'Saving…' : 'Complete Setup'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Reusable section title
function SectionTitle({ text, colors }: { text: string; colors: any }) {
  return (
    <Text
      style={{
        fontSize: 20,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: 12,
      }}
    >
      {text}
    </Text>
  );
}
