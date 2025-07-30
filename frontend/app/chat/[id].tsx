import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  Modal,
  Image,
  Keyboard,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Send, Paperclip, Smile, MoreVertical, Hash, Users, Phone, Star, Plus, Copy, MessageSquare, Trash2, Edit, MoreHorizontal } from 'lucide-react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Video, ResizeMode } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import { socketService } from '../../src/services/socketService';

/**
 * Chat screen combining the best UI elements from AL and Mike implementations
 * with real-time messaging functionality from ODF implementation
 */
interface Message {
  id: string;
  text: string;
  sender: string;
  senderAvatar: string;
  timestamp: string;
  isCurrentUser: boolean;
  reactions?: Array<{ emoji: string; count: number; users: string[] }>;
  thread?: number;
  attachments?: Array<{ type: 'image' | 'file'; name: string; url: string; mimeType?: string }>;
  hasImage?: boolean;
  imageUrl?: string;
}

interface ChannelInfo {
  name: string;
  type: 'channel' | 'dm';
  memberCount?: number;
  isPrivate?: boolean;
  description?: string;
}

// Mock user data - in production this would come from API
const users: Record<string, { name: string; initials: string; color: string; online: boolean }> = {
  'caleb-adams': { name: 'Caleb Adams', initials: 'C', color: '#E94F37', online: false },
  'michael-oti-yamoah': { name: 'Michael Oti Yamoah', initials: 'M', color: '#F6C85F', online: true },
  'hakeem-adam': { name: 'Hakeem Adam', initials: 'H', color: '#43BCCD', online: true },
};

