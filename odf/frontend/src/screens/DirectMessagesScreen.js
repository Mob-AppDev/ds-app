import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Badge,
  FAB,
  Searchbar,
} from 'react-native-paper';
import { theme } from '../theme/theme';

export default function DirectMessagesScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for now
  useEffect(() => {
    setConversations([
      {
        id: 1,
        user: {
          id: 1,
          name: 'John Doe',
          avatar: null,
          status: 'online',
        },
        lastMessage: 'Hey, how are you doing?',
        lastMessageTime: '2 min ago',
        unreadCount: 2,
      },
      {
        id: 2,
        user: {
          id: 2,
          name: 'Jane Smith',
          avatar: null,
          status: 'away',
        },
        lastMessage: 'Can we schedule a meeting for tomorrow?',
        lastMessageTime: '1 hour ago',
        unreadCount: 0,
      },
      {
        id: 3,
        user: {
          id: 3,
          name: 'Mike Johnson',
          avatar: null,
          status: 'offline',
        },
        lastMessage: 'Thanks for the help!',
        lastMessageTime: '3 hours ago',
        unreadCount: 1,
      },
    ]);
  }, []);

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Chat', { 
        type: 'dm',
        user: item.user,
        conversationId: item.id 
      })}
    >
      <Card style={styles.conversationCard}>
        <Card.Content style={styles.conversationContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={50}
              label={item.user.name.split(' ').map(n => n[0]).join('')}
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(item.user.status) }
            ]} />
          </View>
          
          <View style={styles.conversationInfo}>
            <View style={styles.conversationHeader}>
              <Text variant="titleMedium" style={styles.userName}>
                {item.user.name}
              </Text>
              <Text variant="bodySmall" style={styles.timestamp}>
                {item.lastMessageTime}
              </Text>
            </View>
            
            <Text 
              variant="bodyMedium" 
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
          </View>
          
          {item.unreadCount > 0 && (
            <Badge style={styles.unreadBadge}>{item.unreadCount}</Badge>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'away': return '#ffc107';
      case 'busy': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Direct Messages
        </Text>
      </View>

      <Searchbar
        placeholder="Search conversations"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="message-plus"
        style={styles.fab}
        onPress={() => {
          // Navigate to new message screen
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchbar: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  conversationCard: {
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: theme.colors.placeholder,
  },
  lastMessage: {
    color: theme.colors.placeholder,
  },
  unreadMessage: {
    color: theme.colors.text,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: theme.colors.notification,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});