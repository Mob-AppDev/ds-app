import React, { createContext, useContext, useState, ReactNode } from 'react';

/**
 * Status context from Mike implementation
 * Enhanced for unified DevSync functionality
 */
type UserStatus = 'active' | 'away' | 'dnd';

interface StatusContextType {
  userStatus: UserStatus;
  setUserStatus: (status: UserStatus) => void;
  statusText: string;
  statusColor: string;
  statusEmoji: string;
}

const StatusContext = createContext<StatusContextType | undefined>(undefined);

export const useStatus = () => {
  const context = useContext(StatusContext);
  if (context === undefined) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};

interface StatusProviderProps {
  children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
  const [userStatus, setUserStatusState] = useState<UserStatus>('active');

  const setUserStatus = (status: UserStatus) => {
    setUserStatusState(status);
    // In production, this would also update the backend via API
  };

  const statusText = userStatus === 'active' ? 'Active' : 
                    userStatus === 'away' ? 'Away' : 'Do not disturb';

  const statusColor = userStatus === 'active' ? '#4CAF50' : 
                     userStatus === 'away' ? '#FFA726' : '#F44336';

  const statusEmoji = userStatus === 'active' ? '🟢' : 
                     userStatus === 'away' ? '🟡' : '🔴';

  return (
    <StatusContext.Provider value={{ 
      userStatus, 
      setUserStatus, 
      statusText, 
      statusColor, 
      statusEmoji 
    }}>
      {children}
    </StatusContext.Provider>
  );
};