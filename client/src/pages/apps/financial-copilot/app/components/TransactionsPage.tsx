import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Search, Filter, Download, Edit2, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import api from '../services/api';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  createdAt?: string;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Income',
  'Other'
];

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, categoryFilter, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    setFilteredTransactions(filtered);
  };

  const handleOpenDialog = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction);
      setFormData({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        date: transaction.date || new Date().toISOString().split('T')[0]
      });
    } else {
      setEditingTransaction(null);
      setFormData({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date
    };

    try {
      if (editingTransaction) {
        await api.put(`/transactions/${editingTransaction.id}`, transactionData);
        toast.success('Transaction updated successfully!');
      } else {
        await api.post('/transactions', transactionData);
        toast.success('Transaction created successfully!');
      }
      
      setIsDialogOpen(false);
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to save transaction');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted successfully!');
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = filteredTransactions.map(t => [
      t.date || t.createdAt || '',
      t.description,
      t.category,
      t.amount.toString()
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Exported to CSV!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Transactions</h1>
          <p className="text-slate-400">Manage your financial transactions</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2"
          style={{
            background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
            boxShadow: '0 4px 12px rgba(59,130,246,0.4)'
          }}
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800/50 border-slate-700"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="gap-2 border-slate-700"
              disabled={filteredTransactions.length === 0}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="text-slate-200">All Transactions</CardTitle>
          <CardDescription className="text-slate-500">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 mb-4">No transactions found</p>
              <Button onClick={() => handleOpenDialog()} className="gap-2" style={{
                background: 'linear-gradient(145deg, #3b82f6, #2563eb)'
              }}>
                <Plus className="w-4 h-4" />
                Add Your First Transaction
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction, idx) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all group"
                  style={{
                    background: 'linear-gradient(145deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))'
                  }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-200 mb-1">{transaction.description}</h3>
                    <div className="flex gap-3 text-xs text-slate-500">
                      <span className="uppercase tracking-wider">{transaction.category}</span>
                      <span>•</span>
                      <span>{transaction.date || new Date(transaction.createdAt!).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-bold ${transaction.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {transaction.amount >= 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(transaction)}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {editingTransaction ? 'Update transaction details' : 'Create a new transaction'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="description" className="text-slate-300">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-slate-300">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                  placeholder="Use negative for expenses"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category" className="text-slate-300">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date" className="text-slate-300">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700">
                Cancel
              </Button>
              <Button type="submit" style={{
                background: 'linear-gradient(145deg, #3b82f6, #2563eb)'
              }}>
                {editingTransaction ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransactionsPage;
