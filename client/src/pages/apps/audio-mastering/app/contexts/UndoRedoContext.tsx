import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface HistoryState {
  past: any[];
  present: any;
  future: any[];
}

interface UndoRedoContextType {
  state: any;
  setState: (newState: any) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  reset: (newState: any) => void;
  historyLength: number;
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(undefined);

export function UndoRedoProvider({ children, initialState }: { children: ReactNode; initialState: any }) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: [],
  });

  const setState = useCallback((newState: any) => {
    setHistory((prev) => ({
      past: [...prev.past, prev.present].slice(-50), // Keep max 50 history items
      present: newState,
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const reset = useCallback((newState: any) => {
    setHistory({
      past: [],
      present: newState,
      future: [],
    });
  }, []);

  return (
    <UndoRedoContext.Provider
      value={{
        state: history.present,
        setState,
        undo,
        redo,
        canUndo: history.past.length > 0,
        canRedo: history.future.length > 0,
        reset,
        historyLength: history.past.length + history.future.length + 1,
      }}
    >
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedo() {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useUndoRedo must be used within UndoRedoProvider');
  }
  return context;
}
