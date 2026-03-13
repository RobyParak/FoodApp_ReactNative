import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Target, TrendingUp, Droplets } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accentColor: string;
  accentBg: string;
}

function StatCard({ icon, label, value, accentColor, accentBg }: StatCardProps) {
  const { isDark, colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDark ? colors.card : '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.2 : 0.06,
        shadowRadius: 8,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: accentBg,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        {icon}
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '700',
          color: colors.textPrimary,
          marginBottom: 2,
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' }}>
        {label}
      </Text>
    </View>
  );
}

export default function SummaryScreen() {
  const { isDark, colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingTop: 52 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: colors.textPrimary,
            letterSpacing: -0.6,
            marginBottom: 4,
          }}
        >
          Summary
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.textSecondary,
            marginBottom: 28,
          }}
        >
          Your daily nutrition at a glance
        </Text>

        {/* Stat Cards - Row 1 */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <StatCard
            icon={<Flame size={18} color="#FF6B35" />}
            label="Calories"
            value="—"
            accentColor="#FF6B35"
            accentBg="rgba(255, 107, 53, 0.12)"
          />
          <StatCard
            icon={<Target size={18} color={colors.primary} />}
            label="Protein"
            value="—"
            accentColor={colors.primary}
            accentBg={isDark ? 'rgba(48, 209, 88, 0.18)' : 'rgba(52, 199, 89, 0.12)'}
          />
        </View>

        {/* Stat Cards - Row 2 */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
          <StatCard
            icon={<TrendingUp size={18} color="#5E5CE6" />}
            label="Carbs"
            value="—"
            accentColor="#5E5CE6"
            accentBg="rgba(94, 92, 230, 0.12)"
          />
          <StatCard
            icon={<Droplets size={18} color="#FF9F0A" />}
            label="Fat"
            value="—"
            accentColor="#FF9F0A"
            accentBg="rgba(255, 159, 10, 0.12)"
          />
        </View>

        {/* Daily Progress */}
        <View
          style={{
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            padding: 20,
            borderRadius: 20,
            marginBottom: 14,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.06,
            shadowRadius: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
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
              <TrendingUp size={18} color={colors.primary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
              Daily Progress
            </Text>
          </View>

          {/* Progress Bar Placeholder */}
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: isDark ? colors.elevated : colors.surface,
              marginBottom: 10,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                width: '0%',
                height: '100%',
                borderRadius: 4,
                backgroundColor: colors.primary,
              }}
            />
          </View>
          <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>
            Log your food to see your daily nutrition trends here.
          </Text>
        </View>

        {/* Goal Period */}
        <View
          style={{
            backgroundColor: isDark ? colors.card : '#FFFFFF',
            padding: 20,
            borderRadius: 20,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isDark ? 0.2 : 0.06,
            shadowRadius: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(94, 92, 230, 0.12)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Target size={18} color="#5E5CE6" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
              Goal Period
            </Text>
          </View>

          {/* Period Segments */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: isDark ? colors.elevated : colors.surface,
              borderRadius: 10,
              padding: 3,
              marginBottom: 10,
            }}
          >
            {['Daily', 'Weekly', 'Cycle'].map((period, index) => (
              <View
                key={period}
                style={{
                  flex: 1,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                  backgroundColor: index === 0 ? (isDark ? colors.card : '#FFFFFF') : 'transparent',
                  shadowColor: index === 0 ? '#000' : 'transparent',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: index === 0 ? 0.1 : 0,
                  shadowRadius: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: index === 0 ? '600' : '500',
                    color: index === 0 ? colors.textPrimary : colors.textSecondary,
                  }}
                >
                  {period}
                </Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            Daily tracking active.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
