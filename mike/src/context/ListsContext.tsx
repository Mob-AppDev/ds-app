import React, { createContext, useContext, useState } from 'react';

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
      title: 'Design login page',
      assignee: 'Caleb',
      dueDate: '2025-07-25',
      priority: 'high',
      status: 'To Do',
      tags: ['design', 'frontend'],
      description: 'Create a modern login page with authentication flow',
      subtasks: [
        { id: '1-1', title: 'Wireframe design', completed: true },
        { id: '1-2', title: 'UI mockups', completed: false },
        { id: '1-3', title: 'Responsive design', completed: false },
      ],
      comments: [
        { id: '1-1', text: 'Should we add social login options?', author: 'Alice', time: '2 hours ago' },
        { id: '1-2', text: 'I\'ll start working on this tomorrow', author: 'Caleb', time: '1 hour ago' },
      ],
      completed: false,
    },
    {
      id: '2',
      title: 'API integration',
      assignee: 'Michael',
      dueDate: '2025-07-26',
      priority: 'medium',
      status: 'In Progress',
      tags: ['backend', 'api'],
      description: 'Integrate third-party APIs for payment processing',
      subtasks: [
        { id: '2-1', title: 'Set up API keys', completed: true },
        { id: '2-2', title: 'Implement authentication', completed: false },
        { id: '2-3', title: 'Test endpoints', completed: false },
      ],
      comments: [
        { id: '2-1', text: 'API documentation received', author: 'Michael', time: '3 hours ago' },
        { id: '2-2', text: 'Starting with Stripe integration', author: 'Michael', time: '1 hour ago' },
      ],
      completed: false,
    },
    {
      id: '3',
      title: 'Write docs',
      assignee: 'Hakeem',
      dueDate: '2025-07-20',
      priority: 'low',
      status: 'Done',
      tags: ['documentation'],
      description: 'Create comprehensive documentation for the project',
      subtasks: [
        { id: '3-1', title: 'API documentation', completed: true },
        { id: '3-2', title: 'User guide', completed: true },
        { id: '3-3', title: 'Developer setup guide', completed: true },
      ],
      comments: [
        { id: '3-1', text: 'Docs are ready for review', author: 'Hakeem', time: '2 days ago' },
        { id: '3-2', text: 'Approved and published', author: 'Alice', time: '1 day ago' },
      ],
      completed: true,
    },
    {
      id: '4',
      title: 'QA review',
      assignee: 'Alvin',
      dueDate: '2025-07-28',
      priority: 'high',
      status: 'To Do',
      tags: ['testing', 'qa'],
      description: 'Perform comprehensive quality assurance testing',
      subtasks: [
        { id: '4-1', title: 'Unit tests', completed: false },
        { id: '4-2', title: 'Integration tests', completed: false },
        { id: '4-3', title: 'User acceptance testing', completed: false },
      ],
      comments: [
        { id: '4-1', text: 'Test environment is ready', author: 'Alvin', time: '4 hours ago' },
      ],
      completed: false,
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