import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, MessageSquare, Calendar, Edit3, Trash2, Search, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Swipeable } from 'react-native-gesture-handler';
import Toast from './components/Toast';

interface AssignedItem {
  id: string;
  title: string;
  listName: string;
  dueDate: string;
  isOverdue: boolean;
  isCompleted: boolean;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
}

export default function AssignedScreen() {
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'overdue' | 'completed'>('all');
  const [showDatePicker, setShowDatePicker] = useState<{itemId: string, currentDate: string} | null>(null);
  const [newDueDate, setNewDueDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommentModal, setShowCommentModal] = useState<{itemId: string, itemTitle: string} | null>(null);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  // Mock data - in real app this would come from your data source
  const [assignedItems, setAssignedItems] = useState<AssignedItem[]>([
    {
      id: '1',
      title: 'Review Q4 marketing strategy',
      listName: 'Marketing Projects',
      dueDate: '2024-01-15',
      isOverdue: true,
      isCompleted: false,
      assignee: 'You',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Update user documentation',
      listName: 'Product Development',
      dueDate: '2024-01-20',
      isOverdue: false,
      isCompleted: false,
      assignee: 'You',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Schedule team meeting',
      listName: 'Team Management',
      dueDate: '2024-01-18',
      isOverdue: false,
      isCompleted: true,
      assignee: 'You',
      priority: 'low',
    },
    {
      id: '4',
      title: 'Finalize budget proposal',
      listName: 'Finance',
      dueDate: '2024-01-12',
      isOverdue: true,
      isCompleted: false,
      assignee: 'You',
      priority: 'high',
    },
  ]);

  const getFilteredItems = () => {
    let filtered = assignedItems;
    
    // First apply tab filter
    switch (activeTab) {
      case 'today':
        filtered = assignedItems.filter(item => 
          !item.isCompleted && 
          new Date(item.dueDate).toDateString() === new Date().toDateString()
        );
        break;
      case 'overdue':
        filtered = assignedItems.filter(item => 
          !item.isCompleted && item.isOverdue
        );
        break;
      case 'completed':
        filtered = assignedItems.filter(item => item.isCompleted);
        break;
      default:
        filtered = assignedItems.filter(item => !item.isCompleted);
    }
    
    // Then apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.listName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort by due date (overdue first, then by date)
    return filtered.sort((a, b) => {
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  // Action handlers
  const handleToggleComplete = (itemId: string) => {
    setAssignedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, isCompleted: !item.isCompleted }
          : item
      )
    );
  };

  const handleEditDueDate = (itemId: string, currentDate: string) => {
    setShowDatePicker({ itemId, currentDate });
    setNewDueDate(currentDate);
  };

  const handleSaveDueDate = () => {
    if (showDatePicker) {
      setAssignedItems(items =>
        items.map(item =>
          item.id === showDatePicker.itemId
            ? { 
                ...item, 
                dueDate: newDueDate,
                isOverdue: new Date(newDueDate) < new Date() && !item.isCompleted
              }
            : item
        )
      );
      setShowDatePicker(null);
      setNewDueDate('');
    }
  };

  const handleAddComment = (itemId: string) => {
    const item = assignedItems.find(i => i.id === itemId);
    if (item) {
      setShowCommentModal({ itemId, itemTitle: item.title });
    }
  };

  const handleSaveComment = () => {
    if (!showCommentModal || !newComment.trim()) return;
    
    // In a real app, you would save this to your backend
    setToast({
      visible: true,
      message: 'Comment added successfully!',
      type: 'success'
    });
    
    setShowCommentModal(null);
    setNewComment('');
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleOpenParentList = (itemId: string) => {
    const item = assignedItems.find(i => i.id === itemId);
    if (item) {
      router.push(`/lists/view?listName=${encodeURIComponent(item.listName)}`);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setAssignedItems(items => items.filter(item => item.id !== itemId));
            setToast({
              visible: true,
              message: 'Task deleted successfully!',
              type: 'success'
            });
            setTimeout(() => {
              setToast(prev => ({ ...prev, visible: false }));
            }, 3000);
          }
        }
      ]
    );
  };

  const renderSwipeActions = (item: AssignedItem) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity 
        style={[styles.swipeAction, styles.completeAction]}
        onPress={() => handleToggleComplete(item.id)}
      >
        <CheckCircle size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>
          {item.isCompleted ? 'Undo' : 'Complete'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.swipeAction, styles.editAction]}
        onPress={() => handleEditDueDate(item.id, item.dueDate)}
      >
        <Edit3 size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Edit Date</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.swipeAction, styles.commentAction]}
        onPress={() => handleAddComment(item.id)}
      >
        <MessageSquare size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Comment</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.swipeAction, styles.listAction]}
        onPress={() => handleOpenParentList(item.id)}
      >
        <ArrowLeft size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Open List</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.swipeAction, styles.deleteAction]}
        onPress={() => handleDeleteItem(item.id)}
      >
        <Trash2 size={20} color="#FFFFFF" />
        <Text style={styles.swipeActionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAssignedItem = ({ item }: { item: AssignedItem }) => (
    <Swipeable
      renderRightActions={() => renderSwipeActions(item)}
      rightThreshold={40}
    >
      <TouchableOpacity 
        style={styles.itemContainer}
        onPress={() => router.push(`/lists/item-detail?id=${item.id}`)}
      >
        <View style={styles.itemHeader}>
          <View style={styles.itemLeft}>
            <TouchableOpacity 
              style={[styles.checkbox, item.isCompleted && styles.checkboxCompleted]}
              onPress={() => handleToggleComplete(item.id)}
            >
              {item.isCompleted && <CheckCircle size={16} color="#FFFFFF" />}
            </TouchableOpacity>
            <View style={styles.itemContent}>
              <Text style={[styles.itemTitle, item.isCompleted && styles.itemTitleCompleted]}>
                {item.title}
              </Text>
              <Text style={styles.listName}>{item.listName}</Text>
            </View>
          </View>
          <View style={styles.itemRight}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          </View>
        </View>
        
        <View style={styles.itemFooter}>
          <View style={styles.dateContainer}>
            <Calendar size={14} color="#8B8D97" />
            <Text style={[styles.dueDate, item.isOverdue && styles.overdueText]}>
              {item.isOverdue ? 'Overdue' : item.dueDate}
            </Text>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleAddComment(item.id)}
            >
              <MessageSquare size={16} color="#8B8D97" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditDueDate(item.id, item.dueDate)}
            >
              <Clock size={16} color="#8B8D97" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  const TabButton = ({ title, value, count }: { title: string; value: string; count: number }) => (
    <TouchableOpacity 
      style={[styles.tabButton, activeTab === value && styles.activeTabButton]}
      onPress={() => setActiveTab(value as any)}
    >
      <Text style={[styles.tabText, activeTab === value && styles.activeTabText]}>
        {title}
      </Text>
      <View style={[styles.tabCount, activeTab === value && styles.activeTabCount]}>
        <Text style={[styles.tabCountText, activeTab === value && styles.activeTabCountText]}>
          {count}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const filteredItems = getFilteredItems();

  // Date Picker Modal
  const DatePickerModal = () => (
    <Modal
      visible={showDatePicker !== null}
      transparent
      animationType="slide"
      onRequestClose={() => setShowDatePicker(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Due Date</Text>
          <TextInput
            style={styles.dateInput}
            value={newDueDate}
            onChangeText={setNewDueDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#8B8D97"
            autoCapitalize="none"
            autoCorrect={false}
            blurOnSubmit={false}
            returnKeyType="done"
            keyboardType="default"
            textContentType="none"
          />
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowDatePicker(null)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleSaveDueDate}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Comment Modal
  const CommentModal = () => (
    <Modal
      visible={showCommentModal !== null}
      transparent
      animationType="slide"
      onRequestClose={() => setShowCommentModal(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add Comment</Text>
          <Text style={styles.modalSubtitle}>
            {showCommentModal?.itemTitle}
          </Text>
          <TextInput
            style={[styles.dateInput, styles.commentInput]}
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Write your comment..."
            placeholderTextColor="#8B8D97"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            autoCorrect={false}
            autoCapitalize="sentences"
            blurOnSubmit={false}
            returnKeyType="default"
            keyboardType="default"
            textContentType="none"
          />
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => {
                setShowCommentModal(null);
                setNewComment('');
              }}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleSaveComment}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonPrimaryText]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
        <Text style={styles.headerTitle}>Assigned to you</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={16} color="#8B8D97" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor="#8B8D97"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="none"
            blurOnSubmit={false}
            returnKeyType="search"
            keyboardType="default"
            textContentType="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearSearchButton}
              onPress={() => setSearchQuery('')}
            >
              <X size={16} color="#8B8D97" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <TabButton 
          title="All" 
          value="all" 
          count={assignedItems.filter(item => !item.isCompleted).length} 
        />
        <TabButton 
          title="Today" 
          value="today" 
          count={assignedItems.filter(item => 
            !item.isCompleted && 
            new Date(item.dueDate).toDateString() === new Date().toDateString()
          ).length} 
        />
        <TabButton 
          title="Overdue" 
          value="overdue" 
          count={assignedItems.filter(item => !item.isCompleted && item.isOverdue).length} 
        />
        <TabButton 
          title="Completed" 
          value="completed" 
          count={assignedItems.filter(item => item.isCompleted).length} 
        />
      </View>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderAssignedItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <CheckCircle size={48} color="#8B8D97" />
            <Text style={styles.emptyTitle}>No tasks found</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'all' && 'You have no assigned tasks'}
              {activeTab === 'today' && 'No tasks due today'}
              {activeTab === 'overdue' && 'No overdue tasks'}
              {activeTab === 'completed' && 'No completed tasks'}
            </Text>
          </View>
        }
      />
      
      <DatePickerModal />
      <CommentModal />
      <Toast visible={toast.visible} message={toast.message} type={toast.type} onHide={() => setToast({ ...toast, visible: false })} />
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#2D3142',
  },
  activeTabButton: {
    backgroundColor: '#4A154B',
  },
  tabText: {
    color: '#8B8D97',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabCount: {
    marginLeft: 6,
    backgroundColor: '#4A154B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeTabCount: {
    backgroundColor: '#FFFFFF',
  },
  tabCountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabCountText: {
    color: '#4A154B',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: '#2D3142',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#8B8D97',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8B8D97',
  },
  listName: {
    color: '#8B8D97',
    fontSize: 14,
  },
  itemRight: {
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dueDate: {
    color: '#8B8D97',
    fontSize: 14,
  },
  overdueText: {
    color: '#EF4444',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
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
  },
  // Swipe action styles
  swipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 16,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    marginLeft: 4,
  },
  swipeActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  completeAction: {
    backgroundColor: '#10B981',
  },
  editAction: {
    backgroundColor: '#F59E0B',
  },
  commentAction: {
    backgroundColor: '#3B82F6',
  },
  listAction: {
    backgroundColor: '#8B5CF6',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
  },
  // Modal styles
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
  dateInput: {
    backgroundColor: '#1A1D29',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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
  // Search styles
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 4,
  },
  // Comment modal styles
  modalSubtitle: {
    color: '#8B8D97',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  commentInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    textAlign: 'left',
  },
}); 