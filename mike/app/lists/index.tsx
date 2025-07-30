import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Pressable, Modal } from 'react-native';
import { router } from 'expo-router';
import { Plus, List as ListIcon, FileText } from 'lucide-react-native';
import { ListsProvider } from '../../src/context/ListsContext';

interface List {
  id: string;
  title: string;
  updatedAt: string;
  template?: string;
}

const templates = [
  { id: 'tpl1', title: 'Project Plan' },
  { id: 'tpl2', title: 'To-Dos' },
  { id: 'tpl3', title: 'Meeting Notes' },
];

const initialLists: List[] = [
  { id: '1', title: 'Sprint Tasks', updatedAt: '2025-07-20', template: 'To-Dos' },
  { id: '2', title: 'Product Roadmap', updatedAt: '2025-07-18', template: 'Project Plan' },
];

function ListsIndexContent() {
  const [lists, setLists] = useState<List[]>(initialLists);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleCreate = (template?: string) => {
    const newId = (lists.length + 1).toString();
    const newList = {
      id: newId,
      title: template ? `${template} List` : `Untitled List ${newId}`,
      updatedAt: new Date().toISOString().slice(0, 10),
      template,
    };
    setLists([newList, ...lists]);
    setShowTemplateModal(false);
  };

  const handleOpen = (id: string) => {
    router.push({ pathname: '/lists/view', params: { id } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lists</Text>
      </View>
      <FlatList
        data={lists}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.listItem} onPress={() => handleOpen(item.id)}>
            <View style={styles.iconWrap}>
              <ListIcon size={22} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.listDate}>Last updated: {item.updatedAt}</Text>
              {item.template && <Text style={styles.listTemplate}>Template: {item.template}</Text>}
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No lists yet. Tap + to create one.</Text>}
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
                <FileText size={18} color="#7C3AED" style={{ marginRight: 10 }} />
                <Text style={styles.templateText}>{tpl.title}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.templateBtn} onPress={() => handleCreate()}>
              <Plus size={18} color="#7C3AED" style={{ marginRight: 10 }} />
              <Text style={styles.templateText}>Blank List</Text>
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

export default function ListsIndexScreen() {
  return (
    <ListsProvider>
      <ListsIndexContent />
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
  listItem: {
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
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  listDate: {
    fontSize: 13,
    color: '#A1A1AA',
  },
  listTemplate: {
    fontSize: 12,
    color: '#7C3AED',
    marginTop: 2,
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
    backgroundColor: '#7C3AED',
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
  closeBtn: {
    marginTop: 10,
    padding: 8,
  },
  closeBtnText: {
    color: '#7C3AED',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 