import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Pressable, ScrollView, Modal, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { List as ListIcon, LayoutGrid, Filter, ArrowUp, ArrowDown, CheckCircle, Edit2, MessageCircle, Zap } from 'lucide-react-native';
import { useListsContext, ListsProvider } from '../../src/context/ListsContext';
import Toast from '../components/Toast';

const boardColumns = ['To Do', 'In Progress', 'Done'];

function ListViewContent() {
  const { id } = useLocalSearchParams();
  const [view, setView] = useState<'table' | 'board'>('table');
  const { items, updateItem, setItems } = useListsContext();
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'assignee' | 'status'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [customFilters, setCustomFilters] = useState({
    assignee: '',
    priority: '',
    status: '',
    tags: [] as string[],
  });
  const [showCommentModal, setShowCommentModal] = useState<{ visible: boolean; itemId: string | null }>({
    visible: false,
    itemId: null
  });
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  const filteredItems = items.filter(item => {
    // Basic filter
    let passesFilter = true;
    if (filter === 'completed') {
      passesFilter = item.completed;
    } else if (filter === 'incomplete') {
      passesFilter = !item.completed;
    }

    // Custom filters
    if (customFilters.assignee && item.assignee !== customFilters.assignee) {
      passesFilter = false;
    }
    if (customFilters.priority && item.priority !== customFilters.priority) {
      passesFilter = false;
    }
    if (customFilters.status && item.status !== customFilters.status) {
      passesFilter = false;
    }
    if (customFilters.tags.length > 0) {
      const hasMatchingTag = customFilters.tags.some(tag => item.tags.includes(tag));
      if (!hasMatchingTag) {
        passesFilter = false;
      }
    }

    return passesFilter;
  }).sort((a, b) => {
    // Sorting
    let comparison = 0;
    switch (sortBy) {
      case 'dueDate':
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      case 'assignee':
        comparison = a.assignee.localeCompare(b.assignee);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const moveItem = (index: number, dir: -1 | 1) => {
    const newItems = [...items];
    const target = index + dir;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    // Note: In a real app, you'd want to persist the order to backend
    // For now, we'll just update the local state
    setItems(newItems);
  };

  const handleComplete = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, { completed: !item.completed });
    }
  };

  const handleEdit = (itemId: string) => {
    router.push({ pathname: '/lists/item-detail', params: { id: itemId } });
  };

  const handleComment = (itemId: string) => {
    setShowCommentModal({ visible: true, itemId });
  };

  const handleAddComment = () => {
    if (!showCommentModal.itemId || !newComment.trim()) return;
    
    const item = items.find(i => i.id === showCommentModal.itemId);
    if (item) {
      const updatedComments = [
        ...(item.comments || []),
        {
          id: Date.now().toString(),
          text: newComment,
          author: 'You',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
      updateItem(showCommentModal.itemId, { comments: updatedComments });
      setToast({ visible: true, message: 'Comment added successfully!', type: 'success' });
    }
    
    setNewComment('');
    setShowCommentModal({ visible: false, itemId: null });
  };

  // --- Table View ---
  const renderTable = () => (
    <FlatList
      data={filteredItems}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          {/* Header with title and reorder buttons */}
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <TouchableOpacity 
                style={[styles.completeButton, item.completed && styles.completeButtonActive]}
                onPress={() => handleComplete(item.id)}
              >
                <CheckCircle size={18} color={item.completed ? '#FFFFFF' : '#8B8D97'} />
              </TouchableOpacity>
              <Text style={[styles.itemTitle, item.completed && styles.itemTitleCompleted]}>{item.title}</Text>
            </View>
            <View style={styles.reorderButtons}>
              <TouchableOpacity onPress={() => moveItem(index, -1)} style={styles.reorderBtn}>
                <ArrowUp size={16} color="#8B8D97" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => moveItem(index, 1)} style={styles.reorderBtn}>
                <ArrowDown size={16} color="#8B8D97" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Item metadata */}
          <View style={styles.metadataContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Assignee:</Text>
              <Text style={styles.metaValue}>{item.assignee}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Due:</Text>
              <Text style={styles.metaValue}>{item.dueDate}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Status:</Text>
              <Text style={[styles.metaValue, styles.statusText]}>{item.status}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Comments:</Text>
              <Text style={styles.metaValue}>{item.comments?.length || 0}</Text>
            </View>
          </View>
          
          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item.id)}>
              <Edit2 size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
              <MessageCircle size={16} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>
                Comment{item.comments?.length ? ` (${item.comments.length})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );

  // --- Board View ---
  const renderBoard = () => (
    <ScrollView horizontal style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
      {boardColumns.map(col => (
        <View key={col} style={styles.boardColumn}>
          <Text style={styles.boardColTitle}>{col}</Text>
          {filteredItems.filter(item => item.status === col).map((item, index) => (
            <View key={item.id} style={styles.card}>
              {/* Header with title and complete button */}
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <TouchableOpacity 
                    style={[styles.completeButton, item.completed && styles.completeButtonActive]}
                    onPress={() => handleComplete(item.id)}
                  >
                    <CheckCircle size={18} color={item.completed ? '#FFFFFF' : '#8B8D97'} />
                  </TouchableOpacity>
                  <Text style={[styles.itemTitle, item.completed && styles.itemTitleCompleted]}>{item.title}</Text>
                </View>
              </View>
              
              {/* Item metadata */}
              <View style={styles.metadataContainer}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Assignee:</Text>
                  <Text style={styles.metaValue}>{item.assignee}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Due:</Text>
                  <Text style={styles.metaValue}>{item.dueDate}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Comments:</Text>
                  <Text style={styles.metaValue}>{item.comments?.length || 0}</Text>
                </View>
              </View>
              
              {/* Action buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item.id)}>
                  <Edit2 size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(item.id)}>
                  <MessageCircle size={16} color="#FFFFFF" />
                  <Text style={styles.actionButtonText}>
                    Comment{item.comments?.length ? ` (${item.comments.length})` : ''}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>List View</Text>
        <View style={styles.toggleRow}>
          <TouchableOpacity 
            style={styles.workflowBtn}
            onPress={() => router.push('/lists/workflow')}
          >
            <Zap size={18} color="#7C3AED" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, view === 'table' && styles.toggleBtnActive]} onPress={() => setView('table')}>
            <ListIcon size={18} color={view === 'table' ? '#7C3AED' : '#A1A1AA'} />
            <Text style={[styles.toggleText, view === 'table' && styles.toggleTextActive]}>Table</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleBtn, view === 'board' && styles.toggleBtnActive]} onPress={() => setView('board')}>
            <LayoutGrid size={18} color={view === 'board' ? '#7C3AED' : '#A1A1AA'} />
            <Text style={[styles.toggleText, view === 'board' && styles.toggleTextActive]}>Board</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.filterBar}>
        <TouchableOpacity style={[styles.filterBtn, filter === 'all' && styles.filterBtnActive]} onPress={() => setFilter('all')}>
          <Filter size={14} color={filter === 'all' ? '#7C3AED' : '#A1A1AA'} />
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'completed' && styles.filterBtnActive]} onPress={() => setFilter('completed')}>
          <CheckCircle size={14} color={filter === 'completed' ? '#7C3AED' : '#A1A1AA'} />
          <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterBtn, filter === 'incomplete' && styles.filterBtnActive]} onPress={() => setFilter('incomplete')}>
          <CheckCircle size={14} color={filter === 'incomplete' ? '#7C3AED' : '#A1A1AA'} />
          <Text style={[styles.filterText, filter === 'incomplete' && styles.filterTextActive]}>Incomplete</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Filter size={14} color={showFilters ? '#7C3AED' : '#A1A1AA'} />
          <Text style={[styles.filterText, showFilters && styles.filterTextActive]}>Advanced</Text>
        </TouchableOpacity>
      </View>

      {/* Advanced Filters */}
      {showFilters && (
        <View style={styles.advancedFilters}>
          <Text style={styles.filterSectionTitle}>Advanced Filters</Text>
          
          {/* Sort Options */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Sort by:</Text>
            <View style={styles.sortButtons}>
              {(['dueDate', 'priority', 'assignee', 'status'] as const).map(option => (
                <TouchableOpacity
                  key={option}
                  style={[styles.sortButton, sortBy === option && styles.activeSortButton]}
                  onPress={() => setSortBy(option)}
                >
                  <Text style={[styles.sortButtonText, sortBy === option && styles.activeSortButtonText]}>
                    {option === 'dueDate' ? 'Due Date' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Order:</Text>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <Text style={styles.orderButtonText}>
                {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Filters */}
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Assignee:</Text>
            <TextInput
              style={styles.filterInput}
              value={customFilters.assignee}
              onChangeText={(text) => setCustomFilters({...customFilters, assignee: text})}
              placeholder="Filter by assignee"
              placeholderTextColor="#8B8D97"
              autoCorrect={false}
              autoCapitalize="none"
              blurOnSubmit={false}
              returnKeyType="search"
              keyboardType="default"
              textContentType="none"
            />
          </View>

          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Priority:</Text>
            <View style={styles.priorityButtons}>
              {(['', 'low', 'medium', 'high'] as const).map(priority => (
                <TouchableOpacity
                  key={priority}
                  style={[styles.priorityButton, customFilters.priority === priority && styles.activePriorityButton]}
                  onPress={() => setCustomFilters({...customFilters, priority})}
                >
                  <Text style={[styles.priorityButtonText, customFilters.priority === priority && styles.activePriorityButtonText]}>
                    {priority || 'All'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.clearFiltersButton}
            onPress={() => setCustomFilters({ assignee: '', priority: '', status: '', tags: [] })}
          >
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex: 1 }}>
        {view === 'table' ? renderTable() : renderBoard()}
      </View>
      
      {/* Comment Modal */}
      <Modal visible={showCommentModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comments</Text>
            
            {/* Existing Comments */}
            {showCommentModal.itemId && (() => {
              const item = items.find(i => i.id === showCommentModal.itemId);
              const comments = item?.comments || [];
              return (
                <View style={styles.existingComments}>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <View key={comment.id} style={styles.commentItem}>
                        <View style={styles.commentHeader}>
                          <Text style={styles.commentAuthor}>{comment.author}</Text>
                          <Text style={styles.commentTime}>{comment.time}</Text>
                        </View>
                        <Text style={styles.commentText}>{comment.text}</Text>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noComments}>No comments yet</Text>
                  )}
                </View>
              );
            })()}
            
            {/* New Comment Input */}
            <Text style={styles.addCommentLabel}>Add a comment:</Text>
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Write your comment..."
              placeholderTextColor="#8B8D97"
              multiline
              numberOfLines={4}
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
                onPress={() => setShowCommentModal({ visible: false, itemId: null })}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleAddComment}
              >
                <Text style={styles.modalButtonPrimaryText}>Add Comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </View>
  );
}

export default function ListViewScreen() {
  return (
    <ListsProvider>
      <ListViewContent />
    </ListsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 8,
    paddingHorizontal: 24,
    backgroundColor: '#181A20',
    borderBottomWidth: 1,
    borderBottomColor: '#23242A',
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  workflowBtn: {
    padding: 8,
    marginRight: 8,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#312E81',
  },
  toggleText: {
    color: '#A1A1AA',
    fontWeight: '600',
    marginLeft: 6,
  },
  toggleTextActive: {
    color: '#7C3AED',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#181A20',
    borderBottomWidth: 1,
    borderBottomColor: '#23242A',
    gap: 8,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242A',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  filterBtnActive: {
    backgroundColor: '#312E81',
  },
  filterText: {
    color: '#A1A1AA',
    fontWeight: '600',
    marginLeft: 4,
  },
  filterTextActive: {
    color: '#7C3AED',
  },
  card: {
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  completeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completeButtonActive: {
    backgroundColor: '#10B981',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  itemTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#8B8D97',
  },
  reorderButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  reorderBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#2D3142',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metadataContainer: {
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  metaLabel: {
    fontSize: 13,
    color: '#8B8D97',
    fontWeight: '500',
    width: 60,
  },
  metaValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '400',
  },
  statusText: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A154B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
  boardColumn: {
    width: 260,
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  boardColTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
    marginBottom: 8,
    marginLeft: 4,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  commentInput: {
    backgroundColor: '#2D3142',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    backgroundColor: '#2D3142',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#4A154B',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Comment display styles
  existingComments: {
    maxHeight: 200,
    marginBottom: 16,
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
    alignItems: 'center',
    marginBottom: 6,
  },
  commentAuthor: {
    color: '#7C3AED',
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
  noComments: {
    color: '#8B8D97',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addCommentLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  // Advanced filter styles
  advancedFilters: {
    backgroundColor: '#2D3142',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  filterSectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterLabel: {
    color: '#8B8D97',
    fontSize: 14,
    width: 80,
  },
  sortButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  sortButton: {
    backgroundColor: '#1A1D29',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activeSortButton: {
    backgroundColor: '#7C3AED',
  },
  sortButtonText: {
    color: '#8B8D97',
    fontSize: 12,
  },
  activeSortButtonText: {
    color: '#FFFFFF',
  },
  orderButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  filterInput: {
    flex: 1,
    backgroundColor: '#1A1D29',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  priorityButtons: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  priorityButton: {
    backgroundColor: '#1A1D29',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  activePriorityButton: {
    backgroundColor: '#7C3AED',
  },
  priorityButtonText: {
    color: '#8B8D97',
    fontSize: 12,
  },
  activePriorityButtonText: {
    color: '#FFFFFF',
  },
  clearFiltersButton: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  clearFiltersText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
}); 