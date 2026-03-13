import { Tabs } from 'expo-router';
import { MessageSquare, BarChart2 } from 'lucide-react-native';
import { View } from 'react-native';
import { useTheme } from '../../lib/ThemeContext';

export default function TabsLayout() {
  const { isDark, colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? 'rgba(28, 28, 30, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          paddingTop: 6,
          height: 88,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.06,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <MessageSquare size={size - 2} color={color} strokeWidth={1.8} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: 'Summary',
          tabBarIcon: ({ color, size }) => (
            <View style={{ alignItems: 'center' }}>
              <BarChart2 size={size - 2} color={color} strokeWidth={1.8} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
