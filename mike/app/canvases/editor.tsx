import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Pressable, Image, ScrollView, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { ArrowLeft, Save as SaveIcon, Share2, MoreVertical, MessageCircle, Image as ImageIcon, FileText, List as ListIcon, Heading as HeadingIcon, Bold, X, Volume2, PlaySquare, Code2 } from 'lucide-react-native';
import { useCanvasContext, Canvas, CanvasBlock, CanvasComment, CanvasProvider } from '../../src/context/CanvasContext';
import { Video, ResizeMode } from 'expo-av';
import Toast from '../components/Toast';

// Types
interface Block {
  id: string;
  type: string;
  content: string;
}
interface Comment {
  id: string;
  text: string;
  avatar: string;
  time: string;
}

const initialBlocks: Block[] = [
  { id: '1', type: 'header', content: 'Project Brief' },
  { id: '2', type: 'text', content: 'This canvas contains the project goals and requirements.' },
  { id: '3', type: 'list', content: '- Define MVP\n- Set deadlines\n- Assign tasks' },
];

const blockTypes = [
  { type: 'header', icon: HeadingIcon, label: 'Header' },
  { type: 'text', icon: FileText, label: 'Text' },
  { type: 'list', icon: ListIcon, label: 'List' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'file', icon: FileText, label: 'File' },
  { type: 'video', icon: PlaySquare, label: 'Video' },
  { type: 'audio', icon: Volume2, label: 'Audio' },
  { type: 'link', icon: Code2, label: 'Link' },
  { type: 'embed', icon: Code2, label: 'Embed App' },
];

const mockAvatars = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
];

