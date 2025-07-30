import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { useStatus } from '../../src/context/StatusContext';

interface StatusOption {
  id: 'active' | 'away' | 'dnd';
  label: string;
  emoji: string;
  color: string;
}

export default function StatusScreen() {
  const { userStatus, setUserStatus } = useStatus();
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'away' | 'dnd'>(userStatus);

  const statusOptions: StatusOption[] = [
    {
      id: 'active',
      label: 'Active',
      emoji: '🟢',
      color: '#4CAF50',
    },
    {
      id: 'away',
      label: 'Away',
      emoji: '🟡',
      color: '#FFA726',
    },
    {
      id: 'dnd',
      label: 'Do not disturb',
      emoji: '🔴',
      color: '#F44336',
    },
  ];

  const handleSaveStatus = () => {
    setUserStatus(selectedStatus);
    console.log('Status saved:', selectedStatus);
    router.back();
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'active':
        return 'You\'re active and available';
      case 'away':
        return 'You\'re away but can be reached';
      case 'dnd':
        return 'You\'re busy and don\'t want to be disturbed';
      default:
        return '';
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
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Status</Text>
        <TouchableOpacity onPress={handleSaveStatus}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Options */}
        <View style={styles.statusSection}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.statusOption,
                selectedStatus === option.id && styles.statusOptionSelected
              ]}
              onPress={() => setSelectedStatus(option.id)}
            >
              <View style={styles.statusLeft}>
                <Text style={styles.statusEmoji}>{option.emoji}</Text>
                <View style={styles.statusInfo}>
                  <Text style={styles.statusLabel}>{option.label}</Text>
                  <Text style={styles.statusDescription}>
                    {getStatusDescription(option.id)}
                  </Text>
                </View>
              </View>
              {selectedStatus === option.id && (
                <Check size={20} color="#4A154B" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Status Preview */}
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <View style={[styles.previewAvatar, { backgroundColor: '#4A154B' }]}>
                <Text style={styles.previewAvatarText}>O</Text>
              </View>
              <View style={styles.previewInfo}>
                <Text style={styles.previewName}>odfianko</Text>
                <View style={styles.previewStatus}>
                  <View style={[styles.previewStatusDot, { backgroundColor: statusOptions.find(s => s.id === selectedStatus)?.color }]} />
                  <Text style={styles.previewStatusText}>
                    {statusOptions.find(s => s.id === selectedStatus)?.label}
                  </Text>
                </View>
              </View>
            </View>
          </View>
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
  saveButton: {
    color: '#4A154B',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  statusSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  statusOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2D3142',
    marginBottom: 12,
  },
  statusOptionSelected: {
    backgroundColor: '#4A154B',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    color: '#8B8D97',
    fontSize: 14,
  },
  previewSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  previewTitle: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  previewCard: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  previewAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  previewInfo: {
    flex: 1,
  },
  previewName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  previewStatusText: {
    color: '#8B8D97',
    fontSize: 14,
  },
}); 