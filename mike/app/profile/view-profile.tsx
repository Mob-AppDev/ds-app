import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Edit3, Camera, Mail, Phone, Calendar, MapPin, Building, Check, X } from 'lucide-react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface ProfileData {
  name: string;
  displayName: string;
  email: string;
  phone: string;
  title: string;
  department: string;
  location: string;
  timezone: string;
  bio: string;
}

export default function ViewProfileScreen() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'odfianko',
    displayName: 'Odfianko',
    email: 'odfianko@workspace.com',
    phone: '',
    title: 'Software Developer',
    department: 'Engineering',
    location: 'Accra, Ghana',
    timezone: 'GMT+0',
    bio: 'Passionate about building great software and collaborating with amazing teams.',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleEditField = (field: keyof ProfileData, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveField = () => {
    if (editingField) {
      setProfileData(prev => ({ ...prev, [editingField]: editValue }));
      setEditingField(null);
      setEditValue('');
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const handleImagePick = async () => {
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

  const renderEditableField = (label: string, field: keyof ProfileData, IconComponent: any) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldIcon}>
          <IconComponent size={16} color="#8B8D97" />
        </View>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditField(field, profileData[field])}
          >
            <Edit3 size={14} color="#8B8D97" />
          </TouchableOpacity>
        )}
      </View>
      {editingField === field ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={`Enter ${label.toLowerCase()}`}
            placeholderTextColor="#8B8D97"
            autoFocus
          />
          <View style={styles.editActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveField}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.fieldValue}>{profileData[field] || 'Not set'}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={styles.editToggleText}>
            {isEditing ? 'Done' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            {profileImage ? (
              <View style={[styles.profileImage, { backgroundColor: '#4A154B' }]}>
                <Text style={styles.profileImageText}>
                  {profileData.displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            ) : (
              <View style={[styles.profileImage, { backgroundColor: '#4A154B' }]}>
                <User size={32} color="#FFFFFF" />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handleImagePick}
              >
                <Camera size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{profileData.displayName}</Text>
          <Text style={styles.profileUsername}>@{profileData.name}</Text>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsSection}>
          {renderEditableField('Full name', 'displayName', User)}
          {renderEditableField('Email', 'email', Mail)}
          {renderEditableField('Phone', 'phone', Phone)}
          {renderEditableField('Title', 'title', Building)}
          {renderEditableField('Department', 'department', Building)}
          {renderEditableField('Location', 'location', MapPin)}
          {renderEditableField('Time zone', 'timezone', Calendar)}
        </View>

        {/* Bio Section */}
        <View style={styles.bioSection}>
          <Text style={styles.sectionTitle}>About</Text>
          {editingField === 'bio' ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.editInput, styles.bioInput]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#8B8D97"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                autoFocus
              />
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveField}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.bioContainer}>
              <Text style={styles.bioText}>{profileData.bio}</Text>
              {isEditing && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditField('bio', profileData.bio)}
                >
                  <Edit3 size={14} color="#8B8D97" />
                </TouchableOpacity>
              )}
            </View>
          )}
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  editToggleText: {
    color: '#4A154B',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3142',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '600',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4A154B',
    borderRadius: 12,
    padding: 6,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileUsername: {
    color: '#8B8D97',
    fontSize: 16,
  },
  fieldsSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldLabel: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  fieldValue: {
    color: '#FFFFFF',
    fontSize: 16,
    paddingLeft: 24,
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    backgroundColor: '#2D3142',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#4A154B',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#2D3142',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  bioContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bioText: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
}); 