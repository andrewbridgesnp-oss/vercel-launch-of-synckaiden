import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import SpendingTrendChart from './SpendingTrendChart';
import api from '../services/api';
import { toast } from 'sonner';

interface ReportData {
  totalIncome: number;
  totalExpenses: number;
  netWorth: number;
  topCategories: Array<{ category: string; amount: number }>;
  transactions: any[];
}

const ReportsPage = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    fetchReportData();
  }, [period]);

  const fetchReportData = async () => {
    try {
      const response = await api.get(`/reports?period=${period}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch report data', error);
      setReportData({
        totalIncome: 0,
        totalExpenses: 0,
        netWorth: 0,
        topCategories: [],
        transactions: []
      });
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    toast.success('PDF export feature coming soon!');
    // In production, integrate with jsPDF or similar
  };

  const exportCSV = () => {
    if (!reportData) return;

    const headers = ['Metric', 'Value'];
    const rows = [
      ['Total Income', `$${reportData.totalIncome.toFixed(2)}`],
      ['Total Expenses', `$${reportData.totalExpenses.toFixed(2)}`],
      ['Net Worth', `$${reportData.netWorth.toFixed(2)}`],
      ['', ''],
      ['Top Categories', ''],
      ...reportData.topCategories.map(cat => [cat.category, `$${cat.amount.toFixed(2)}`])
    ];

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Report exported to CSV!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">Generating reports...</div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Reports & Analytics</h1>
          <p className="text-slate-400">Comprehensive financial insights and exports</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px] bg-slate-800/50 border-slate-700 text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-700/50" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
        }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-400">PERIOD INCOME</CardTitle>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">${reportData.totalIncome.toFixed(2)}</div>
            <p className="text-xs text-emerald-400 mt-1">Total earnings</p>
          </CardContent>
        </Card>

        <Card className="border-slate-700/50" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
        }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-400">PERIOD EXPENSES</CardTitle>
            <TrendingDown className="w-5 h-5 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">${reportData.totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-rose-400 mt-1">Total spending</p>
          </CardContent>
        </Card>

        <Card className="border-slate-700/50" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
        }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-400">NET POSITION</CardTitle>
            <DollarSign className="w-5 h-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${reportData.netWorth >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
              ${reportData.netWorth.toFixed(2)}
            </div>
            <p className="text-xs text-blue-400 mt-1">Period net worth</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="text-slate-200">Income vs Expenses Trend</CardTitle>
          <CardDescription className="text-slate-500">Visual analysis of financial flow</CardDescription>
        </CardHeader>
        <CardContent>
          <SpendingTrendChart transactions={reportData.transactions} />
        </CardContent>
      </Card>

      {/* Top Categories */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="text-slate-200">Top Spending Categories</CardTitle>
          <CardDescription className="text-slate-500">Where your money goes</CardDescription>
        </CardHeader>
        <CardContent>
          {reportData.topCategories.length === 0 ? (
            <div className="text-center py-8 text-slate-500">No spending data available</div>
          ) : (
            <div className="space-y-4">
              {reportData.topCategories.map((cat, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">{cat.category}</span>
                  <span className="text-rose-400 font-bold">${cat.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="border-slate-700/50" style={{
        background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
        boxShadow: '12px 12px 24px rgba(0,0,0,0.4)'
      }}>
        <CardHeader>
          <CardTitle className="text-slate-200">Export Reports</CardTitle>
          <CardDescription className="text-slate-500">Download your financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={exportCSV} className="gap-2 flex-1" style={{
              background: 'linear-gradient(145deg, #3b82f6, #2563eb)'
            }}>
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Button onClick={exportPDF} variant="outline" className="gap-2 flex-1 border-slate-700">
              <FileText className="w-4 h-4" />
              Export PDF (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
