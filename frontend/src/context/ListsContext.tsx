import React, { createContext, useContext, useState } from 'react';

/**
 * Lists context from Mike implementation
 * Enhanced for unified DevSync functionality
 */
export interface ListItem {
  id: string;
  title: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  tags: string[];
  description: string;
  subtasks: Subtask[];
  comments: Comment[];
  completed: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  time: string;
}

interface ListsContextType {
  items: ListItem[];
  setItems: (items: ListItem[]) => void;
  getItem: (id: string) => ListItem | undefined;
  updateItem: (id: string, updates: Partial<ListItem>) => void;
  addItem: (item: Omit<ListItem, 'id'>) => void;
  deleteItem: (id: string) => void;
}

const ListsContext = createContext<ListsContextType | undefined>(undefined);

export const useListsContext = () => {
  const context = useContext(ListsContext);
  if (!context) {
    throw new Error('useListsContext must be used within a ListsProvider');
  }
  return context;
};

export const ListsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ListItem[]>([
    {
      id: '1',
      title: 'Setup DevSync development environment',
      assignee: 'Caleb Adams',
      dueDate: '2025-02-15',
      priority: 'high',
      status: 'In Progress',
      tags: ['development', 'setup'],
      description: 'Configure local development environment for DevSync project',
      subtasks: [
        { id: '1-1', title: 'Install dependencies', completed: true },
        { id: '1-2', title: 'Configure database', completed: false },
        { id: '1-3', title: 'Setup environment variables', completed: false },
      ],
      comments: [
        { id: '1-1', text: 'Started working on this task', author: 'Caleb Adams', time: '2 hours ago' },
        { id: '1-2', text: 'Dependencies installed successfully', author: 'Caleb Adams', time: '1 hour ago' },
      ],
      completed: false,
    },
    {
      id: '2',
      title: 'Implement real-time messaging',
      assignee: 'Michael Oti Yamoah',
      dueDate: '2025-02-20',
      priority: 'high',
      status: 'To Do',
      tags: ['backend', 'websocket'],
      description: 'Implement WebSocket-based real-time messaging system',
      subtasks: [
        { id: '2-1', title: 'Setup WebSocket configuration', completed: false },
        { id: '2-2', title: 'Implement message broadcasting', completed: false },
        { id: '2-3', title: 'Add typing indicators', completed: false },
      ],
      comments: [
        { id: '2-1', text: 'Researching WebSocket implementation', author: 'Michael Oti Yamoah', time: '3 hours ago' },
      ],
      completed: false,
    },
    {
      id: '3',
      title: 'Design user interface mockups',
      assignee: 'Hakeem Adam',
      dueDate: '2025-02-10',
      priority: 'medium',
      status: 'Done',
      tags: ['design', 'ui/ux'],
      description: 'Create comprehensive UI mockups for DevSync application',
      subtasks: [
        { id: '3-1', title: 'Login/signup screens', completed: true },
        { id: '3-2', title: 'Chat interface', completed: true },
        { id: '3-3', title: 'Settings screens', completed: true },
      ],
      comments: [
        { id: '3-1', text: 'Mockups completed and approved', author: 'Hakeem Adam', time: '2 days ago' },
        { id: '3-2', text: 'Great work on the design!', author: 'DevSync Admin', time: '1 day ago' },
      ],
      completed: true,
    },
  ]);

  const getItem = (id: string) => {
    return items.find(item => item.id === id);
  };

  const updateItem = (id: string, updates: Partial<ListItem>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const addItem = (newItem: Omit<ListItem, 'id'>) => {
    const id = (items.length + 1).toString();
    setItems(prevItems => [...prevItems, { ...newItem, id }]);
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <ListsContext.Provider value={{
      items,
      setItems,
      getItem,
      updateItem,
      addItem,
      deleteItem,
    }}>
      {children}
    </ListsContext.Provider>
  );
};