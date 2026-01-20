import { useState, useEffect } from 'react';
import { Package2, TrendingDown, Camera, ShoppingCart, BarChart3, Search, SlidersHorizontal, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PantryItemCard, PantryItem } from './components/PantryItem';
import { ScanItem } from './components/ScanItem';
import { RecipeSuggestions } from './components/RecipeSuggestions';
import { EditItemModal } from './components/EditItemModal';
import { ScannerSimulation } from './components/ScannerSimulation';
import { ShoppingList } from './components/ShoppingList';
import { StatsDashboard } from './components/StatsDashboard';
import { useLocalStorage } from './hooks/useLocalStorage';

const INITIAL_PANTRY: PantryItem[] = [
  {
    id: '1',
    name: 'Milk',
    category: 'Dairy',
    addedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    expiryDays: 7
  },
  {
    id: '2',
    name: 'Eggs',
    category: 'Dairy',
    addedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    expiryDays: 21
  },
  {
    id: '3',
    name: 'Bread',
    category: 'Bakery',
    addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    expiryDays: 5
  },
  {
    id: '4',
    name: 'Chicken Breast',
    category: 'Meat',
    addedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    expiryDays: 3
  }
];

type SortOption = 'date' | 'name' | 'expiry';
type ViewMode = 'inventory' | 'stats' | 'shopping';

