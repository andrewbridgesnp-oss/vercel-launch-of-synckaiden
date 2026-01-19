import { useEffect, useRef, useCallback, useState } from 'react';

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => void | Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

interface AutoSaveState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

/**
 * Hook for auto-saving data with debouncing
 * @param options - Configuration options
 * @returns AutoSaveState and control functions
 */
export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 1000,
  enabled = true,
}: AutoSaveOptions<T>) {
  const [state, setState] = useState<AutoSaveState>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<T>(data);
  const onSaveRef = useRef(onSave);

  // Keep onSave reference up to date
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Check if data has changed
  const hasDataChanged = useCallback((newData: T, oldData: T): boolean => {
    return JSON.stringify(newData) !== JSON.stringify(oldData);
  }, []);

  // Perform the save
  const performSave = useCallback(async (dataToSave: T) => {
    setState(prev => ({ ...prev, isSaving: true, error: null }));
    
    try {
      await onSaveRef.current(dataToSave);
      setState(prev => ({
        ...prev,
        isSaving: false,
        lastSaved: new Date(),
        hasUnsavedChanges: false,
      }));
      previousDataRef.current = dataToSave;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isSaving: false,
        error: error instanceof Error ? error.message : 'Save failed',
      }));
    }
  }, []);

  // Manual save function
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    performSave(data);
  }, [data, performSave]);

  // Cancel pending save
  const cancelSave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Reset to last saved state
  const reset = useCallback(() => {
    cancelSave();
    setState(prev => ({ ...prev, hasUnsavedChanges: false, error: null }));
  }, [cancelSave]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const dataChanged = hasDataChanged(data, previousDataRef.current);
    
    if (dataChanged) {
      setState(prev => ({ ...prev, hasUnsavedChanges: true }));
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout for debounced save
      timeoutRef.current = setTimeout(() => {
        performSave(data);
      }, debounceMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, enabled, debounceMs, hasDataChanged, performSave]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [state.hasUnsavedChanges]);

  return {
    ...state,
    saveNow,
    cancelSave,
    reset,
  };
}

export default useAutoSave;
