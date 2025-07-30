import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Switch,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../src/context/ThemeContext';
import { useStatus } from '../src/context/StatusContext';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  BellOff, 
  Moon, 
  Smartphone, 
  Settings, 
  LogOut,
  Coffee,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock
} from 'lucide-react-native';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const { userStatus, statusText, statusColor, statusEmoji } = useStatus();
  const darkModeEnabled = theme === 'dark';

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => router.replace('/auth/login')
        }
      ]
    );
  };

  const handleStatusChange = () => {
    router.push('/profile/status');
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleProfileImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>You</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={handleProfileImagePick}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileAvatar}
              />
            ) : (
              <View style={[styles.profileAvatar, { backgroundColor: '#4A154B' }]}>
                <User size={32} color="#FFFFFF" />
              </View>
            )}
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>Edit</Text>
            </View>
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>odfianko</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
              <Text style={styles.statusText}>{statusText}</Text>
            </View>
          </View>
        </View>

        {/* Status Section */}
        <TouchableOpacity style={styles.statusSection} onPress={handleStatusChange}>
          <View style={styles.statusLeft}>
            <Text style={styles.statusEmoji}>{statusEmoji}</Text>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>Set your status</Text>
              <Text style={styles.statusSubtitle}>Let people know what you're up to</Text>
            </View>
          </View>
          <Text style={styles.statusCurrent}>{statusText}</Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity style={styles.menuItem}>
            <BellOff size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Pause notifications</Text>
            <Switch
              value={!notificationsEnabled}
              onValueChange={(value) => setNotificationsEnabled(!value)}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Profile Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile & Workspace</Text>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/invitations')}
          >
            <Coffee size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Invitations to connect</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/view-profile')}
          >
            <User size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>View profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/workspace-settings')}
          >
            <Building size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Workspace settings</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.menuItem}>
            <Mail size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>odfianko@workspace.com</Text>
          </View>

          <TouchableOpacity style={styles.menuItem}>
            <Phone size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Add phone number</Text>
          </TouchableOpacity>

          <View style={styles.menuItem}>
            <Calendar size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Time zone: GMT+0</Text>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/notifications')}
          >
            <Bell size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/preferences')}
          >
            <Settings size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Preferences</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleThemeToggle}>
            <Moon size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Dark mode</Text>
            <Switch
              value={darkModeEnabled}
              onValueChange={handleThemeToggle}
              trackColor={{ false: '#2D3142', true: '#4A154B' }}
              thumbColor="#FFFFFF"
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/profile/mobile-settings')}
          >
            <Smartphone size={20} color="#FFFFFF" />
            <Text style={styles.menuText}>Mobile settings</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutItem} onPress={handleSignOut}>
            <LogOut size={20} color="#FF6B6B" />
            <Text style={[styles.menuText, { color: '#FF6B6B' }]}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1D29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImageText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A154B',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  editBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#8B8D97',
    fontSize: 16,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusInfo: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
  },
  statusCurrent: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  statusEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
    paddingVertical: 8,
  },
  sectionTitle: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  signOutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});