function CanvasEditorContent() {
  const { id } = useLocalSearchParams();
  const { canvases, saveCanvas } = useCanvasContext();
  const canvasId = Array.isArray(id) ? id[0] : id;
  const canvas = canvases.find(c => c.id === canvasId) || { id: canvasId, title: '', updatedAt: '', blocks: [], comments: {}, sharedWith: [] };
  const [title, setTitle] = useState(canvas.title || 'Untitled Canvas');
  const [blocks, setBlocks] = useState<CanvasBlock[]>(canvas.blocks || []);
  const [showShare, setShowShare] = useState(false);
  const [showComment, setShowComment] = useState<{blockId: string}|null>(null);
  const [showToolbar, setShowToolbar] = useState<{blockId: string}|null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<{[blockId: string]: CanvasComment[]}>(canvas.comments || {});
  const [expandedComments, setExpandedComments] = useState<{ [blockId: string]: boolean }>({});
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    setTitle(canvas.title || 'Untitled Canvas');
    setBlocks(canvas.blocks || []);
    setComments(canvas.comments || {});
  }, [canvas.id]);

  // --- Block actions ---
  const updateBlock = (blockId: string, content: string) => {
    setBlocks(blocks => blocks.map(b => b.id === blockId ? { ...b, content } : b));
  };

  const addBlock = async (type: string) => {
    const newId = (blocks.length + 1).toString();
    if (type === 'image') {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setBlocks([...blocks, { id: newId, type: 'image', content: res.assets[0].uri }]);
      }
      return;
    }
    if (type === 'file') {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setBlocks([...blocks, { id: newId, type: 'file', content: res.assets[0].name }]);
      }
      return;
    }
    if (type === 'video') {
      const res = await DocumentPicker.getDocumentAsync({ type: 'video/*', copyToCacheDirectory: false });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setBlocks([...blocks, { id: newId, type: 'video', content: res.assets[0].uri }]);
      }
      return;
    }
    if (type === 'audio') {
      const res = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: false });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setBlocks([...blocks, { id: newId, type: 'audio', content: res.assets[0].uri }]);
      }
      return;
    }
    if (type === 'link') {
      setBlocks([...blocks, { id: newId, type: 'link', content: 'https://example.com' }]);
      return;
    }
    if (type === 'embed') {
      // Show workflow selection modal
      setShowWorkflowModal(true);
      return;
    }
    setBlocks([...blocks, { id: newId, type, content: type === 'header' ? 'New Header' : '' }]);
  };

  const handleSave = () => {
    saveCanvas({
      ...canvas,
      id: canvasId,
      title,
      blocks,
      comments,
    });
    setToast({ visible: true, message: 'Your canvas has been saved!', type: 'success' });
    router.back();
  };

  // --- Share Modal ---
  const mockTargets: { targetId: string; targetType: 'channel' | 'dm' | 'user'; name: string }[] = [
    { targetId: 'ch1', targetType: 'channel', name: '#general' },
    { targetId: 'ch2', targetType: 'channel', name: '#design' },
    { targetId: 'dm1', targetType: 'dm', name: 'Alice (DM)' },
    { targetId: 'dm2', targetType: 'dm', name: 'Bob (DM)' },
  ];
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view');

  const handleAddShare = () => {
    if (!selectedTarget) return;
    const target = mockTargets.find(t => t.targetId === selectedTarget);
    if (!target) return;
    const alreadyShared = (canvas.sharedWith || []).find(s => s.targetId === selectedTarget);
    if (alreadyShared) return;
    const updatedShares = [
      ...(canvas.sharedWith || []),
      { ...target, permission: selectedPermission },
    ];
    saveCanvas({ ...canvas, sharedWith: updatedShares });
    setSelectedTarget(null);
    setSelectedPermission('view');
  };

  const handleRemoveShare = (targetId: string) => {
    const updatedShares = (canvas.sharedWith || []).filter(s => s.targetId !== targetId);
    saveCanvas({ ...canvas, sharedWith: updatedShares });
  };

  const handleChangePermission = (targetId: string, permission: 'view' | 'edit') => {
    const updatedShares = (canvas.sharedWith || []).map(s =>
      s.targetId === targetId ? { ...s, permission } : s
    );
    saveCanvas({ ...canvas, sharedWith: updatedShares });
  };

  const ShareModal = () => (
    <Modal visible={showShare} transparent animationType="fade" onRequestClose={() => setShowShare(false)}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Share Canvas</Text>
          <Text style={styles.modalDesc}>Share this canvas with a channel, DM, or via link.</Text>
          <Text style={{ color: '#A1A1AA', marginBottom: 8 }}>Add to Channel/DM:</Text>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {mockTargets.map(t => (
                <TouchableOpacity
                  key={t.targetId}
                  style={{
                    backgroundColor: selectedTarget === t.targetId ? '#7C3AED' : '#312E81',
                    borderRadius: 8,
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                  }}
                  onPress={() => setSelectedTarget(t.targetId)}
                >
                  <Text style={{ color: '#fff', fontWeight: '500' }}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ color: '#A1A1AA', marginRight: 8 }}>Permission:</Text>
            <TouchableOpacity
              style={{ backgroundColor: selectedPermission === 'view' ? '#7C3AED' : '#312E81', borderRadius: 8, padding: 6, marginRight: 8 }}
              onPress={() => setSelectedPermission('view')}
            >
              <Text style={{ color: '#fff' }}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: selectedPermission === 'edit' ? '#7C3AED' : '#312E81', borderRadius: 8, padding: 6 }}
              onPress={() => setSelectedPermission('edit')}
            >
              <Text style={{ color: '#fff' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareBtn} onPress={handleAddShare}>
            <Share2 size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.shareBtnText}>Add Share</Text>
          </TouchableOpacity>
          <Text style={{ color: '#A1A1AA', marginVertical: 8 }}>Current Shares:</Text>
          <FlatList
            data={canvas.sharedWith || []}
            keyExtractor={item => item.targetId}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ color: '#fff', fontWeight: '500', marginRight: 8 }}>{item.name}</Text>
                <TouchableOpacity
                  style={{ backgroundColor: item.permission === 'view' ? '#7C3AED' : '#312E81', borderRadius: 8, padding: 4, marginRight: 4 }}
                  onPress={() => handleChangePermission(item.targetId, 'view')}
                >
                  <Text style={{ color: '#fff' }}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ backgroundColor: item.permission === 'edit' ? '#7C3AED' : '#312E81', borderRadius: 8, padding: 4, marginRight: 8 }}
                  onPress={() => handleChangePermission(item.targetId, 'edit')}
                >
                  <Text style={{ color: '#fff' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveShare(item.targetId)}>
                  <Text style={{ color: '#F87171', fontWeight: 'bold' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={{ color: '#A1A1AA' }}>No shares yet.</Text>}
            style={{ maxHeight: 120, width: 260, alignSelf: 'center' }}
          />
          <View style={styles.shareRow}><Text style={styles.shareLabel}>Link:</Text><Text style={styles.shareValue}>Anyone with link can view</Text></View>
          <Text selectable style={{ color: '#7C3AED', marginBottom: 12, textAlign: 'center' }}>{`myapp://canvas/${canvasId}`}</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={() => { 
            Clipboard.setStringAsync(`myapp://canvas/${canvasId}`); 
            setToast({ visible: true, message: 'Share link copied to clipboard!', type: 'success' }); 
          }}>
            <Share2 size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.shareBtnText}>Copy Share Link</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowShare(false)}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // --- Comment Modal ---
  const CommentModal = () => {
    const blockId = showComment?.blockId;
    const blockComments = blockId ? comments[blockId] || [] : [];
    return (
      <Modal visible={!!showComment} transparent animationType="slide" onRequestClose={() => setShowComment(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Comments</Text>
            <FlatList
              data={blockComments}
              keyExtractor={(item: CanvasComment) => item.id}
              renderItem={({ item }: { item: CanvasComment }) => (
                <View style={styles.commentBubble}>
                  <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <Text style={styles.commentTime}>{item.time}</Text>
                  </View>
                  <TouchableOpacity style={styles.commentDelete} onPress={() => {
                    setComments(c => ({ ...c, [blockId || '']: (c[blockId || ''] || []).filter((cm: CanvasComment) => cm.id !== item.id) }));
                  }}>
                    <X size={16} color="#A1A1AA" />
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.commentEmpty}>No comments yet.</Text>}
              style={{ maxHeight: 180, width: 260, alignSelf: 'center' }}
            />
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Add a comment..."
              placeholderTextColor="#A1A1AA"
              multiline
              autoCorrect={false}
              autoCapitalize="sentences"
              blurOnSubmit={false}
              returnKeyType="default"
              keyboardType="default"
              textContentType="none"
            />
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                if (!blockId || !newComment.trim()) return;
                const avatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setComments(c => ({ ...c, [blockId]: [...(c[blockId] || []), { id: Date.now().toString(), text: newComment, avatar, time }] }));
                setNewComment('');
              }}
            >
              <MessageCircle size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowComment(null)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  // --- Block Toolbar ---
  const BlockToolbar = ({ blockId }: { blockId: string }) => (
    <View style={styles.toolbar}>
      <TouchableOpacity style={styles.toolbarBtn} onPress={() => updateBlock(blockId, blocks.find(b => b.id === blockId)?.content?.toUpperCase() || '')}>
        <Bold size={16} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarBtn} onPress={() => updateBlock(blockId, (blocks.find(b => b.id === blockId)?.content || '') + '\n• New bullet') }>
        <ListIcon size={16} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toolbarBtn} onPress={() => setShowToolbar(null)}>
        <MoreVertical size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // --- Render Block ---
  const renderBlock = ({ item, drag, isActive }: RenderItemParams<CanvasBlock>) => {
    const blockComments = comments[item.id] || [];
    const isExpanded = expandedComments[item.id];
    return (
      <Pressable
        key={item.id}
        onLongPress={drag}
        onPress={() => setShowToolbar({ blockId: item.id })}
        style={[styles.blockWrap, showToolbar?.blockId === item.id && styles.blockWrapActive, isActive && styles.blockWrapDragging]}
      >
        {showToolbar?.blockId === item.id && <BlockToolbar blockId={item.id} />}
        <View style={styles.blockRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={drag}><MoreVertical size={16} color="#A1A1AA" /></TouchableOpacity>
          {item.type === 'header' && (
            <TextInput
              style={styles.blockHeader}
              value={item.content}
              onChangeText={txt => updateBlock(item.id, txt)}
              placeholder="Header"
              placeholderTextColor="#A1A1AA"
              autoCorrect={false}
              autoCapitalize="words"
              blurOnSubmit={false}
              returnKeyType="next"
              keyboardType="default"
              textContentType="none"
            />
          )}
          {item.type === 'text' && (
            <TextInput
              style={styles.blockText}
              value={item.content}
              onChangeText={txt => updateBlock(item.id, txt)}
              placeholder="Text"
              placeholderTextColor="#A1A1AA"
              multiline
              autoCorrect={false}
              autoCapitalize="sentences"
              blurOnSubmit={false}
              returnKeyType="default"
              keyboardType="default"
              textContentType="none"
            />
          )}
          {item.type === 'list' && (
            <TextInput
              style={styles.blockList}
              value={item.content}
              onChangeText={txt => updateBlock(item.id, txt)}
              placeholder="List (use bullets)"
              placeholderTextColor="#A1A1AA"
              multiline
              autoCorrect={false}
              autoCapitalize="sentences"
              blurOnSubmit={false}
              returnKeyType="default"
              keyboardType="default"
              textContentType="none"
            />
          )}
          {item.type === 'image' && item.content && (
            <View style={styles.blockImageWrap}>
              <Image source={{ uri: item.content }} style={styles.blockImage} />
            </View>
          )}
          {item.type === 'file' && (
            <View style={styles.blockFileWrap}>
              <FileText size={18} color="#7C3AED" />
              <Text style={styles.blockFileText}>[File: {item.content}]</Text>
            </View>
          )}
          {item.type === 'video' && item.content && (
            <View style={{ flex: 1, minWidth: 180, minHeight: 120 }}>
              <Video
                source={{ uri: item.content }}
                style={{ width: 180, height: 120, borderRadius: 8 }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
            </View>
          )}
          {item.type === 'audio' && item.content && (
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Volume2 size={18} color="#7C3AED" />
              <Text style={{ color: '#fff' }}>[Audio]</Text>
              {/* Expo Audio player UI can be added here for advanced playback */}
            </View>
          )}
          {item.type === 'embed' && (
            <View style={{ flex: 1, backgroundColor: '#232042', borderRadius: 8, padding: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Code2 size={18} color="#7C3AED" />
              <Text style={{ color: '#fff', marginTop: 4 }}>Embedded App/Workflow (placeholder)</Text>
            </View>
          )}
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowComment({ blockId: item.id })}>
            <MessageCircle size={16} color="#A1A1AA" />
          </TouchableOpacity>
        </View>
        {/* Inline comment preview and thread */}
        <View style={{ width: '100%', alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
          {blockComments.length > 0 && !isExpanded && (
            <TouchableOpacity onPress={() => setExpandedComments(ec => ({ ...ec, [item.id]: true }))} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {blockComments.slice(0, 3).map((c, idx) => (
                <Image key={idx} source={{ uri: c.avatar }} style={{ width: 18, height: 18, borderRadius: 9, marginRight: -6, borderWidth: 1, borderColor: '#fff' }} />
              ))}
              <Text style={{ color: '#A1A1AA', fontSize: 13 }}>+{blockComments.length} comment{blockComments.length > 1 ? 's' : ''}</Text>
            </TouchableOpacity>
          )}
          {isExpanded && (
            <View style={{ backgroundColor: '#232042', borderRadius: 8, padding: 12, marginTop: 2, maxWidth: 420, width: '100%' }}>
              <TouchableOpacity onPress={() => setExpandedComments(ec => ({ ...ec, [item.id]: false }))}>
                <Text style={{ color: '#7C3AED', fontSize: 13, marginBottom: 4 }}>Hide comments</Text>
              </TouchableOpacity>
              {blockComments.length === 0 && <Text style={{ color: '#A1A1AA', fontSize: 13 }}>No comments yet.</Text>}
              {blockComments.map((c, idx) => (
                <View key={c.id} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                  <Image source={{ uri: c.avatar }} style={{ width: 22, height: 22, borderRadius: 11, marginRight: 6 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 14 }}>{c.text}</Text>
                    <Text style={{ color: '#A1A1AA', fontSize: 11 }}>{c.time}</Text>
                  </View>
                </View>
              ))}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <TextInput
                  style={{ flex: 1, backgroundColor: '#181A20', borderRadius: 8, color: '#fff', fontSize: 14, padding: 6, marginRight: 6 }}
                  value={isExpanded && showComment?.blockId === item.id ? newComment : ''}
                  onChangeText={txt => { setShowComment({ blockId: item.id }); setNewComment(txt); }}
                  placeholder="Add a comment..."
                  placeholderTextColor="#A1A1AA"
                  multiline
                />
                <TouchableOpacity
                  style={{ backgroundColor: '#7C3AED', borderRadius: 8, padding: 8 }}
                  onPress={() => {
                    if (!newComment.trim()) return;
                    const avatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    setComments(c => ({ ...c, [item.id]: [...(c[item.id] || []), { id: Date.now().toString(), text: newComment, avatar, time }] }));
                    setNewComment('');
                    setShowComment(null);
                  }}
                >
                  <MessageCircle size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Canvas</Text>
        <TouchableOpacity style={styles.shareIconBtn} onPress={() => setShowShare(true)}>
          <Share2 size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <TextInput
          style={styles.titleInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter canvas title"
          placeholderTextColor="#A1A1AA"
          autoCorrect={false}
          autoCapitalize="words"
          blurOnSubmit={false}
          returnKeyType="done"
          keyboardType="default"
          textContentType="none"
        />
        <DraggableFlatList
          data={blocks}
          onDragEnd={({ data }) => setBlocks(data)}
          renderItem={renderBlock}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.addBlockScroll} contentContainerStyle={{ gap: 8, paddingVertical: 8 }}>
          {blockTypes.map(bt => (
            <TouchableOpacity key={bt.type} style={styles.addBlockBtn} onPress={() => addBlock(bt.type)}>
              <bt.icon size={16} color="#fff" />
              <Text style={styles.addBlockText}>{bt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <SaveIcon size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
      <ShareModal />
      <CommentModal />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />

      {/* Workflow Selection Modal */}
      <Modal visible={showWorkflowModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Embed Workflow</Text>
            <Text style={styles.modalDesc}>Choose a workflow to embed in your canvas</Text>
            
            <TouchableOpacity 
              style={styles.workflowOption}
              onPress={() => {
                const newId = (blocks.length + 1).toString();
                setBlocks([...blocks, { id: newId, type: 'embed', content: 'Task Assignment Workflow' }]);
                setShowWorkflowModal(false);
              }}
            >
              <Text style={styles.workflowTitle}>Task Assignment</Text>
              <Text style={styles.workflowDesc}>Automatically assign tasks based on workload</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.workflowOption}
              onPress={() => {
                const newId = (blocks.length + 1).toString();
                setBlocks([...blocks, { id: newId, type: 'embed', content: 'Approval Workflow' }]);
                setShowWorkflowModal(false);
              }}
            >
              <Text style={styles.workflowTitle}>Approval Process</Text>
              <Text style={styles.workflowDesc}>Multi-step approval workflow</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.workflowOption}
              onPress={() => {
                const newId = (blocks.length + 1).toString();
                setBlocks([...blocks, { id: newId, type: 'embed', content: 'Notification Workflow' }]);
                setShowWorkflowModal(false);
              }}
            >
              <Text style={styles.workflowTitle}>Smart Notifications</Text>
              <Text style={styles.workflowDesc}>Intelligent notification system</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowWorkflowModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function CanvasEditorScreen() {
  return (
    <CanvasProvider>
      <CanvasEditorContent />
    </CanvasProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#181A20',
    borderBottomWidth: 1,
    borderBottomColor: '#23242A',
    marginBottom: 8,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -0.5,
    flex: 1,
  },
  shareIconBtn: {
    marginLeft: 12,
    padding: 4,
  },
  card: {
    backgroundColor: '#23242A',
    borderRadius: 16,
    margin: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#312E81',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
  },
  addBlockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
  },
  addBlockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312E81',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 4,
  },
  addBlockText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 14,
  },
  blockWrap: {
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  blockWrapActive: {
    borderColor: '#7C3AED',
    backgroundColor: '#232042',
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181A20',
    borderRadius: 8,
    padding: 10,
    gap: 8,
  },
  blockHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    backgroundColor: 'transparent',
  },
  blockText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    backgroundColor: 'transparent',
  },
  blockList: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    backgroundColor: 'transparent',
  },
  blockImageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  blockImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#23242A',
  },
  blockImageText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  blockFileWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  blockFileText: {
    color: '#A1A1AA',
    fontSize: 14,
  },
  iconBtn: {
    padding: 4,
    marginLeft: 2,
  },
  toolbar: {
    flexDirection: 'row',
    backgroundColor: '#312E81',
    borderRadius: 8,
    padding: 6,
    marginBottom: 4,
    gap: 8,
    alignSelf: 'flex-start',
  },
  toolbarBtn: {
    padding: 4,
    marginRight: 4,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#23242A',
    borderRadius: 16,
    padding: 24,
    width: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  modalDesc: {
    color: '#A1A1AA',
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
  },
  shareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shareLabel: {
    color: '#A1A1AA',
    fontWeight: 'bold',
    marginRight: 8,
  },
  shareValue: {
    color: '#fff',
    fontWeight: '500',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 12,
    marginTop: 8,
  },
  shareBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  closeBtn: {
    marginTop: 10,
    padding: 8,
  },
  closeBtnText: {
    color: '#7C3AED',
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentInput: {
    minHeight: 80,
    backgroundColor: '#181A20',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    width: 240,
  },
  commentBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#312E81',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    marginRight: 8,
    marginLeft: 0,
    maxWidth: 220,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 2,
  },
  commentTime: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  commentDelete: {
    marginLeft: 8,
    padding: 4,
  },
  commentEmpty: {
    color: '#A1A1AA',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 16,
  },
  addBlockScroll: {
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 0,
  },
  blockWrapDragging: {
    opacity: 0.7,
    borderColor: '#7C3AED',
    backgroundColor: '#232042',
  },
  // Workflow modal styles
  modalContent: {
    backgroundColor: '#23242A',
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxHeight: 400,
  },
  workflowOption: {
    backgroundColor: '#312E81',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  workflowTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workflowDesc: {
    color: '#A1A1AA',
    fontSize: 14,
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 