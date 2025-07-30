export interface User {
  id: string;
  name: string;
  avatar: string;
  color: string;
  online: boolean;
  lastMessage?: string;
  lastMessageTime?: string;
}

export const allUsers: User[] = [
  { id: '1', name: 'Caleb Adams', avatar: 'C', color: '#E91E63', online: false, lastMessage: 'Hey, how are you?', lastMessageTime: '2m ago' },
  { id: '2', name: 'Michael Oti Yamoah', avatar: 'M', color: '#8B4513', online: false, lastMessage: 'Thanks for the help!', lastMessageTime: '5m ago' },
  { id: '3', name: 'Hakeem Adam', avatar: 'H', color: '#4CAF50', online: true, lastMessage: 'Meeting at 3 PM', lastMessageTime: '1h ago' },
  { id: '4', name: 'Sarah Johnson', avatar: 'S', color: '#9C27B0', online: false, lastMessage: 'Project update ready', lastMessageTime: '2h ago' },
  { id: '5', name: 'David Chen', avatar: 'D', color: '#FF5722', online: true, lastMessage: 'Code review completed', lastMessageTime: '3h ago' },
  { id: '6', name: 'Emily Davis', avatar: 'E', color: '#2196F3', online: false, lastMessage: 'Design files uploaded', lastMessageTime: '1d ago' },
  { id: '7', name: 'Alex Thompson', avatar: 'A', color: '#FF9800', online: false, lastMessage: 'Budget approved', lastMessageTime: '2d ago' },
  { id: '8', name: 'Maria Garcia', avatar: 'M', color: '#795548', online: true, lastMessage: 'Client meeting scheduled', lastMessageTime: '3d ago' },
];

export const getUserById = (id: string): User | undefined => {
  return allUsers.find(user => user.id === id);
};

export const getUserByName = (name: string): User | undefined => {
  return allUsers.find(user => user.name.toLowerCase() === name.toLowerCase());
}; 