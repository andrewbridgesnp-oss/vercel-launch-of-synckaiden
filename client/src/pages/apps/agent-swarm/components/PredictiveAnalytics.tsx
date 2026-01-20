import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';

export function PredictiveAnalytics() {
  const revenueData = [
    { month: 'Jan', actual: 45000, predicted: 44500, optimized: 48000 },
    { month: 'Feb', actual: 52000, predicted: 51800, optimized: 55000 },
    { month: 'Mar', actual: 48000, predicted: 49200, optimized: 52000 },
    { month: 'Apr', actual: 61000, predicted: 59500, optimized: 64000 },
    { month: 'May', actual: 55000, predicted: 56800, optimized: 60000 },
    { month: 'Jun', actual: 67000, predicted: 66200, optimized: 71000 },
    { month: 'Jul', predicted: 72000, optimized: 78000 },
    { month: 'Aug', predicted: 75000, optimized: 82000 },
    { month: 'Sep', predicted: 80000, optimized: 88000 },
  ];

  const operationsData = [
    { category: 'Marketing', efficiency: 87, potential: 95 },
    { category: 'Sales', efficiency: 92, potential: 98 },
    { category: 'Operations', efficiency: 78, potential: 90 },
    { category: 'Customer Service', efficiency: 84, potential: 93 },
    { category: 'Product', efficiency: 90, potential: 96 },
    { category: 'Finance', efficiency: 95, potential: 98 },
  ];

  const riskData = [
    { week: 'W1', risk: 15, threshold: 30 },
    { week: 'W2', risk: 22, threshold: 30 },
    { week: 'W3', risk: 18, threshold: 30 },
    { week: 'W4', risk: 12, threshold: 30 },
    { week: 'W5', risk: 25, threshold: 30 },
    { week: 'W6', risk: 20, threshold: 30 },
  ];

  const predictions = [
    {
      id: 1,
      title: 'Revenue Growth Opportunity',
      description: 'Q2 revenue projected to exceed targets by 12% with optimized agent deployment',
      confidence: 94,
      impact: 'high',
      type: 'opportunity'
    },
    {
      id: 2,
      title: 'Supply Chain Optimization',
      description: 'Identified 15% cost reduction opportunity in logistics through route optimization',
      confidence: 89,
      impact: 'high',
      type: 'opportunity'
    },
    {
      id: 3,
      title: 'Customer Churn Risk',
      description: 'Detected early warning signals for 8 enterprise accounts requiring intervention',
      confidence: 91,
      impact: 'medium',
      type: 'risk'
    },
    {
      id: 4,
      title: 'Market Expansion Window',
      description: 'Optimal timing identified for APAC market entry in Q3 2026',
      confidence: 87,
      impact: 'high',
      type: 'opportunity'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white">Predictive Analytics</h2>
        <p className="text-blue-300">AI-powered insights and forecasting for strategic decision-making</p>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5"
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                prediction.type === 'opportunity'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {prediction.type === 'opportunity' ? (
                  <Target className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white">{prediction.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    prediction.impact === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {prediction.impact} impact
                  </span>
                </div>
                <p className="text-blue-300 text-sm mb-3">{prediction.description}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-950/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <span className="text-blue-400 text-sm">{prediction.confidence}% confidence</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Forecasting */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white mb-1">Revenue Forecasting</h3>
            <p className="text-blue-300 text-sm">Agent-optimized revenue predictions vs actual performance</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">+18% projected growth</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.1} />
            <XAxis dataKey="month" stroke="#60a5fa" />
            <YAxis stroke="#60a5fa" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1e40af',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              fillOpacity={1}
              fill="url(#colorActual)"
              name="Actual Revenue"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              stroke="#8b5cf6"
              fillOpacity={1}
              fill="url(#colorPredicted)"
              strokeDasharray="5 5"
              name="AI Predicted"
            />
            <Area
              type="monotone"
              dataKey="optimized"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorOptimized)"
              strokeDasharray="3 3"
              name="Agent Optimized"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Operations Efficiency & Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Operations Efficiency */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
          <h3 className="text-white mb-4">Operational Efficiency Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={operationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.1} />
              <XAxis dataKey="category" stroke="#60a5fa" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#60a5fa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e40af',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="efficiency" fill="#3b82f6" name="Current Efficiency" radius={[4, 4, 0, 0]} />
              <Bar dataKey="potential" fill="#10b981" name="AI-Predicted Potential" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Analysis */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white">Risk Monitoring</h3>
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm">Low Risk</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e40af" opacity={0.1} />
              <XAxis dataKey="week" stroke="#60a5fa" />
              <YAxis stroke="#60a5fa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e40af',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="risk"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: '#f59e0b', r: 4 }}
                name="Risk Level"
              />
              <Line
                type="monotone"
                dataKey="threshold"
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Risk Threshold"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prediction Accuracy Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Prediction Accuracy', value: '94.2%', change: '+2.1%', positive: true },
          { label: 'Forecasting Confidence', value: '91.8%', change: '+3.4%', positive: true },
          { label: 'Model Performance', value: '96.5%', change: '+1.8%', positive: true },
          { label: 'Data Coverage', value: '99.1%', change: '+0.5%', positive: true },
        ].map((metric, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-blue-800/30 p-5">
            <div className="text-blue-300 text-sm mb-2">{metric.label}</div>
            <div className="text-white text-2xl mb-1">{metric.value}</div>
            <div className={`text-sm ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
              {metric.change} vs last month
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
