import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Zap, Bell, User, MessageSquare, Calendar, Settings, CheckCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ListsProvider } from '../../src/context/ListsContext';

interface WorkflowTrigger {
  id: string;
  type: 'new_item' | 'status_change' | 'assignment' | 'due_date';
  name: string;
  description: string;
  icon: any;
}

interface WorkflowAction {
  id: string;
  type: 'notification' | 'message' | 'assign' | 'update_field';
  name: string;
  description: string;
  icon: any;
}

interface Workflow {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  action: WorkflowAction;
  enabled: boolean;
  conditions?: string[];
}

function WorkflowContent() {
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTrigger, setSelectedTrigger] = useState<WorkflowTrigger | null>(null);
  const [selectedAction, setSelectedAction] = useState<WorkflowAction | null>(null);
  const [workflowName, setWorkflowName] = useState('');

  const triggers: WorkflowTrigger[] = [
    {
      id: '1',
      type: 'new_item',
      name: 'New Item Created',
      description: 'When a new item is added to the list',
      icon: Plus,
    },
    {
      id: '2',
      type: 'status_change',
      name: 'Status Changed',
      description: 'When an item status is updated',
      icon: Settings,
    },
    {
      id: '3',
      type: 'assignment',
      name: 'Item Assigned',
      description: 'When an item is assigned to someone',
      icon: User,
    },
    {
      id: '4',
      type: 'due_date',
      name: 'Due Date Approaching',
      description: 'When an item is due soon',
      icon: Calendar,
    },
  ];

  const actions: WorkflowAction[] = [
    {
      id: '1',
      type: 'notification',
      name: 'Send Notification',
      description: 'Send a push notification to team members',
      icon: Bell,
    },
    {
      id: '2',
      type: 'message',
      name: 'Send Message',
      description: 'Send a message to a channel or DM',
      icon: MessageSquare,
    },
    {
      id: '3',
      type: 'assign',
      name: 'Auto Assign',
      description: 'Automatically assign to a team member',
      icon: User,
    },
    {
      id: '4',
      type: 'update_field',
      name: 'Update Field',
      description: 'Update a field value automatically',
      icon: Settings,
    },
  ];

  const handleCreateWorkflow = () => {
    if (!selectedTrigger || !selectedAction || !workflowName.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: workflowName,
      trigger: selectedTrigger,
      action: selectedAction,
      enabled: true,
    };

    setWorkflows([...workflows, newWorkflow]);
    setShowCreateModal(false);
    setSelectedTrigger(null);
    setSelectedAction(null);
    setWorkflowName('');
  };

  const handleToggleWorkflow = (workflowId: string) => {
    setWorkflows(workflows.map(w => 
      w.id === workflowId ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const handleDeleteWorkflow = (workflowId: string) => {
    Alert.alert(
      'Delete Workflow',
      'Are you sure you want to delete this workflow?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setWorkflows(workflows.filter(w => w.id !== workflowId));
          }
        }
      ]
    );
  };

  const renderWorkflow = ({ item }: { item: Workflow }) => (
    <View style={styles.workflowCard}>
      <View style={styles.workflowHeader}>
        <View style={styles.workflowInfo}>
          <Text style={styles.workflowName}>{item.name}</Text>
          <Text style={styles.workflowStatus}>
            {item.enabled ? 'Active' : 'Inactive'}
          </Text>
        </View>
        <View style={styles.workflowActions}>
          <TouchableOpacity 
            style={[styles.statusToggle, item.enabled && styles.statusToggleActive]}
            onPress={() => handleToggleWorkflow(item.id)}
          >
            <CheckCircle size={16} color={item.enabled ? '#FFFFFF' : '#8B8D97'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => handleDeleteWorkflow(item.id)}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.workflowFlow}>
        <View style={styles.flowItem}>
          <View style={styles.flowIcon}>
            <item.trigger.icon size={16} color="#8B8D97" />
          </View>
          <Text style={styles.flowText}>{item.trigger.name}</Text>
        </View>
        
        <View style={styles.flowArrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
        
        <View style={styles.flowItem}>
          <View style={styles.flowIcon}>
            <item.action.icon size={16} color="#8B8D97" />
          </View>
          <Text style={styles.flowText}>{item.action.name}</Text>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Workflow Automation</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {workflows.length === 0 ? (
          <View style={styles.emptyState}>
            <Zap size={48} color="#8B8D97" />
            <Text style={styles.emptyTitle}>No workflows yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first automation to streamline your workflow
            </Text>
            <TouchableOpacity 
              style={styles.emptyActionButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.emptyActionText}>Create Workflow</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={workflows}
            renderItem={renderWorkflow}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      {/* Create Workflow Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Workflow</Text>
            
            {/* Workflow Name */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Workflow Name</Text>
              <TextInput
                style={styles.textInput}
                value={workflowName}
                onChangeText={setWorkflowName}
                placeholder="Enter workflow name"
                placeholderTextColor="#8B8D97"
              />
            </View>

            {/* Trigger Selection */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Trigger</Text>
              <Text style={styles.inputSubtitle}>When should this workflow run?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {triggers.map((trigger) => (
                  <TouchableOpacity
                    key={trigger.id}
                    style={[
                      styles.optionCard,
                      selectedTrigger?.id === trigger.id && styles.optionCardSelected
                    ]}
                    onPress={() => setSelectedTrigger(trigger)}
                  >
                    <trigger.icon size={24} color={selectedTrigger?.id === trigger.id ? '#FFFFFF' : '#8B8D97'} />
                    <Text style={[styles.optionTitle, selectedTrigger?.id === trigger.id && styles.optionTitleSelected]}>
                      {trigger.name}
                    </Text>
                    <Text style={[styles.optionDescription, selectedTrigger?.id === trigger.id && styles.optionDescriptionSelected]}>
                      {trigger.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Action Selection */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Action</Text>
              <Text style={styles.inputSubtitle}>What should happen?</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {actions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={[
                      styles.optionCard,
                      selectedAction?.id === action.id && styles.optionCardSelected
                    ]}
                    onPress={() => setSelectedAction(action)}
                  >
                    <action.icon size={24} color={selectedAction?.id === action.id ? '#FFFFFF' : '#8B8D97'} />
                    <Text style={[styles.optionTitle, selectedAction?.id === action.id && styles.optionTitleSelected]}>
                      {action.name}
                    </Text>
                    <Text style={[styles.optionDescription, selectedAction?.id === action.id && styles.optionDescriptionSelected]}>
                      {action.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleCreateWorkflow}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function WorkflowScreen() {
  return (
    <ListsProvider>
      <WorkflowContent />
    </ListsProvider>
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
  addButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    color: '#8B8D97',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A154B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  emptyActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  workflowCard: {
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    padding: 16,
  },
  workflowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  workflowInfo: {
    flex: 1,
  },
  workflowName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workflowStatus: {
    color: '#8B8D97',
    fontSize: 14,
  },
  workflowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusToggle: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#1A1D29',
  },
  statusToggleActive: {
    backgroundColor: '#10B981',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  workflowFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1D29',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  flowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  flowArrow: {
    paddingHorizontal: 8,
  },
  arrowText: {
    color: '#8B8D97',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2D3142',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  optionCard: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 160,
    alignItems: 'center',
  },
  optionCardSelected: {
    backgroundColor: '#4A154B',
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  optionTitleSelected: {
    color: '#FFFFFF',
  },
  optionDescription: {
    color: '#8B8D97',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  optionDescriptionSelected: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#4A154B',
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#10B981',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
  },
}); 