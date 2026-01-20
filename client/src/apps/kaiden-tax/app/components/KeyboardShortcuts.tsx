import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Command, X } from 'lucide-react';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { keys: ['Space'], description: 'Activate voice input' },
    { keys: ['H'], description: 'Toggle command history' },
    { keys: ['I'], description: 'Toggle insights panel' },
    { keys: ['S'], description: 'Open settings' },
    { keys: ['Q'], description: 'Show quick actions' },
    { keys: ['P'], description: 'Toggle standby mode' },
    { keys: ['Esc'], description: 'Close panels' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div 
              className="rounded-2xl backdrop-blur-xl overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(168, 182, 216, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              }}
            >
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Command className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg text-slate-100 font-medium">Keyboard Shortcuts</h2>
                    <p className="text-slate-500 text-sm">Executive productivity commands</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-2">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/30 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className="text-slate-300 text-sm">{shortcut.description}</span>
                    <div className="flex gap-1">
                      {shortcut.keys.map((key, i) => (
                        <kbd
                          key={i}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium shadow-sm"
                          style={{
                            background: 'linear-gradient(135deg, rgba(168, 182, 216, 0.2), rgba(147, 158, 187, 0.1))',
                            border: '1px solid rgba(168, 182, 216, 0.3)',
                            color: '#e2e8f0',
                          }}
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-4 bg-slate-900/50 border-t border-slate-700/50 text-center">
                <p className="text-slate-500 text-xs">
                  Press <kbd className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs">?</kbd> anytime to show shortcuts
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to use keyboard shortcuts
export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key.toLowerCase();
      
      if (handlers[key]) {
        e.preventDefault();
        handlers[key]();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handlers]);
}
