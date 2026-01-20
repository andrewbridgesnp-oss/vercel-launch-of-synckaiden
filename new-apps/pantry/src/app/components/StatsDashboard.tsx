import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Package, AlertTriangle, Award } from 'lucide-react';
import { PantryItem } from './PantryItem';

interface StatsDashboardProps {
  items: PantryItem[];
  totalItemsAdded: number;
  itemsExpired: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export function StatsDashboard({ items, totalItemsAdded, itemsExpired }: StatsDashboardProps) {
  // Category distribution
  const categoryData = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value
  }));

  // Expiry timeline
  const expiryData = items.map(item => {
    const daysUntilExpiry = item.expiryDays - Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));
    return {
      name: item.name,
      days: Math.max(0, daysUntilExpiry)
    };
  }).sort((a, b) => a.days - b.days).slice(0, 10);

  const wasteReduction = totalItemsAdded > 0 ? Math.round(((totalItemsAdded - itemsExpired) / totalItemsAdded) * 100) : 0;
  const activePantryValue = items.length * 4.5; // Estimated average value per item

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-900/50 rounded-lg">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-sm text-slate-400">Total Added</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{totalItemsAdded}</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-900/50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <span className="text-sm text-slate-400">Expired</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">{itemsExpired}</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-900/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400">Waste Reduction</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{wasteReduction}%</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-900/50 rounded-lg">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm text-slate-400">Pantry Value</span>
          </div>
          <p className="text-2xl font-bold text-slate-100">${activePantryValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Category Distribution</h3>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Expiry Timeline */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Expiry Timeline (Days Remaining)</h3>
          {expiryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={expiryData}>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }} 
                />
                <Bar dataKey="days" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400">
              No items in pantry
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Insights & Achievements</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wasteReduction >= 80 && (
            <div className="flex items-start gap-3 p-3 bg-emerald-900/20 border border-emerald-700/30 rounded-lg">
              <Award className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-400">Waste Warrior!</p>
                <p className="text-xs text-slate-400 mt-1">You've maintained over 80% waste reduction</p>
              </div>
            </div>
          )}
          {items.length >= 10 && (
            <div className="flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <Package className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-400">Well Stocked!</p>
                <p className="text-xs text-slate-400 mt-1">Your pantry has {items.length} active items</p>
              </div>
            </div>
          )}
          {categoryChartData.length >= 5 && (
            <div className="flex items-start gap-3 p-3 bg-purple-900/20 border border-purple-700/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-purple-400">Diverse Diet!</p>
                <p className="text-xs text-slate-400 mt-1">You're tracking {categoryChartData.length} different categories</p>
              </div>
            </div>
          )}
          {totalItemsAdded >= 20 && (
            <div className="flex items-start gap-3 p-3 bg-amber-900/20 border border-amber-700/30 rounded-lg">
              <Award className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">Power User!</p>
                <p className="text-xs text-slate-400 mt-1">You've added {totalItemsAdded} items total</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
