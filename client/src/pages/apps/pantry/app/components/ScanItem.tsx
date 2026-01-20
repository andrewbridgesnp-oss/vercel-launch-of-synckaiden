import { useState } from 'react';
import { Scan, Plus } from 'lucide-react';

interface ScanItemProps {
  onAddItem: (name: string, category: string, expiryDays: number) => void;
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

const COMMON_ITEMS = [
  { name: 'Milk', category: 'Dairy', expiryDays: 7 },
  { name: 'Eggs', category: 'Dairy', expiryDays: 21 },
  { name: 'Bread', category: 'Bakery', expiryDays: 5 },
  { name: 'Chicken Breast', category: 'Meat', expiryDays: 3 },
  { name: 'Tomatoes', category: 'Produce', expiryDays: 5 },
  { name: 'Lettuce', category: 'Produce', expiryDays: 7 },
  { name: 'Yogurt', category: 'Dairy', expiryDays: 14 },
  { name: 'Cheese', category: 'Dairy', expiryDays: 30 },
];

export function ScanItem({ onAddItem }: ScanItemProps) {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [expiryDays, setExpiryDays] = useState(7);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim()) {
      onAddItem(itemName.trim(), category, expiryDays);
      setItemName('');
      setExpiryDays(7);
      setShowForm(false);
    }
  };

  const handleQuickAdd = (item: typeof COMMON_ITEMS[0]) => {
    onAddItem(item.name, item.category, item.expiryDays);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg">
          <Scan className="w-6 h-6 text-slate-100" />
        </div>
        <h2 className="text-xl font-semibold text-slate-100">Scan Item</h2>
      </div>

      {!showForm ? (
        <div>
          <p className="text-slate-400 mb-4">Quick add common items or scan a custom item</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {COMMON_ITEMS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAdd(item)}
                className="p-3 text-left border border-slate-600/50 bg-slate-700/30 rounded-lg hover:border-blue-500 hover:bg-blue-900/30 transition-colors backdrop-blur-sm"
              >
                <div className="font-medium text-sm text-slate-200">{item.name}</div>
                <div className="text-xs text-slate-400">{item.category}</div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Custom Item
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="itemName" className="block text-sm font-medium text-slate-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="itemName"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g., Organic Milk"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">
              Category
            </label>
            <select
              id="category"
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
            <label htmlFor="expiryDays" className="block text-sm font-medium text-slate-300 mb-1">
              Expires in (days)
            </label>
            <input
              type="number"
              id="expiryDays"
              value={expiryDays}
              onChange={(e) => setExpiryDays(parseInt(e.target.value) || 0)}
              min="1"
              max="365"
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg font-medium"
            >
              Add Item
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-3 border border-slate-600 bg-slate-700/30 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}