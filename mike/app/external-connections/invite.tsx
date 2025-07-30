import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Building, Users, MessageSquare } from 'lucide-react-native';
import { router } from 'expo-router';
import Toast from '../components/Toast';

export default function ExternalInviteScreen() {
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [permission, setPermission] = useState<'post-only' | 'invite'>('post-only');
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const handleSendInvite = () => {
    if (!orgName.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Please fill in organization name and email');
      return;
    }

    Alert.alert(
      'Send Invite',
      `Send connection invite to ${orgName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: () => {
            setToast({ visible: true, message: 'Connection invite has been sent successfully!', type: 'success' });
            setTimeout(() => router.back(), 1500);
          }
        }
      ]
    );
  };

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
        <Text style={styles.headerTitle}>Send invite</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Organization Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization</Text>
          <View style={styles.inputContainer}>
            <Building size={20} color="#8B8D97" />
            <TextInput
              style={styles.input}
              placeholder="Organization name"
              placeholderTextColor="#8B8D97"
              value={orgName}
              onChangeText={setOrgName}
            />
          </View>
        </View>

        {/* Contact Email */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact email</Text>
          <View style={styles.inputContainer}>
            <Users size={20} color="#8B8D97" />
            <TextInput
              style={styles.input}
              placeholder="admin@organization.com"
              placeholderTextColor="#8B8D97"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Permissions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Permissions</Text>
          <Text style={styles.sectionSubtitle}>
            Choose what external users can do in your workspace
          </Text>
          
          <TouchableOpacity 
            style={[styles.permissionOption, permission === 'post-only' && styles.permissionSelected]}
            onPress={() => setPermission('post-only')}
          >
            <View style={styles.permissionHeader}>
              <View style={[styles.permissionDot, permission === 'post-only' && styles.permissionDotSelected]} />
              <Text style={styles.permissionTitle}>Post-only</Text>
            </View>
            <Text style={styles.permissionDescription}>
              External users can post messages but cannot invite others
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.permissionOption, permission === 'invite' && styles.permissionSelected]}
            onPress={() => setPermission('invite')}
          >
            <View style={styles.permissionHeader}>
              <View style={[styles.permissionDot, permission === 'invite' && styles.permissionDotSelected]} />
              <Text style={styles.permissionTitle}>Can invite others</Text>
            </View>
            <Text style={styles.permissionDescription}>
              External users can post messages and invite others from their organization
            </Text>
          </TouchableOpacity>
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message (optional)</Text>
          <View style={styles.messageContainer}>
            <MessageSquare size={20} color="#8B8D97" />
            <TextInput
              style={styles.messageInput}
              placeholder="Add a personal message to your invite..."
              placeholderTextColor="#8B8D97"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • We'll send an email invite to the organization{'\n'}
            • They'll need to accept the invite to connect{'\n'}
            • Once connected, you can start collaborating in shared channels
          </Text>
        </View>
      </ScrollView>

      {/* Send Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.sendButton, (!orgName.trim() || !email.trim()) && styles.sendButtonDisabled]}
          onPress={handleSendInvite}
          disabled={!orgName.trim() || !email.trim()}
        >
          <Send size={20} color="#FFFFFF" />
          <Text style={styles.sendButtonText}>Send invite</Text>
        </TouchableOpacity>
      </View>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
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
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 80,
  },
  permissionOption: {
    backgroundColor: '#2D3142',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  permissionSelected: {
    backgroundColor: '#4A154B',
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  permissionDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#8B8D97',
    marginRight: 12,
  },
  permissionDotSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  permissionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  permissionDescription: {
    color: '#8B8D97',
    fontSize: 14,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    color: '#8B8D97',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3142',
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A154B',
    borderRadius: 8,
    paddingVertical: 16,
    gap: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#2D3142',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 