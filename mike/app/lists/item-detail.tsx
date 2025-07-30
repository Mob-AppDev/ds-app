import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Calendar, User, Tag, MessageSquare, Plus, X, Edit3, Trash2 } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useListsContext, ListItem, Subtask, Comment, ListsProvider } from '../../src/context/ListsContext';

function ItemDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getItem, updateItem, deleteItem } = useListsContext();
  const [item, setItem] = useState<ListItem | null>(null);

  useEffect(() => {
    const foundItem = getItem(id || '1');
    if (foundItem) {
      setItem(foundItem);
    }
  }, [id, getItem]);

  const [showAddSubtask, setShowAddSubtask] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleToggleSubtask = (subtaskId: string) => {
    if (!item) return;
    const updatedSubtasks = item.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateItem(item.id, { subtasks: updatedSubtasks });
    setItem({ ...item, subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    if (!item || !newSubtask.trim()) return;
    const newSubtaskItem = {
      id: Date.now().toString(),
      title: newSubtask,
      completed: false
    };
    const updatedSubtasks = [...item.subtasks, newSubtaskItem];
    updateItem(item.id, { subtasks: updatedSubtasks });
    setItem({ ...item, subtasks: updatedSubtasks });
    setNewSubtask('');
    setShowAddSubtask(false);
  };

  const handleAddComment = () => {
    if (!item || !newComment.trim()) return;
    const newCommentItem = {
      id: Date.now().toString(),
      text: newComment,
      author: 'You',
      time: 'Just now'
    };
    const updatedComments = [...item.comments, newCommentItem];
    updateItem(item.id, { comments: updatedComments });
    setItem({ ...item, comments: updatedComments });
    setNewComment('');
    setShowAddComment(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleEditField = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const handleSaveField = () => {
    if (!item || !editingField) return;
    
    const updates: Partial<ListItem> = {};
    if (editingField === 'assignee') {
      updates.assignee = editValue;
    } else if (editingField === 'due date') {
      updates.dueDate = editValue;
    }
    
    updateItem(item.id, updates);
    setItem({ ...item, ...updates });
    setEditingField(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  const renderField = (label: string, value: string, IconComponent: any, editable = true, fieldKey?: string) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <View style={styles.fieldIcon}>
          <IconComponent size={16} color="#8B8D97" />
        </View>
        <Text style={styles.fieldLabel}>{label}</Text>
        {editable && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => handleEditField(label.toLowerCase(), value)}
          >
            <Edit3 size={14} color="#8B8D97" />
          </TouchableOpacity>
        )}
      </View>
      {editingField === label.toLowerCase() ? (
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
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Item Details</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Item Details</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => Alert.alert('Delete Item', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => {
              deleteItem(item.id);
              router.back();
            }}
          ])}
        >
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) }]}>
            <Text style={styles.priorityText}>{item.priority.toUpperCase()}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        {/* Fields */}
        <View style={styles.fieldsSection}>
          {renderField('Assignee', item.assignee, User)}
          {renderField('Due Date', item.dueDate, Calendar)}
          {renderField('Description', item.description, Tag, false)}
        </View>

        {/* Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addTagButton}>
              <Plus size={16} color="#8B8D97" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Subtasks */}
        <View style={styles.subtasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Subtasks</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddSubtask(true)}
            >
              <Plus size={16} color="#4A154B" />
            </TouchableOpacity>
          </View>
          
          {item.subtasks.map((subtask) => (
            <TouchableOpacity 
              key={subtask.id}
              style={styles.subtaskItem}
              onPress={() => handleToggleSubtask(subtask.id)}
            >
              <View style={[styles.subtaskCheckbox, subtask.completed && styles.subtaskCompleted]}>
                {subtask.completed && <CheckCircle size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.subtaskText, subtask.completed && styles.subtaskCompletedText]}>
                {subtask.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comments */}
        <View style={styles.commentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddComment(true)}
            >
              <Plus size={16} color="#4A154B" />
            </TouchableOpacity>
          </View>
          
          {item.comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.author}</Text>
                <Text style={styles.commentTime}>{comment.time}</Text>
              </View>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Subtask Modal */}
      <Modal visible={showAddSubtask} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Subtask</Text>
            <TextInput
              style={styles.modalInput}
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholder="Enter subtask title"
              placeholderTextColor="#8B8D97"
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowAddSubtask(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddSubtask}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Comment Modal */}
      <Modal visible={showAddComment} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TextInput
              style={[styles.modalInput, styles.commentInput]}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Enter your comment"
              placeholderTextColor="#8B8D97"
              multiline
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowAddComment(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddComment}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function ItemDetailScreen() {
  return (
    <ListsProvider>
      <ItemDetailContent />
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
  deleteButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  statusLabel: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#4A154B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  fieldsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  fieldContainer: {
    marginBottom: 16,
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
    flex: 1,
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    padding: 4,
  },
  fieldValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  tagsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2D3142',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  addTagButton: {
    backgroundColor: '#2D3142',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#4A154B',
    borderStyle: 'dashed',
  },
  subtasksSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addButton: {
    padding: 4,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  subtaskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8B8D97',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtaskCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  subtaskText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  subtaskCompletedText: {
    textDecorationLine: 'line-through',
    color: '#8B8D97',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  commentItem: {
    backgroundColor: '#2D3142',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: '#8B8D97',
    fontSize: 12,
  },
  commentText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
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
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  commentInput: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Edit field styles
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
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#7C3AED',
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
}); 