import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Avatar,
  Card,
  Menu,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function ChannelScreen({ route, navigation }) {
  const { channel } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    loadMessages();
    navigation.setOptions({
      headerShown: true,
      headerTitle: `#${channel.name}`,
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: 'white',
      headerRight: () => (
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              iconColor="white"
              onPress={() => setMenuVisible(true)}
            />
          }
        >
          <Menu.Item onPress={() => {}} title="Channel Info" />
          <Menu.Item onPress={() => {}} title="Members" />
          <Menu.Item onPress={() => {}} title="Pinned Messages" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Mute Channel" />
          <Menu.Item onPress={() => {}} title="Leave Channel" />
        </Menu>
      ),
    });
  }, [channel, menuVisible]);

  const loadMessages = () => {
    // Mock messages data
    setMessages([
      {
        id: 1,
        content: 'Welcome to the channel! 👋',
        sender: {
          id: 1,
          name: 'John Doe',
          avatar: null,
        },
        timestamp: '10:30 AM',
        reactions: [
          { emoji: '👋', count: 3, users: ['Jane', 'Mike', 'Sarah'] },
          { emoji: '🎉', count: 1, users: ['Mike'] },
        ],
        replies: [],
        edited: false,
      },
      {
        id: 2,
        content: 'Thanks for setting this up! Looking forward to collaborating here.',
        sender: {
          id: 2,
          name: 'Jane Smith',
          avatar: null,
        },
        timestamp: '10:32 AM',
        reactions: [],
        replies: [],
        edited: false,
      },
      {
        id: 3,
        content: 'Has anyone reviewed the latest design mockups? I\'d love to get some feedback.',
        sender: {
          id: 3,
          name: 'Mike Johnson',
          avatar: null,
        },
        timestamp: '10:45 AM',
        reactions: [
          { emoji: '👀', count: 2, users: ['John', 'Jane'] },
        ],
        replies: [
          {
            id: 31,
            content: 'I\'ll take a look this afternoon!',
            sender: { id: 1, name: 'John Doe' },
            timestamp: '10:46 AM',
          },
        ],
        edited: false,
      },
    ]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        content: newMessage,
        sender: {
          id: 'current_user',
          name: 'You',
          avatar: null,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reactions: [],
        replies: [],
        edited: false,
      };

      if (replyingTo) {
        // Add as reply
        setMessages(prev => prev.map(msg => 
          msg.id === replyingTo.id 
            ? { ...msg, replies: [...msg.replies, message] }
            : msg
        ));
        setReplyingTo(null);
      } else {
        // Add as new message
        setMessages(prev => [...prev, message]);
      }

      setNewMessage('');
    }
  };

  const addReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          // Toggle reaction
          if (existingReaction.users.includes('You')) {
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count - 1, users: r.users.filter(u => u !== 'You') }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            return {
              ...msg,
              reactions: msg.reactions.map(r => 
                r.emoji === emoji 
                  ? { ...r, count: r.count + 1, users: [...r.users, 'You'] }
                  : r
              )
            };
          }
        } else {
          // Add new reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1, users: ['You'] }]
          };
        }
      }
      return msg;
    }));
  };

  const renderMessage = ({ item }) => (
    <Card style={styles.messageCard}>
      <Card.Content style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Avatar.Text
            size={40}
            label={item.sender.name.split(' ').map(n => n[0]).join('')}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.messageInfo}>
            <View style={styles.senderInfo}>
              <Text variant="titleSmall" style={styles.senderName}>
                {item.sender.name}
              </Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {item.timestamp}
              </Text>
              {item.edited && (
                <Text variant="bodySmall" style={styles.editedLabel}>
                  (edited)
                </Text>
              )}
            </View>
            <Text variant="bodyMedium" style={styles.messageText}>
              {item.content}
            </Text>
          </View>
        </View>

        {/* Reactions */}
        {item.reactions.length > 0 && (
          <View style={styles.reactionsContainer}>
            {item.reactions.map((reaction, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.reactionChip,
                  reaction.users.includes('You') && styles.userReaction
                ]}
                onPress={() => addReaction(item.id, reaction.emoji)}
              >
                <Text style={styles.reactionText}>
                  {reaction.emoji} {reaction.count}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.addReactionButton}
              onPress={() => addReaction(item.id, '👍')}
            >
              <Ionicons name="add" size={16} color={theme.colors.placeholder} />
            </TouchableOpacity>
          </View>
        )}

        {/* Replies */}
        {item.replies.length > 0 && (
          <View style={styles.repliesContainer}>
            <Text variant="bodySmall" style={styles.repliesHeader}>
              {item.replies.length} {item.replies.length === 1 ? 'reply' : 'replies'}
            </Text>
            {item.replies.map((reply) => (
              <View key={reply.id} style={styles.replyItem}>
                <Avatar.Text
                  size={24}
                  label={reply.sender.name.split(' ').map(n => n[0]).join('')}
                  style={{ backgroundColor: theme.colors.secondary }}
                />
                <View style={styles.replyContent}>
                  <Text variant="bodySmall" style={styles.replySender}>
                    {reply.sender.name} {reply.timestamp}
                  </Text>
                  <Text variant="bodySmall">{reply.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Message Actions */}
        <View style={styles.messageActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => addReaction(item.id, '👍')}
          >
            <Ionicons name="thumbs-up-outline" size={16} color={theme.colors.placeholder} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setReplyingTo(item)}
          >
            <Ionicons name="chatbubble-outline" size={16} color={theme.colors.placeholder} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={16} color={theme.colors.placeholder} />
          </TouchableOpacity>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {replyingTo && (
        <View style={styles.replyingToContainer}>
          <Text variant="bodySmall" style={styles.replyingToText}>
            Replying to {replyingTo.sender.name}
          </Text>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Ionicons name="close" size={20} color={theme.colors.placeholder} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder={`Message #${channel.name}`}
          mode="outlined"
          multiline
          style={styles.messageInput}
          right={
            <TextInput.Icon
              icon="send"
              onPress={sendMessage}
              disabled={!newMessage.trim()}
            />
          }
        />
        <IconButton
          icon="attachment"
          size={24}
          onPress={() => {/* Handle attachment */}}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messagesList: {
    padding: theme.spacing.md,
  },
  messageCard: {
    marginBottom: theme.spacing.sm,
    elevation: 1,
  },
  messageContent: {
    paddingBottom: theme.spacing.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  messageInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  timestamp: {
    color: theme.colors.placeholder,
    marginRight: theme.spacing.sm,
  },
  editedLabel: {
    color: theme.colors.placeholder,
    fontStyle: 'italic',
  },
  messageText: {
    lineHeight: 20,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  reactionChip: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  userReaction: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  reactionText: {
    fontSize: 12,
  },
  addReactionButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  repliesContainer: {
    marginTop: theme.spacing.sm,
    paddingLeft: theme.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.border,
  },
  repliesHeader: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  replyItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xs,
  },
  replyContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  replySender: {
    color: theme.colors.placeholder,
    marginBottom: 2,
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  replyingToContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  replyingToText: {
    color: theme.colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  messageInput: {
    flex: 1,
    maxHeight: 100,
    marginRight: theme.spacing.sm,
  },
});