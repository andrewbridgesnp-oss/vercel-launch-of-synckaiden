import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import SpendingChart from './SpendingChart';
import SpendingTrendChart from './SpendingTrendChart';
import FinancialHealthScore from './FinancialHealthScore';
import AnimatedCounter from './AnimatedCounter';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  Shield, 
  LogOut, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  BarChart3,
  Zap,
  Target,
  Calendar
} from 'lucide-react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Subscription {
  description: string;
  amount: number;
  count: number;
}

interface BudgetStatus {
  id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverOffset: number;
  }>;
}

interface DashboardData {
  summary: {
    totalIncome: number;
    totalExpenses: number;
    netWorth: number;
  };
  chartData: ChartData;
  subscriptions: Subscription[];
  budgetStatus: BudgetStatus[];
  recentTransactions: Transaction[];
}

const DashboardPage = () => {
  const { logout } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Failed to load dashboard data. Make sure your backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628]">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full relative" style={{
              background: 'linear-gradient(145deg, #1e293b, #0f172a)',
              boxShadow: '20px 20px 40px #070d16, -20px -20px 40px #192332'
            }}>
              <div className="absolute inset-2 rounded-full border-4 border-slate-700 border-t-slate-400 animate-spin"></div>
              <Activity className="w-8 h-8 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <p className="text-slate-300 text-lg font-semibold tracking-wide">Initializing Dashboard...</p>
          <p className="text-slate-500 text-sm mt-2">Preparing your financial insights</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628] p-4">
        <Card className="max-w-md w-full border-slate-700/50" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.95))',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          <CardHeader>
            <CardTitle className="text-red-400">Connection Error</CardTitle>
            <CardDescription className="text-slate-400">
              {error || 'Unable to load dashboard data'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-500">
              Please make sure your backend server is running on http://localhost:3001
            </p>
            <Button onClick={() => window.location.reload()} className="w-full" style={{
              background: 'linear-gradient(145deg, #e2e8f0, #cbd5e1)',
              color: '#0f172a',
              boxShadow: '0 4px 12px rgba(100,149,237,0.3)'
            }}>
              Retry Connection
            </Button>
            <Button onClick={logout} variant="outline" className="w-full border-slate-700 text-slate-400 hover:bg-slate-800/50">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary, chartData, subscriptions, recentTransactions } = data;

  return (
    <div className="space-y-8">
      {/* Summary Cards with 3D depth */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Dashboard</h1>
        <p className="text-slate-400 mb-6">Your financial overview at a glance</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Income Card */}
          <Card className="relative overflow-hidden border-slate-700/50 group" style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
            boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
          }}>
            {/* Metallic accent border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"></div>
            
            {/* Depth overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-slate-400 tracking-wider">TOTAL INCOME</CardTitle>
              <div className="p-2.5 rounded-lg relative" style={{
                background: 'linear-gradient(145deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15))',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), 2px 2px 6px rgba(16,185,129,0.2)'
              }}>
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100 tracking-tight mb-1" style={{
                textShadow: '0 2px 10px rgba(16,185,129,0.3)'
              }}>
                ${summary.totalIncome.toFixed(2)}
              </div>
              <p className="text-xs text-emerald-400/80 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Revenue Stream
              </p>
            </CardContent>
          </Card>

          {/* Expenses Card */}
          <Card className="relative overflow-hidden border-slate-700/50 group" style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
            boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
          }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-slate-400 tracking-wider">TOTAL EXPENSES</CardTitle>
              <div className="p-2.5 rounded-lg relative" style={{
                background: 'linear-gradient(145deg, rgba(244,63,94,0.15), rgba(225,29,72,0.15))',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), 2px 2px 6px rgba(244,63,94,0.2)'
              }}>
                <TrendingDown className="h-5 w-5 text-rose-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-100 tracking-tight mb-1" style={{
                textShadow: '0 2px 10px rgba(244,63,94,0.3)'
              }}>
                ${summary.totalExpenses.toFixed(2)}
              </div>
              <p className="text-xs text-rose-400/80 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                Monthly Outflow
              </p>
            </CardContent>
          </Card>

          {/* Net Worth Card */}
          <Card className="relative overflow-hidden border-slate-700/50 group" style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
            boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
          }}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-bold text-slate-400 tracking-wider">NET WORTH</CardTitle>
              <div className="p-2.5 rounded-lg relative" style={{
                background: 'linear-gradient(145deg, rgba(59,130,246,0.15), rgba(37,99,235,0.15))',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3), 2px 2px 6px rgba(59,130,246,0.2)'
              }}>
                <Wallet className="h-5 w-5 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold tracking-tight mb-1 ${summary.netWorth >= 0 ? 'text-slate-100' : 'text-rose-400'}`} style={{
                textShadow: `0 2px 10px ${summary.netWorth >= 0 ? 'rgba(59,130,246,0.3)' : 'rgba(244,63,94,0.3)'}`
              }}>
                ${summary.netWorth.toFixed(2)}
              </div>
              <p className="text-xs text-blue-400/80 font-medium flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                Total Balance
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts and Details Grid */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Financial Insights</h1>
        <p className="text-slate-400 mb-6">Detailed analysis of your financial health</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spending Chart */}
          <Card className="border-slate-700/50 relative overflow-hidden" style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
            boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
          }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
            
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-200 font-bold tracking-wide">
                <div className="p-2 rounded-lg" style={{
                  background: 'linear-gradient(145deg, rgba(59,130,246,0.15), rgba(37,99,235,0.15))',
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  <PieChart className="h-5 w-5 text-blue-400" />
                </div>
                Spending Analysis
              </CardTitle>
              <CardDescription className="text-slate-500">Category breakdown visualization</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.labels.length > 0 ? (
                <SpendingChart data={chartData} />
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500">No spending data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Health Score */}
          <Card className="border-slate-700/50 relative overflow-hidden" style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
            boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
          }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
            
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-200 font-bold tracking-wide">
                <div className="p-2 rounded-lg" style={{
                  background: 'linear-gradient(145deg, rgba(251,146,60,0.15), rgba(249,115,22,0.15))',
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  <Target className="h-5 w-5 text-orange-400" />
                </div>
                Financial Health
              </CardTitle>
              <CardDescription className="text-slate-500">Real-time wellness indicator</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
              <FinancialHealthScore 
                income={summary.totalIncome}
                expenses={summary.totalExpenses}
                netWorth={summary.netWorth}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trend Chart */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Spending Trends</h1>
        <p className="text-slate-400 mb-6">Income vs expenses over time</p>
        
        <Card className="border-slate-700/50 relative overflow-hidden mb-8" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
        }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
          
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-200 font-bold tracking-wide">
              <div className="p-2 rounded-lg" style={{
                background: 'linear-gradient(145deg, rgba(139,92,246,0.15), rgba(124,58,237,0.15))',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                <BarChart3 className="h-5 w-5 text-violet-400" />
              </div>
              Spending Trends
            </CardTitle>
            <CardDescription className="text-slate-500">Income vs expenses over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SpendingTrendChart transactions={recentTransactions} />
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Recurring Payments</h1>
        <p className="text-slate-400 mb-6">Auto-detected subscriptions</p>
        
        <Card className="border-slate-700/50 relative overflow-hidden mb-8" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
        }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
          
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-slate-200 font-bold tracking-wide">
              <div className="p-2 rounded-lg" style={{
                background: 'linear-gradient(145deg, rgba(168,85,247,0.15), rgba(147,51,234,0.15))',
                boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.3)'
              }}>
                <CreditCard className="h-5 w-5 text-purple-400" />
              </div>
              Recurring Payments
            </CardTitle>
            <CardDescription className="text-slate-500">Auto-detected subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No recurring payments detected</p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subscriptions.map((sub, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="flex justify-between items-center p-4 rounded-lg border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 group"
                    style={{
                      background: 'linear-gradient(145deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))',
                      boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2), 2px 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{
                        background: 'linear-gradient(145deg, rgba(168,85,247,0.1), rgba(147,51,234,0.1))',
                        boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)'
                      }}>
                        <Calendar className="h-4 w-4 text-purple-400" />
                      </div>
                      <span className="font-semibold text-slate-300 group-hover:text-slate-200 transition-colors">{sub.description}</span>
                    </div>
                    <span className="text-purple-400 font-bold tracking-wide">
                      ${(sub.amount / sub.count).toFixed(2)}/mo
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Transaction History</h1>
        <p className="text-slate-400 mb-6">Recent financial activity</p>
        
        <Card className="border-slate-700/50 relative overflow-hidden" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.9), rgba(30,41,59,0.9))',
          boxShadow: '12px 12px 24px rgba(0,0,0,0.4), -12px -12px 24px rgba(30,41,59,0.1)'
        }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
          
          <CardHeader>
            <CardTitle className="text-slate-200 font-bold tracking-wide">Transaction History</CardTitle>
            <CardDescription className="text-slate-500">Recent financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">No transactions recorded</p>
              </div>
            ) : (
              <ul className="space-y-0">
                {recentTransactions.map((t, idx) => (
                  <li
                    key={t.id}
                    className="flex justify-between items-center py-4 px-4 -mx-4 hover:bg-slate-800/30 transition-all duration-200 group"
                    style={{
                      borderBottom: idx < recentTransactions.length - 1 ? '1px solid rgba(71,85,105,0.2)' : 'none'
                    }}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-slate-300 group-hover:text-slate-200 transition-colors">{t.description}</p>
                      <p className="text-xs text-slate-600 group-hover:text-slate-500 transition-colors uppercase tracking-wider mt-0.5">{t.category}</p>
                    </div>
                    <span
                      className={`text-lg font-bold tracking-tight ${
                        t.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                      style={{
                        textShadow: `0 0 10px ${t.amount > 0 ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'}`
                      }}
                    >
                      {t.amount > 0 ? '+' : ''}${t.amount.toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          
          {/* Bottom border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent"></div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;