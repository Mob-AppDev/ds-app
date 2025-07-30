import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CanvasBlock {
  id: string;
  type: string;
  content: string;
}
export interface CanvasComment {
  id: string;
  text: string;
  avatar: string;
  time: string;
}
export interface CanvasShare {
  targetId: string; // channel, DM, or user id
  targetType: 'channel' | 'dm' | 'user';
  permission: 'view' | 'edit';
  name: string; // display name for UI
}
export interface Canvas {
  id: string;
  title: string;
  updatedAt: string;
  starred?: boolean;
  template?: string;
  blocks?: CanvasBlock[];
  comments?: { [blockId: string]: CanvasComment[] };
  sharedWith?: CanvasShare[];
}

const initialCanvases: Canvas[] = [
  { id: '1', title: 'Team Meeting Notes', updatedAt: '2025-07-20', starred: true, template: 'Meeting Notes', blocks: [], comments: {}, sharedWith: [] },
  { id: '2', title: 'Project Brief', updatedAt: '2025-07-18', starred: false, template: 'Project Brief', blocks: [], comments: {}, sharedWith: [] },
  { id: '3', title: 'Sprint Retrospective', updatedAt: '2025-07-15', starred: false, template: 'Retrospective', blocks: [], comments: {}, sharedWith: [] },
];

interface CanvasContextType {
  canvases: Canvas[];
  setCanvases: React.Dispatch<React.SetStateAction<Canvas[]>>;
  saveCanvas: (canvas: Canvas) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [canvases, setCanvases] = useState<Canvas[]>(initialCanvases);

  const saveCanvas = (canvas: Canvas) => {
    setCanvases(prev => {
      const exists = prev.find(c => c.id === canvas.id);
      if (exists) {
        return prev.map(c => c.id === canvas.id ? { ...canvas, updatedAt: new Date().toISOString().slice(0, 10) } : c);
      } else {
        return [{ ...canvas, updatedAt: new Date().toISOString().slice(0, 10) }, ...prev];
      }
    });
  };

  return (
    <CanvasContext.Provider value={{ canvases, setCanvases, saveCanvas }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvasContext() {
  const ctx = useContext(CanvasContext);
  if (!ctx) throw new Error('useCanvasContext must be used within a CanvasProvider');
  return ctx;
} 