export default function App() {
  const [pantryItems, setPantryItems] = useLocalStorage<PantryItem[]>('pantryiq-items', INITIAL_PANTRY);
  const [totalItemsAdded, setTotalItemsAdded] = useLocalStorage<number>('pantryiq-total-added', INITIAL_PANTRY.length);
  const [itemsExpired, setItemsExpired] = useLocalStorage<number>('pantryiq-expired', 0);
  const [filter, setFilter] = useState<'all' | 'expiring'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('expiry');
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('inventory');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Request notification permissions
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  // Check for expiring items and send notifications
  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkExpiringItems = () => {
      const expiringToday = pantryItems.filter(item => {
        const daysUntilExpiry = item.expiryDays - Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry === 1;
      });

      expiringToday.forEach(item => {
        new Notification('PantryIQ Alert', {
          body: `${item.name} expires tomorrow! Consider using it soon.`,
          icon: '/favicon.ico',
          tag: item.id
        });
      });
    };

    // Check once on mount and then every hour
    checkExpiringItems();
    const interval = setInterval(checkExpiringItems, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [pantryItems, notificationsEnabled]);

  const handleAddItem = (name: string, category: string, expiryDays: number) => {
    const newItem: PantryItem = {
      id: Date.now().toString(),
      name,
      category,
      addedDate: new Date(),
      expiryDays
    };
    setPantryItems([newItem, ...pantryItems]);
    setTotalItemsAdded(prev => prev + 1);
  };

  const handleDeleteItem = (id: string) => {
    const item = pantryItems.find(i => i.id === id);
    if (item) {
      const daysUntilExpiry = item.expiryDays - Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 0) {
        setItemsExpired(prev => prev + 1);
      }
    }
    setPantryItems(pantryItems.filter(item => item.id !== id));
  };

  const handleEditItem = (id: string, name: string, category: string, expiryDays: number) => {
    setPantryItems(pantryItems.map(item =>
      item.id === id ? { ...item, name, category, expiryDays } : item
    ));
  };

  const expiringItems = pantryItems.filter(item => {
    const daysUntilExpiry = item.expiryDays - Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 3;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(pantryItems.map(item => item.category)))];

  // Filter and sort items
  let displayedItems = filter === 'expiring' ? expiringItems : pantryItems;

  // Apply search filter
  if (searchQuery) {
    displayedItems = displayedItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply category filter
  if (categoryFilter !== 'all') {
    displayedItems = displayedItems.filter(item => item.category === categoryFilter);
  }

  // Apply sorting
  displayedItems = [...displayedItems].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
        return b.addedDate.getTime() - a.addedDate.getTime();
      case 'expiry':
        const daysA = a.expiryDays - Math.floor((Date.now() - a.addedDate.getTime()) / (1000 * 60 * 60 * 24));
        const daysB = b.expiryDays - Math.floor((Date.now() - b.addedDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysA - daysB;
      default:
        return 0;
    }
  });

  // Generate shopping list suggestions (expired items)
  const shoppingListSuggestions = pantryItems
    .filter(item => {
      const daysUntilExpiry = item.expiryDays - Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry < 0;
    })
    .map(item => item.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-slate-700 shadow-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg">
                <Package2 className="w-8 h-8 text-slate-100" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  PantryIQ
                </h1>
                <p className="text-slate-400 text-sm">Your intelligent household manager</p>
              </div>
            </div>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowScanner(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg"
                aria-label="Open barcode scanner"
              >
                <Camera className="w-4 h-4" />
                <span className="text-sm font-medium">Scan</span>
              </button>
              
              <button
                onClick={notificationsEnabled ? () => setNotificationsEnabled(false) : requestNotificationPermission}
                className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
                title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
              >
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-emerald-400" />
                ) : (
                  <BellOff className="w-5 h-5 text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            <button
              onClick={() => setViewMode('inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'inventory'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Package2 className="w-4 h-4" />
              Inventory
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'stats'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Statistics
            </button>
            <button
              onClick={() => setViewMode('shopping')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                viewMode === 'shopping'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              Shopping List
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'stats' ? (
          <StatsDashboard 
            items={pantryItems} 
            totalItemsAdded={totalItemsAdded}
            itemsExpired={itemsExpired}
          />
        ) : viewMode === 'shopping' ? (
          <div className="max-w-2xl mx-auto">
            <ShoppingList 
              suggestedItems={shoppingListSuggestions}
              onClose={() => setViewMode('inventory')}
            />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Total Items</p>
                    <p className="text-3xl font-bold text-slate-100 mt-1">{pantryItems.length}</p>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <Package2 className="w-6 h-6 text-slate-300" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Expiring Soon</p>
                    <p className="text-3xl font-bold text-amber-400 mt-1">{expiringItems.length}</p>
                  </div>
                  <div className="p-3 bg-amber-900/30 rounded-lg">
                    <TrendingDown className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Waste Reduction</p>
                    <p className="text-3xl font-bold text-emerald-400 mt-1">
                      {totalItemsAdded > 0 ? Math.round(((totalItemsAdded - itemsExpired) / totalItemsAdded) * 100) : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-900/30 rounded-lg">
                    <span className="text-2xl">♻️</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Scan Item & Scanner Button */}
              <div className="lg:col-span-1 space-y-6">
                <button
                  onClick={() => setShowScanner(true)}
                  className="sm:hidden w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <Camera className="w-5 h-5" />
                  Open Barcode Scanner
                </button>
                
                <ScanItem onAddItem={handleAddItem} />
                <RecipeSuggestions expiringItems={expiringItems} />
              </div>

              {/* Right Column - Pantry Inventory */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-semibold text-slate-100">Pantry Inventory</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filter === 'all'
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        All ({pantryItems.length})
                      </button>
                      <button
                        onClick={() => setFilter('expiring')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          filter === 'expiring'
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        Expiring ({expiringItems.length})
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="space-y-3 mb-6">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search items..."
                          className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Search pantry items"
                        />
                      </div>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                          showFilters
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                        }`}
                        aria-label="Toggle filters"
                      >
                        <SlidersHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <AnimatePresence>
                      {showFilters && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden"
                        >
                          <div>
                            <label htmlFor="category-filter" className="block text-sm text-slate-400 mb-1">
                              Category
                            </label>
                            <select
                              id="category-filter"
                              value={categoryFilter}
                              onChange={(e) => setCategoryFilter(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat === 'all' ? 'All Categories' : cat}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label htmlFor="sort-by" className="block text-sm text-slate-400 mb-1">
                              Sort By
                            </label>
                            <select
                              id="sort-by"
                              value={sortBy}
                              onChange={(e) => setSortBy(e.target.value as SortOption)}
                              className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            >
                              <option value="expiry">Expiry Date</option>
                              <option value="name">Name</option>
                              <option value="date">Date Added</option>
                            </select>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {displayedItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Package2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">
                        {filter === 'expiring' 
                          ? 'No items expiring soon' 
                          : searchQuery 
                          ? 'No items match your search' 
                          : 'Your pantry is empty. Start scanning items!'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      <AnimatePresence mode="popLayout">
                        {displayedItems.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                          >
                            <PantryItemCard 
                              item={item} 
                              onDelete={handleDeleteItem}
                              onEdit={setEditingItem}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {editingItem && (
          <EditItemModal
            item={editingItem}
            onSave={handleEditItem}
            onClose={() => setEditingItem(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScanner && (
          <ScannerSimulation
            onScanComplete={handleAddItem}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
