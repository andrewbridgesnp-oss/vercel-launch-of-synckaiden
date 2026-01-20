import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { PantryItem } from './PantryItem';

interface EditItemModalProps {
  item: PantryItem;
  onSave: (id: string, name: string, category: string, expiryDays: number) => void;
  onClose: () => void;
}

const CATEGORIES = [
  'Dairy',
  'Produce',
  'Meat',
  'Bakery',
  'Canned Goods',
  'Frozen',
  'Beverages',
  'Snacks',
  'Other'
];

export function EditItemModal({ item, onSave, onClose }: EditItemModalProps) {
  const [name, setName] = useState(item.name);
  const [category, setCategory] = useState(item.category);
  const [expiryDays, setExpiryDays] = useState(item.expiryDays);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(item.id, name.trim(), category, expiryDays);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-modal-title"
    >
      <div 
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="edit-modal-title" className="text-xl font-semibold text-slate-100">Edit Item</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-expiry" className="block text-sm font-medium text-slate-300 mb-1">
              Expires in (days from original date)
            </label>
            <input
              type="number"
              id="edit-expiry"
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value) || 0)}
              min="1"
              max="365"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg font-medium"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 border border-slate-600 bg-slate-700/30 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
