import { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShoppingListItem {
  id: string;
  name: string;
  completed: boolean;
}

interface ShoppingListProps {
  suggestedItems: string[];
  onClose: () => void;
}

export function ShoppingList({ suggestedItems, onClose }: ShoppingListProps) {
  const [items, setItems] = useState<ShoppingListItem[]>(
    suggestedItems.map((name, idx) => ({
      id: `suggested-${idx}`,
      name,
      completed: false
    }))
  );
  const [newItemName, setNewItemName] = useState('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      setItems([...items, {
        id: Date.now().toString(),
        name: newItemName.trim(),
        completed: false
      }]);
      setNewItemName('');
    }
  };

  const handleToggleComplete = (id: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleClearCompleted = () => {
    setItems(items.filter(item => !item.completed));
  };

  const completedCount = items.filter(item => item.completed).length;

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg shadow-lg">
            <ShoppingCart className="w-6 h-6 text-emerald-100" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Shopping List</h2>
            <p className="text-sm text-slate-400">
              {completedCount} of {items.length} items checked
            </p>
          </div>
        </div>
        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Add new item form */}
      <form onSubmit={handleAddItem} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add an item..."
            className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-colors shadow-lg"
            aria-label="Add item"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Shopping list items */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                item.completed
                  ? 'bg-emerald-900/20 border-emerald-700/30'
                  : 'bg-slate-700/30 border-slate-600/50 hover:border-emerald-500/50'
              }`}
            >
              <button
                onClick={() => handleToggleComplete(item.id)}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  item.completed
                    ? 'bg-emerald-600 border-emerald-600'
                    : 'border-slate-500 hover:border-emerald-500'
                }`}
                aria-label={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {item.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-1 ${item.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {item.name}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                aria-label="Delete item"
              >
                <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          Your shopping list is empty
        </div>
      )}
    </div>
  );
}
