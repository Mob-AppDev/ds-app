import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import { Plus, FileText, Star, StarOff } from 'lucide-react-native';
import { useCanvasContext, CanvasProvider } from '../../src/context/CanvasContext';

/**
 * Canvas list screen from Mike implementation
 * Enhanced with DevSync branding and unified styling
 */
interface Canvas {
  id: string;
  title: string;
  updatedAt: string;
  starred?: boolean;
  template?: string;
}

const templates = [
  { id: 'tpl1', title: 'Meeting Notes', description: 'Capture meeting agenda, notes, and action items' },
  { id: 'tpl2', title: 'Project Brief', description: 'Define project goals, requirements, and timeline' },
  { id: 'tpl3', title: 'Retrospective', description: 'Team retrospective with what went well and improvements' },
  { id: 'tpl4', title: 'Design System', description: 'Document design tokens, components, and guidelines' },
  { id: 'tpl5', title: 'Product Roadmap', description: 'Product strategy and feature planning' },
  { id: 'tpl6', title: 'Sprint Planning', description: 'Agile sprint planning with user stories and tasks' },
];

function CanvasListContent() {
  const { canvases, setCanvases } = useCanvasContext();
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleCreate = (template?: string) => {
    const newId = (canvases.length + 1).toString();
    const newCanvas = {
      id: newId,
      title: template ? `${template}` : `Untitled Canvas ${newId}`,
      updatedAt: new Date().toISOString().slice(0, 10),
      starred: false,
      template,
      blocks: getTemplateBlocks(template),
    };
    setCanvases([newCanvas, ...canvases]);
    setShowTemplateModal(false);
  };

  const getTemplateBlocks = (template?: string) => {
    switch (template) {
      case 'Meeting Notes':
        return [
          { id: '1', type: 'header', content: 'Meeting Notes' },
          { id: '2', type: 'text', content: 'Meeting: [Meeting Name]\nDate: [Date]\nAttendees: [List attendees]' },
          { id: '3', type: 'header', content: 'Agenda' },
          { id: '4', type: 'list', content: '- [Agenda item 1]\n- [Agenda item 2]\n- [Agenda item 3]' },
        ];
      case 'Project Brief':
        return [
          { id: '1', type: 'header', content: 'Project Brief' },
          { id: '2', type: 'text', content: 'Project: [Project Name]\nClient: [Client Name]\nTimeline: [Timeline]' },
          { id: '3', type: 'header', content: 'Requirements' },
          { id: '4', type: 'list', content: '- [Requirement 1]\n- [Requirement 2]\n- [Requirement 3]' },
        ];
      default:
        return [
          { id: '1', type: 'header', content: 'Untitled Canvas' },
          { id: '2', type: 'text', content: 'Start writing your content here...' },
        ];
    }
  };

  const handleOpen = (id: string) => {
    router.push({ pathname: '/canvases/editor', params: { id } });
  };

  const handleStar = (id: string) => {
    setCanvases(canvases =>
      canvases.map(c => c.id === id ? { ...c, starred: !c.starred } : c)
    );
  };

  const starred = canvases.filter(c => c.starred);
  const recent = canvases.filter(c => !c.starred);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>DevSync Canvases</Text>
      </View>
      <FlatList
        data={starred}
        keyExtractor={item => 'starred-' + item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.canvasItem} onPress={() => handleOpen(item.id)}>
            <View style={styles.iconWrap}>
              <FileText size={22} color="#4A154B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.canvasTitle}>{item.title}</Text>
              <Text style={styles.canvasDate}>Last updated: {item.updatedAt}</Text>
              {item.template && <Text style={styles.canvasTemplate}>Template: {item.template}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleStar(item.id)} style={styles.starBtn}>
              <Star size={22} color="#FFD600" fill="#FFD600" />
            </TouchableOpacity>
          </Pressable>
        )}
        ListHeaderComponent={starred.length > 0 ? <Text style={styles.sectionHeader}>Starred</Text> : null}
        ListEmptyComponent={null}
      />
      <FlatList
        data={recent}
        keyExtractor={item => 'recent-' + item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.canvasItem} onPress={() => handleOpen(item.id)}>
            <View style={styles.iconWrap}>
              <FileText size={22} color="#4A154B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.canvasTitle}>{item.title}</Text>
              <Text style={styles.canvasDate}>Last updated: {item.updatedAt}</Text>
              {item.template && <Text style={styles.canvasTemplate}>Template: {item.template}</Text>}
            </View>
            <TouchableOpacity onPress={() => handleStar(item.id)} style={styles.starBtn}>
              {item.starred ? (
                <Star size={22} color="#FFD600" fill="#FFD600" />
              ) : (
                <StarOff size={22} color="#A1A1AA" />
              )}
            </TouchableOpacity>
          </Pressable>
        )}
        ListHeaderComponent={recent.length > 0 ? <Text style={styles.sectionHeader}>Recent</Text> : null}
        ListEmptyComponent={<Text style={styles.emptyText}>No canvases yet. Tap + to create one.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <TouchableOpacity style={styles.fab} onPress={() => setShowTemplateModal(true)}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>
      <Modal visible={showTemplateModal} transparent animationType="slide" onRequestClose={() => setShowTemplateModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Choose a template</Text>
            {templates.map(tpl => (
              <TouchableOpacity key={tpl.id} style={styles.templateBtn} onPress={() => handleCreate(tpl.title)}>
                <FileText size={18} color="#4A154B" style={{ marginRight: 10 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.templateText}>{tpl.title}</Text>
                  <Text style={styles.templateDesc}>{tpl.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.templateBtn} onPress={() => handleCreate()}>
              <Plus size={18} color="#4A154B" style={{ marginRight: 10 }} />
              <Text style={styles.templateText}>Blank Canvas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowTemplateModal(false)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default function CanvasListScreen() {
  return (
    <CanvasProvider>
      <CanvasListContent />
    </CanvasProvider>
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
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#181A20',
    borderBottomWidth: 1,
    borderBottomColor: '#23242A',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: -1,
  },
  sectionHeader: {
    color: '#A1A1AA',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 24,
    marginTop: 16,
    marginBottom: 4,
  },
  canvasItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23242A',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#312E81',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  canvasTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  canvasDate: {
    fontSize: 13,
    color: '#A1A1AA',
  },
  canvasTemplate: {
    fontSize: 12,
    color: '#4A154B',
    marginTop: 2,
  },
  starBtn: {
    marginLeft: 10,
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 32,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A154B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
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
    marginBottom: 16,
  },
  templateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#312E81',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    width: 240,
  },
  templateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  templateDesc: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    marginTop: 10,
    padding: 8,
  },
  closeBtnText: {
    color: '#4A154B',
    fontWeight: 'bold',
    fontSize: 16,
  },
});