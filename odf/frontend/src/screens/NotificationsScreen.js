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
  Switch,
  Divider,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme/theme';

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    mentions: true,
    directMessages: true,
    channelMessages: false,
    workspaceUpdates: true,
  });

  useEffect(() => {
    // Mock notifications data
    setNotifications([
      {
        id: 1,
        type: 'mention',
        title: 'John Doe mentioned you',
        message: '@you Hey, can you review this code?',
        channel: '#development',
        timestamp: '5 min ago',
        read: false,
        avatar: null,
      },
      {
        id: 2,
        type: 'direct_message',
        title: 'New message from Jane Smith',
        message: 'The meeting has been moved to 3 PM',
        timestamp: '15 min ago',
        read: false,
        avatar: null,
      },
      {
        id: 3,
        type: 'channel_message',
        title: 'New message in #general',
        message: 'Welcome to the team, everyone!',
        timestamp: '1 hour ago',
        read: true,
        avatar: null,
      },
      {
        id: 4,
        type: 'workspace_update',
        title: 'Workspace updated',
        message: 'New channel #design-feedback has been created',
        timestamp: '2 hours ago',
        read: true,
        avatar: null,
      },
    ]);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'mention':
        return 'at-outline';
      case 'direct_message':
        return 'chatbubble-outline';
      case 'channel_message':
        return 'hashtag';
      case 'workspace_update':
        return 'business-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'mention':
        return theme.colors.notification;
      case 'direct_message':
        return theme.colors.primary;
      case 'channel_message':
        return theme.colors.accent;
      case 'workspace_update':
        return theme.colors.secondary;
      default:
        return theme.colors.placeholder;
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        markAsRead(item.id);
        // Navigate to relevant screen based on notification type
        if (item.type === 'direct_message') {
          navigation.navigate('Chat', { type: 'dm' });
        } else if (item.type === 'mention' || item.type === 'channel_message') {
          navigation.navigate('Channel', { channelName: item.channel });
        }
      }}
    >
      <Card style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification
      ]}>
        <Card.Content style={styles.notificationContent}>
          <View style={styles.notificationIcon}>
            <Ionicons
              name={getNotificationIcon(item.type)}
              size={24}
              color={getNotificationColor(item.type)}
            />
          </View>
          
          <View style={styles.notificationInfo}>
            <Text variant="titleSmall" style={styles.notificationTitle}>
              {item.title}
            </Text>
            <Text 
              variant="bodyMedium" 
              style={styles.notificationMessage}
              numberOfLines={2}
            >
              {item.message}
            </Text>
            <Text variant="bodySmall" style={styles.notificationTimestamp}>
              {item.timestamp}
            </Text>
          </View>
          
          {!item.read && (
            <View style={styles.unreadDot} />
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderSettings = () => (
    <View style={styles.settingsSection}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Notification Settings
      </Text>
      
      <Card style={styles.settingsCard}>
        <Card.Content>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="titleSmall">Mentions</Text>
              <Text variant="bodySmall" style={styles.settingDescription}>
                Get notified when someone mentions you
              </Text>
            </View>
            <Switch
              value={settings.mentions}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, mentions: value }))
              }
            />
          </View>
          
          <Divider style={styles.settingDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="titleSmall">Direct Messages</Text>
              <Text variant="bodySmall" style={styles.settingDescription}>
                Get notified for new direct messages
              </Text>
            </View>
            <Switch
              value={settings.directMessages}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, directMessages: value }))
              }
            />
          </View>
          
          <Divider style={styles.settingDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="titleSmall">Channel Messages</Text>
              <Text variant="bodySmall" style={styles.settingDescription}>
                Get notified for all channel messages
              </Text>
            </View>
            <Switch
              value={settings.channelMessages}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, channelMessages: value }))
              }
            />
          </View>
          
          <Divider style={styles.settingDivider} />
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text variant="titleSmall">Workspace Updates</Text>
              <Text variant="bodySmall" style={styles.settingDescription}>
                Get notified about workspace changes
              </Text>
            </View>
            <Switch
              value={settings.workspaceUpdates}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, workspaceUpdates: value }))
              }
            />
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <Badge style={styles.headerBadge}>{unreadCount}</Badge>
        )}
      </View>

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {unreadCount > 0 && (
              <Button
                mode="text"
                onPress={markAllAsRead}
                style={styles.markAllButton}
              >
                Mark all as read
              </Button>
            )}
          </View>
        }
        ListFooterComponent={renderSettings}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color={theme.colors.placeholder} />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No notifications
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              You're all caught up!
            </Text>
          </View>
        }
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl + 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerBadge: {
    backgroundColor: theme.colors.notification,
  },
  listContainer: {
    padding: theme.spacing.md,
  },
  listHeader: {
    alignItems: 'flex-end',
    marginBottom: theme.spacing.sm,
  },
  markAllButton: {
    marginRight: -theme.spacing.sm,
  },
  notificationCard: {
    marginBottom: theme.spacing.sm,
    elevation: 1,
  },
  unreadNotification: {
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    alignItems: 'center',
    paddingTop: 2,
  },
  notificationInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  notificationMessage: {
    color: theme.colors.text,
    marginBottom: 4,
  },
  notificationTimestamp: {
    color: theme.colors.placeholder,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
  },
  settingsSection: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },
  settingsCard: {
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  settingInfo: {
    flex: 1,
  },
  settingDescription: {
    color: theme.colors.placeholder,
    marginTop: 2,
  },
  settingDivider: {
    marginVertical: theme.spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    color: theme.colors.placeholder,
  },
  emptySubtitle: {
    color: theme.colors.placeholder,
    textAlign: 'center',
  },
});