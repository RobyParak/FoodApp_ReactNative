import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Send, Settings as SettingsIcon } from 'lucide-react-native';
import { GeminiService } from '../../lib/services/gemini.service';
import { Message, MessageSender } from '../../lib/models/chat';
import { useTheme } from '../../lib/ThemeContext';

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );
    animate(dot1, 0).start();
    animate(dot2, 200).start();
    animate(dot3, 400).start();
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: 4, paddingVertical: 4 }}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#8E8E93',
            opacity: dot,
          }}
        />
      ))}
    </View>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: MessageSender.ai,
      text: "Hi! I'm your food assistant. Tell me what you've eaten today! 🍎",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const text = inputText.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: MessageSender.user,
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      const response = await GeminiService.sendMessage(text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: MessageSender.ai,
        text: response.replyText,
        timestamp: new Date(),
        nutritionSummary: response.nutritionSummary,
        fromCache: response.fromCache,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: MessageSender.ai,
          text: error.message || "Sorry, I couldn't process that. Check your API key in Settings.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const userBubbleBg = isDark ? '#30D158' : '#34C759';
  const aiBubbleBg = isDark ? colors.elevated : colors.surface;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 49 : 0}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)',
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Food Log</Text>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
          style={[
            styles.settingsBtn,
            {
              backgroundColor: isDark ? colors.elevated : colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingsIcon size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === MessageSender.user;
          return (
            <View key={msg.id} style={[styles.msgRow, { alignSelf: isUser ? 'flex-end' : 'flex-start' }]}>
              <View
                style={[
                  styles.bubble,
                  {
                    backgroundColor: isUser ? userBubbleBg : aiBubbleBg,
                    borderTopRightRadius: isUser ? 6 : 20,
                    borderTopLeftRadius: isUser ? 20 : 6,
                    borderWidth: isUser ? 0 : isDark ? 1 : 0,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 16, lineHeight: 22, color: isUser ? '#fff' : colors.textPrimary }}>
                  {msg.text}
                </Text>
              </View>
              {msg.nutritionSummary && (
                <View
                  style={[
                    styles.nutritionCard,
                    {
                      backgroundColor: isDark ? colors.card : '#fff',
                      borderColor: colors.border,
                      borderLeftColor: colors.primary,
                    },
                  ]}
                >
                  <Text style={[styles.nutritionTitle, { color: colors.primary }]}>Nutrition</Text>
                  {msg.nutritionSummary.nutrients.map((n, i) => (
                    <View
                      key={i}
                      style={[
                        styles.nutrientRow,
                        {
                          borderBottomWidth: i < msg.nutritionSummary!.nutrients.length - 1 ? 0.5 : 0,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 13, color: colors.textSecondary, textTransform: 'capitalize' }}>{n.key}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textPrimary }}>{n.value}{n.unit}</Text>
                    </View>
                  ))}
                </View>
              )}
              <View style={[styles.timeRow, { alignSelf: isUser ? 'flex-end' : 'flex-start' }]}>
                <Text style={{ fontSize: 11, color: colors.textSecondary }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
                {msg.fromCache && (
                  <View style={[styles.cacheBadge, { backgroundColor: isDark ? 'rgba(48,209,88,0.18)' : 'rgba(52,199,89,0.12)' }]}>
                    <Text style={{ fontSize: 10, color: colors.primary, fontWeight: '600' }}>⚡ Cached</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
        {isLoading && (
          <View
            style={[
              styles.bubble,
              {
                alignSelf: 'flex-start',
                marginBottom: 16,
                backgroundColor: aiBubbleBg,
                borderTopLeftRadius: 6,
                borderWidth: isDark ? 1 : 0,
                borderColor: colors.border,
              },
            ]}
          >
            <TypingDots />
          </View>
        )}
      </ScrollView>

      {/* Input Bar — outside ScrollView, at the bottom */}
      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: 12,
          },
        ]}
      >
        <TextInput
          placeholder="Describe what you ate..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={400}
          value={inputText}
          onChangeText={setInputText}
          editable={true}
          autoCorrect={true}
          keyboardType="default"
          returnKeyType="send"
          blurOnSubmit={false}
          style={[
            styles.textInput,
            {
              color: colors.textPrimary,
              backgroundColor: isDark ? colors.elevated : colors.surface,
              borderColor: colors.border,
            },
          ]}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          activeOpacity={0.8}
          style={[
            styles.sendBtn,
            {
              backgroundColor: inputText.trim() && !isLoading ? colors.primary : isDark ? colors.elevated : '#E5E5EA',
            },
          ]}
        >
          <Send
            size={18}
            color={inputText.trim() && !isLoading ? '#fff' : colors.textSecondary}
            fill={inputText.trim() && !isLoading ? '#fff' : 'transparent'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  msgRow: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  bubble: {
    padding: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  nutritionCard: {
    marginTop: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 3,
  },
  nutritionTitle: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 4,
    gap: 6,
  },
  cacheBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: 0.5,
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 11,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 44,
    textAlignVertical: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});
