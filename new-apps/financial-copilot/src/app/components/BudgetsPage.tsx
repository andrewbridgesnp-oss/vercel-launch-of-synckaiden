import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Target, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import api from '../services/api';
import { toast } from 'sonner';

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: string;
}

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other'
];

const BudgetsPage = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Food & Dining',
    amount: '',
    period: 'monthly'
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/budgets', {
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period
      });
      
      toast.success('Budget created successfully!');
      setIsDialogOpen(false);
      setFormData({ category: 'Food & Dining', amount: '', period: 'monthly' });
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to create budget');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return;

    try {
      await api.delete(`/budgets/${id}`);
      toast.success('Budget deleted successfully!');
      fetchBudgets();
    } catch (error) {
      toast.error('Failed to delete budget');
    }
  };

  const getBudgetStatus = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage >= 100) return { color: 'text-red-400', icon: AlertCircle, label: 'Over Budget', bg: 'bg-red-400' };
    if (percentage >= 80) return { color: 'text-amber-400', icon: AlertCircle, label: 'Close to Limit', bg: 'bg-amber-400' };
    return { color: 'text-emerald-400', icon: CheckCircle, label: 'On Track', bg: 'bg-emerald-400' };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Loading budgets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Budgets</h1>
          <p className="text-slate-400">Track and manage your spending limits</p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
          style={{
            background: 'linear-gradient(145deg, #10b981, #059669)',
            boxShadow: '0 4px 12px rgba(16,185,129,0.4)'
          }}
        >
          <Plus className="w-4 h-4" />
          Create Budget
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="text-slate-200">Budget Overview</CardTitle>
          <CardDescription className="text-slate-500">Total monthly budget allocation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 mb-2">Total Budget</p>
              <p className="text-3xl font-bold text-slate-100">${totalBudget.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Total Spent</p>
              <p className="text-3xl font-bold text-rose-400">${totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-2">Remaining</p>
              <p className={`text-3xl font-bold ${totalBudget - totalSpent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${(totalBudget - totalSpent).toFixed(2)}
              </p>
            </div>
          </div>
          {totalBudget > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-slate-400 mb-2">
                <span>Overall Progress</span>
                <span>{((totalSpent / totalBudget) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={(totalSpent / totalBudget) * 100} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <Card className="border-slate-700/50" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
        }}>
          <CardContent className="text-center py-12">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No budgets created yet</p>
            <Button onClick={() => setIsDialogOpen(true)} className="gap-2" style={{
              background: 'linear-gradient(145deg, #10b981, #059669)'
            }}>
              <Plus className="w-4 h-4" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget, idx) => {
            const percentage = (budget.spent / budget.amount) * 100;
            const status = getBudgetStatus(budget.spent, budget.amount);
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-slate-700/50 hover:border-slate-600/50 transition-all group" style={{
                  background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
                  boxShadow: '8px 8px 16px rgba(0,0,0,0.4)'
                }}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg" style={{
                          background: 'linear-gradient(145deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15))',
                          boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
                        }}>
                          <Target className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <CardTitle className="text-base text-slate-200">{budget.category}</CardTitle>
                          <CardDescription className="text-xs capitalize">{budget.period}</CardDescription>
                        </div>
                      </div>
                      <StatusIcon className={`w-5 h-5 ${status.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <p className="text-sm text-slate-500">Spent</p>
                          <p className="text-2xl font-bold text-slate-100">${budget.spent.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Budget</p>
                          <p className="text-2xl font-bold text-slate-400">${budget.amount.toFixed(2)}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm text-slate-400 mb-2">
                          <span>{status.label}</span>
                          <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${status.bg} transition-all duration-500`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(budget.id)}
                        className="w-full text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Delete Budget
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-100">Create Budget</DialogTitle>
            <DialogDescription className="text-slate-400">
              Set spending limits for a category
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                <Label htmlFor="amount" className="text-slate-300">Budget Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-slate-100"
                  placeholder="1000.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="period" className="text-slate-300">Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
                  <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-700">
                Cancel
              </Button>
              <Button type="submit" style={{
                background: 'linear-gradient(145deg, #10b981, #059669)'
              }}>
                Create Budget
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetsPage;
