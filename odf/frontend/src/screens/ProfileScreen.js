import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  Button,
  TextInput,
  Switch,
  Divider,
  List,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../theme/theme';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState({
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePhoto: null,
    status: 'online',
    title: 'Software Developer',
    phone: '+1 (555) 123-4567',
  });
  
  const [editing, setEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    soundEnabled: true,
    showOnlineStatus: true,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(prev => ({ ...prev, ...parsedUser }));
        setEditedUser(prev => ({ ...prev, ...parsedUser }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to change your profile photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setEditedUser(prev => ({ ...prev, profilePhoto: result.assets[0].uri }));
    }
  };

  const handleSave = async () => {
    try {
      // Update user data
      setUser(editedUser);
      await SecureStore.setItemAsync('userData', JSON.stringify(editedUser));
      setEditing(false);
      
      // Here you would typically make an API call to update the user profile
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setEditing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userData');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'away': return '#ffc107';
      case 'busy': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Profile
        </Text>
        {!editing && (
          <Button
            mode="text"
            onPress={() => setEditing(true)}
            textColor="white"
          >
            Edit
          </Button>
        )}
      </View>

      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileContent}>
          <TouchableOpacity
            onPress={editing ? handleImagePicker : undefined}
            style={styles.avatarContainer}
          >
            <Avatar.Image
              size={100}
              source={
                editedUser.profilePhoto
                  ? { uri: editedUser.profilePhoto }
                  : undefined
              }
              style={styles.avatar}
            />
            {!editedUser.profilePhoto && (
              <Avatar.Text
                size={100}
                label={editedUser.name.split(' ').map(n => n[0]).join('')}
                style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              />
            )}
            {editing && (
              <View style={styles.editAvatarOverlay}>
                <Ionicons name="camera" size={24} color="white" />
              </View>
            )}
            <View style={[
              styles.statusIndicator,
              { backgroundColor: getStatusColor(user.status) }
            ]} />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            {editing ? (
              <>
                <TextInput
                  label="Full Name"
                  value={editedUser.name}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, name: text }))}
                  mode="outlined"
                  style={styles.editInput}
                />
                <TextInput
                  label="Job Title"
                  value={editedUser.title}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, title: text }))}
                  mode="outlined"
                  style={styles.editInput}
                />
                <TextInput
                  label="Phone"
                  value={editedUser.phone}
                  onChangeText={(text) => setEditedUser(prev => ({ ...prev, phone: text }))}
                  mode="outlined"
                  style={styles.editInput}
                />
              </>
            ) : (
              <>
                <Text variant="headlineSmall" style={styles.userName}>
                  {user.name}
                </Text>
                <Text variant="bodyMedium" style={styles.userTitle}>
                  {user.title}
                </Text>
                <Text variant="bodyMedium" style={styles.userEmail}>
                  {user.email}
                </Text>
                <Text variant="bodyMedium" style={styles.userPhone}>
                  {user.phone}
                </Text>
              </>
            )}
          </View>
        </Card.Content>

        {editing && (
          <Card.Actions style={styles.editActions}>
            <Button onPress={handleCancel}>Cancel</Button>
            <Button mode="contained" onPress={handleSave}>
              Save
            </Button>
          </Card.Actions>
        )}
      </Card>

      <Card style={styles.settingsCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Settings
          </Text>

          <List.Item
            title="Dark Mode"
            description="Switch to dark theme"
            left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => (
              <Switch
                value={settings.darkMode}
                onValueChange={(value) =>
                  setSettings(prev => ({ ...prev, darkMode: value }))
                }
              />
            )}
          />

          <Divider />

          <List.Item
            title="Notifications"
            description="Enable push notifications"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => (
              <Switch
                value={settings.notifications}
                onValueChange={(value) =>
                  setSettings(prev => ({ ...prev, notifications: value }))
                }
              />
            )}
          />

          <Divider />

          <List.Item
            title="Sound"
            description="Enable notification sounds"
            left={(props) => <List.Icon {...props} icon="volume-high" />}
            right={() => (
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) =>
                  setSettings(prev => ({ ...prev, soundEnabled: value }))
                }
              />
            )}
          />

          <Divider />

          <List.Item
            title="Show Online Status"
            description="Let others see when you're online"
            left={(props) => <List.Icon {...props} icon="account-circle" />}
            right={() => (
              <Switch
                value={settings.showOnlineStatus}
                onValueChange={(value) =>
                  setSettings(prev => ({ ...prev, showOnlineStatus: value }))
                }
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.actionsCard}>
        <Card.Content>
          <List.Item
            title="Change Password"
            left={(props) => <List.Icon {...props} icon="lock" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* Navigate to change password */}}
          />

          <Divider />

          <List.Item
            title="Privacy Policy"
            left={(props) => <List.Icon {...props} icon="shield-account" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* Navigate to privacy policy */}}
          />

          <Divider />

          <List.Item
            title="Terms of Service"
            left={(props) => <List.Icon {...props} icon="file-document" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* Navigate to terms */}}
          />

          <Divider />

          <List.Item
            title="About"
            left={(props) => <List.Icon {...props} icon="information" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => {/* Navigate to about */}}
          />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor={theme.colors.error}
      >
        Logout
      </Button>
    </ScrollView>
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
  profileCard: {
    margin: theme.spacing.md,
    elevation: 4,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    elevation: 4,
  },
  editAvatarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  userTitle: {
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    color: theme.colors.placeholder,
    marginBottom: theme.spacing.xs,
  },
  userPhone: {
    color: theme.colors.placeholder,
  },
  editInput: {
    marginBottom: theme.spacing.sm,
    width: '100%',
  },
  editActions: {
    justifyContent: 'flex-end',
  },
  settingsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    elevation: 2,
  },
  actionsCard: {
    margin: theme.spacing.md,
    marginTop: 0,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },
  logoutButton: {
    margin: theme.spacing.md,
    marginTop: 0,
    borderColor: theme.colors.error,
  },
});