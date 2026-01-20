import { Calendar, AlertCircle, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  addedDate: Date;
  expiryDays: number;
}

interface PantryItemProps {
  item: PantryItem;
  onDelete: (id: string) => void;
  onEdit: (item: PantryItem) => void;
}

export function PantryItemCard({ item, onDelete, onEdit }: PantryItemProps) {
  const daysUntilExpiry = item.expiryDays - Math.floor((Date.now() - item.addedDate.getTime()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysUntilExpiry <= 3;
  const isExpired = daysUntilExpiry < 0;

  return (
    <div className={`border rounded-lg p-4 transition-all backdrop-blur-sm ${
      isExpired 
        ? 'bg-gradient-to-r from-red-950/40 to-red-900/40 border-red-800/50' 
        : isExpiringSoon 
        ? 'bg-gradient-to-r from-amber-950/40 to-amber-900/40 border-amber-800/50' 
        : 'bg-gradient-to-r from-slate-700/30 to-slate-800/30 border-slate-600/50'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100">{item.name}</h3>
            {isExpiringSoon && (
              <AlertCircle className={`w-4 h-4 ${isExpired ? 'text-red-400' : 'text-amber-400'}`} />
            )}
          </div>
          <p className="text-sm text-slate-400 mt-1">{item.category}</p>
          <div className="flex items-center gap-1 mt-2 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>Added {formatDistanceToNow(item.addedDate, { addSuffix: true })}</span>
          </div>
          <div className="mt-2">
            {isExpired ? (
              <span className="text-sm font-medium text-red-400">Expired {Math.abs(daysUntilExpiry)} days ago</span>
            ) : (
              <span className={`text-sm font-medium ${isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
                {daysUntilExpiry} days remaining
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Edit item"
          >
            <Edit className="w-5 h-5 text-slate-400 hover:text-blue-400" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            aria-label="Delete item"
          >
            <Trash2 className="w-5 h-5 text-slate-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}