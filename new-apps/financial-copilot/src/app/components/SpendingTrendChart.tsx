import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SpendingTrendChartProps {
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    category: string;
    createdAt?: string;
  }>;
}

const SpendingTrendChart: React.FC<SpendingTrendChartProps> = ({ transactions }) => {
  // Generate trend data from transactions
  const generateTrendData = () => {
    if (transactions.length === 0) return [];

    // Group transactions by date
    const groupedByDate: { [key: string]: { income: number; expenses: number } } = {};

    transactions.forEach(t => {
      const date = t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today';
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = { income: 0, expenses: 0 };
      }

      if (t.amount > 0) {
        groupedByDate[date].income += t.amount;
      } else {
        groupedByDate[date].expenses += Math.abs(t.amount);
      }
    });

    // Convert to array format
    return Object.entries(groupedByDate).map(([date, values]) => ({
      date,
      income: Number(values.income.toFixed(2)),
      expenses: Number(values.expenses.toFixed(2)),
      net: Number((values.income - values.expenses).toFixed(2))
    })).slice(-7); // Last 7 entries
  };

  const data = generateTrendData();

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No trend data available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-lg border border-slate-700/50" style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}>
          <p className="text-slate-300 font-semibold mb-2">{payload[0].payload.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            style={{ fontSize: '11px', fontWeight: 600 }}
          />
          <YAxis 
            stroke="#64748b" 
            style={{ fontSize: '11px', fontWeight: 600 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              fontSize: '12px', 
              fontWeight: 600,
              paddingTop: '10px'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            strokeWidth={2}
            fill="url(#colorIncome)" 
            name="Income"
          />
          <Area 
            type="monotone" 
            dataKey="expenses" 
            stroke="#ef4444" 
            strokeWidth={2}
            fill="url(#colorExpenses)" 
            name="Expenses"
          />
          <Area 
            type="monotone" 
            dataKey="net" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fill="url(#colorNet)" 
            name="Net"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTrendChart;
