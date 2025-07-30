export interface Channel {
  id: string;
  name: string;
  type: 'public' | 'private';
  memberCount: number;
}

export interface DM {
  id: string;
  name: string;
  participants: string[];
  lastMessage?: string;
}

export interface ExternalOrg {
  id: string;
  name: string;
  type: 'active' | 'pending' | 'request';
  channels: Channel[];
  dms: DM[];
  status: string;
  avatar?: string;
}

// Mock data - in real app this would come from your data source
export const externalOrgs: ExternalOrg[] = [
  {
    id: '1',
    name: 'Acme Corp',
    type: 'active',
    channels: [
      { id: '1', name: '#project-collab', type: 'public', memberCount: 12 },
      { id: '2', name: '#marketing-team', type: 'public', memberCount: 8 },
      { id: '3', name: '#dev-ops', type: 'private', memberCount: 5 },
    ],
    dms: [
      { id: '1', name: 'Sarah Johnson', participants: ['sarah.j', 'you'], lastMessage: 'Thanks for the update!' },
      { id: '2', name: 'Mike Chen', participants: ['mike.c', 'you'], lastMessage: 'Meeting at 3 PM?' },
      { id: '3', name: 'Design Team', participants: ['sarah.j', 'mike.c', 'alex.d', 'you'], lastMessage: 'New mockups ready' },
      { id: '4', name: 'Project Alpha', participants: ['sarah.j', 'mike.c', 'you'], lastMessage: 'Deadline moved to Friday' },
      { id: '5', name: 'Lisa Wang', participants: ['lisa.w', 'you'], lastMessage: 'Can you review the proposal?' },
    ],
    status: 'Connected',
  },
  {
    id: '2',
    name: 'TechStart Inc',
    type: 'active',
    channels: [
      { id: '1', name: '#partnership', type: 'public', memberCount: 6 },
    ],
    dms: [
      { id: '1', name: 'David Kim', participants: ['david.k', 'you'], lastMessage: 'Great working with you!' },
      { id: '2', name: 'Product Team', participants: ['david.k', 'emma.r', 'you'], lastMessage: 'API integration complete' },
    ],
    status: 'Connected',
  },
  {
    id: '3',
    name: 'Global Solutions',
    type: 'pending',
    channels: [],
    dms: [],
    status: 'Invite sent',
  },
  {
    id: '4',
    name: 'Innovation Labs',
    type: 'request',
    channels: [],
    dms: [],
    status: 'Request received',
  },
]; 