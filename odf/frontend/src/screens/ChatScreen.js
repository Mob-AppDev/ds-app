import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function ChatScreen({ route, navigation }) {
  const { type, user, conversationId } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Set header title
    navigation.setOptions({
      headerShown: true,
      headerTitle: type === 'dm' ? user.name : 'Chat',
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: 'white',
    });

    // Load initial messages
    setMessages([
      {
        _id: 1,
        text: 'Hello! How are you doing today?',
        createdAt: new Date(),
        user: {
          _id: user.id,
          name: user.name,
          avatar: user.avatar,
        },
      },
      {
        _id: 2,
        text: 'Hi there! I\'m doing great, thanks for asking. How about you?',
        createdAt: new Date(Date.now() - 60000),
        user: {
          _id: 'current_user',
          name: 'You',
        },
      },
    ]);
  }, [user, type]);

  const onSend = (newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages)
    );
    
    // Here you would typically send the message to your backend
    // and handle real-time updates via WebSocket
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.colors.primary,
          },
          left: {
            backgroundColor: theme.colors.surface,
          },
        }}
        textStyle={{
          right: {
            color: 'white',
          },
          left: {
            color: theme.colors.text,
          },
        }}
      />
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
    );
  };

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Ionicons name="send" size={20} color={theme.colors.primary} />
        </View>
      </Send>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 'current_user',
        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        placeholder="Type a message..."
        showUserAvatar={type !== 'dm'}
        alwaysShowSend
        scrollToBottom
        infiniteScroll
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  inputToolbar: {
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
  },
  inputPrimary: {
    alignItems: 'center',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    width: 40,
    height: 40,
  },
});