const channels: Record<string, { name: string }> = {
  'announcements': { name: 'announcements' },
  'general': { name: 'general' },
  'main': { name: 'main' },
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

function getUserByIdOrName(id: string, name?: string) {
  let slug = id;
  const user = users[slug];
  if (user) return user;
  
  // Fallback for new users
  const displayName = name || slug.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    name: displayName,
    initials: getInitials(displayName),
    color: '#7C3AED',
    online: false,
  };
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messageText, setMessageText] = useState('');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  
  const [channelInfo] = useState<ChannelInfo>(() => {
    if (typeof id === 'string' && id.startsWith('dm-')) {
      const userId = id.replace('dm-', '');
      const user = getUserByIdOrName(userId);
      return {
        name: user ? user.name : `User ${userId}`,
        type: 'dm',
      };
    }
    
    // For channels
    let channelSlug = id as string;
    const channel = channels[channelSlug];
    let channelDisplayName;
    if (channel) {
      channelDisplayName = `#${channel.name}`;
    } else {
      channelDisplayName = '#' + channelSlug.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return {
      name: channelDisplayName,
      type: 'channel',
      memberCount: 9,
      isPrivate: false,
      description: 'Channel description',
    };
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to DevSync! This is where your team collaboration begins.',
      sender: 'Caleb Adams',
      senderAvatar: 'C',
      timestamp: '9:00 AM',
      isCurrentUser: false,
    },
    {
      id: '2',
      text: 'Hello everyone! Excited to be working with this amazing team.',
      sender: 'Michael Oti Yamoah',
      senderAvatar: 'M',
      timestamp: '9:05 AM',
      isCurrentUser: false,
    },
    {
      id: '3',
      text: 'Good morning! Let\'s build something great together.',
      sender: 'Hakeem Adam',
      senderAvatar: 'H',
      timestamp: '9:10 AM',
      isCurrentUser: false,
    },
  ]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);

  useEffect(() => {
    // Connect to WebSocket for real-time messaging
    socketService.connect().then(() => {
      socketService.joinChannel(id as string);
      
      socketService.onNewMessage((message) => {
        setMessages(prev => [...prev, {
          id: message.id,
          text: message.content,
          sender: message.sender.name,
          senderAvatar: message.sender.name.charAt(0),
          timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCurrentUser: false,
        }]);
      });
    });

    return () => {
      socketService.leaveChannel(id as string);
    };
  }, [id]);

  const handleEmojiPress = () => setShowEmojiPicker(true);
  
  const handleAttachPress = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (res && !res.canceled && res.assets && res.assets.length > 0) {
        const { name, uri, mimeType } = res.assets[0];
        if (uri) {
          setMessages(prev => [
            ...prev,
            {
              id: (prev.length + 1).toString(),
              text: name,
              sender: 'You',
              senderAvatar: 'Y',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isCurrentUser: true,
              attachments: [{ type: 'file', name, url: uri, mimeType }],
            },
          ]);
          setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
          }, 100);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick file.');
      console.log('Picker error:', err);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageText(messageText + emoji);
    setShowEmojiPicker(false);
  };

  const handleSend = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: (messages.length + 1).toString(),
        text: messageText,
        sender: 'You',
        senderAvatar: 'Y',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCurrentUser: true,
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Send via WebSocket
      socketService.sendMessage(id as string, messageText);
      
      setMessageText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleMessageLongPress = (message: Message) => {
    setSelectedMessage(message);
    setSelectedUserName(message.sender);
    setShowActionSheet(true);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setShowActionSheet(false);
    // Add reaction logic here
  };

  const ActionSheet = () => (
    <Modal
      visible={showActionSheet}
      transparent
      animationType="slide"
      onRequestClose={() => { setShowActionSheet(false); setSelectedUserName(null); }}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.modalBackground}
          onPress={() => { setShowActionSheet(false); setSelectedUserName(null); }}
        />
        <View style={styles.actionSheet}>
          <View style={styles.reactionRow}>
            {['😀', '👍', '😡', '👿', '🎉', '❤️'].map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionButton}
                onPress={() => handleReaction(selectedMessage?.id || '', emoji)}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Edit size={20} color="#4A9EFF" />
              <Text style={styles.actionButtonText}>Edit Message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Trash2 size={20} color="#FF6B6B" />
              <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>Delete message</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Copy size={20} color="#4A9EFF" />
              <Text style={styles.actionButtonText}>Copy Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <MessageSquare size={20} color="#4A9EFF" />
              <Text style={styles.actionButtonText}>Reply in Thread</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => { setShowActionSheet(false); setSelectedUserName(null); }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderMessage = (message: Message) => {
    const userData = getUserByIdOrName(message.sender);
    const user = {
      name: userData.name,
      initials: userData.initials,
      color: userData.color,
      online: userData.online,
    };

    return (
      <TouchableOpacity
        key={message.id}
        style={styles.messageContainer}
        onLongPress={() => handleMessageLongPress(message)}
        onPress={() => setSelectedUserName(message.sender)}
      >
        <View style={styles.messageHeader}>
          <View style={[styles.senderAvatar, { backgroundColor: user.color }]}> 
            <Text style={styles.avatarText}>{user.initials}</Text>
            {user.online && <View style={styles.onlineDot} />}
          </View>
          <Text style={styles.senderName}>{user.name}</Text>
          <Text style={styles.messageTime}>{message.timestamp}</Text>
        </View>
        <View style={styles.messageContent}>
          {message.hasImage && message.imageUrl && (
            <Image source={{ uri: message.imageUrl }} style={styles.messageImage} />
          )}
          {message.attachments && message.attachments.length > 0 && message.attachments.map((att, idx) => {
            const isAttachmentImage = att.mimeType && att.mimeType.startsWith('image/');
            const isAttachmentVideo = att.mimeType && att.mimeType.startsWith('video/');
            
            if (isAttachmentImage) {
              return (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Image source={{ uri: att.url }} style={styles.messageImage} />
                </View>
              );
            }
            
            if (isAttachmentVideo) {
              return (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Video
                    source={{ uri: att.url }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    style={{ width: 200, height: 150, borderRadius: 8, backgroundColor: '#000' }}
                  />
                </View>
              );
            }
            
            return (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ fontSize: 18, marginRight: 6 }}>📄</Text>
                <Text style={{ color: '#4A154B', textDecorationLine: 'underline', marginRight: 8 }}>{att.name}</Text>
              </View>
            );
          })}
          <Text style={styles.messageText}>{message.text}</Text>
        </View>
        {message.reactions && message.reactions.length > 0 && (
          <View style={styles.reactionsContainer}>
            {message.reactions.map((reaction, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reactionBubble}
                onPress={() => handleReaction(message.id, reaction.emoji)}
              >
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
                <Text style={styles.reactionCount}>{reaction.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
    return () => {
      showSubscription.remove();
    };
  }, []);

  const headerUser = selectedUserName
    ? getUserByIdOrName(selectedUserName)
    : (channelInfo.type === 'dm'
        ? getUserByIdOrName(channelInfo.name)
        : null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'left', 'right']}>
        <View style={{ flex: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <View style={styles.headerTitle}>
                <View style={[styles.recipientAvatar, { backgroundColor: headerUser ? headerUser.color : '#4A154B' }]}> 
                  <Text style={styles.avatarText}>{headerUser ? headerUser.initials : '#'}</Text>
                  {headerUser && headerUser.online && <View style={styles.onlineDot} />}
                </View>
                <Text style={styles.headerTitleText}>{channelInfo.name}</Text>
              </View>
              {channelInfo.memberCount && (
                <Text style={styles.headerSubtitle}>
                  {channelInfo.memberCount} Members
                </Text>
              )}
            </View>
            <View style={styles.headerActions}>
              {channelInfo.type === 'channel' && (
                <TouchableOpacity style={styles.headerButton}>
                  <Users size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.headerButton} onPress={() => { setShowInfoModal(true); setSelectedUserName(null); }}>
                <MoreHorizontal size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingVertical: 16 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Message Input */}
          <View style={[styles.inputContainer, { paddingBottom: Math.max(Math.min(insets.bottom, 24), 8) }]}> 
            <View style={styles.inputRow}>
              <View style={styles.messageInputContainer}>
                <TouchableOpacity style={styles.attachButton} onPress={handleAttachPress}>
                  <Paperclip size={20} color="#8B8D97" />
                </TouchableOpacity>
                <TextInput
                  style={styles.messageInput}
                  placeholder={`Message ${channelInfo.type === 'channel' ? '#' : ''}${channelInfo.name}`}
                  placeholderTextColor="#8B8D97"
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  maxLength={1000}
                  autoCorrect={false}
                  autoCapitalize="sentences"
                />
                <TouchableOpacity style={styles.emojiButton} onPress={handleEmojiPress}>
                  <Smile size={20} color="#8B8D97" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    messageText.trim() && styles.sendButtonActive
                  ]}
                  onPress={handleSend}
                  disabled={!messageText.trim()}
                >
                  <Send size={18} color={messageText.trim() ? '#FFFFFF' : '#8B8D97'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Emoji Picker Modal */}
          <Modal
            visible={showEmojiPicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowEmojiPicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}>
              <View style={{ backgroundColor: '#fff', padding: 24, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Pick an emoji</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {['😀','😂','😍','😎','😭','😡','👍','🎉','❤️','🔥','🙏','😅'].map(e => (
                    <TouchableOpacity key={e} onPress={() => handleEmojiSelect(e)} style={{ padding: 8 }}>
                      <Text style={{ fontSize: 28 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity onPress={() => setShowEmojiPicker(false)} style={{ marginTop: 16, alignSelf: 'flex-end' }}>
                  <Text style={{ color: '#4A154B', fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <ActionSheet />
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4A154B',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1D29',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    color: '#8B8D97',
  },
  messageContent: {
    marginLeft: 40,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 15,
    color: '#1A1D29',
    lineHeight: 22,
  },
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 40,
    marginTop: 8,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  reactionEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: '#4A154B',
    fontWeight: '500',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 4,
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1D29',
    maxHeight: 100,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#4A154B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBackground: {
    flex: 1,
  },
  actionSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  reactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reactionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    paddingTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#4A9EFF',
    marginLeft: 12,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  recipientAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
    borderWidth: 1,
    borderColor: '#fff',
  },
});