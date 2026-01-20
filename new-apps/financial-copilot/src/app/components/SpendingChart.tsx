import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingChartProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string[];
      hoverOffset: number;
    }>;
  };
}

const SpendingChart = ({ data }: SpendingChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { 
        position: 'bottom' as const,
        labels: {
          color: '#cbd5e1',
          font: {
            size: 11,
            family: "'Inter', sans-serif",
            weight: '600' as const
          },
          padding: 16,
          usePointStyle: true,
          pointStyle: 'rectRounded' as const
        }
      },
      title: { 
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(15,23,42,0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(148,163,184,0.3)',
        borderWidth: 1,
        padding: 14,
        displayColors: true,
        boxPadding: 6,
        titleFont: {
          size: 13,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Navy and silver metallic color palette
  const enhancedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: [
        'rgba(148, 163, 184, 0.9)',   // Silver
        'rgba(59, 130, 246, 0.8)',     // Navy Blue
        'rgba(100, 149, 237, 0.8)',    // Cornflower Blue
        'rgba(192, 192, 192, 0.8)',    // Light Silver
        'rgba(30, 58, 138, 0.8)',      // Deep Navy
        'rgba(169, 169, 169, 0.8)',    // Dark Silver
        'rgba(75, 85, 99, 0.8)',       // Slate Gray
      ],
      borderColor: [
        'rgba(203, 213, 225, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(100, 149, 237, 1)',
        'rgba(229, 231, 235, 1)',
        'rgba(30, 58, 138, 1)',
        'rgba(209, 213, 219, 1)',
        'rgba(100, 116, 139, 1)',
      ],
      borderWidth: 3,
      hoverOffset: 10,
      hoverBorderWidth: 4,
      hoverBorderColor: '#e2e8f0'
    }))
  };

  return (
    <div className="w-full h-[320px] flex items-center justify-center p-4 relative">
      <Pie data={enhancedData} options={options} />
    </div>
  );
};

export default SpendingChart;