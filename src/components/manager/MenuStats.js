'use client';

import { DollarSign, Tag, BarChart3, TrendingUp, Percent } from 'lucide-react';

export default function MenuStats({ stats }) {
  const defaultStats = {
    total_items: 0,
    available_items: 0,
    popular_items: 0,
    average_price: 0,
    total_categories: 0,
    revenue_share: '0%'
  };

  const displayStats = { ...defaultStats, ...stats };

  const statCards = [
    {
      title: 'Total Items',
      value: displayStats.total_items,
      icon: Tag,
      color: 'purple',
      trend: null
    },
    {
      title: 'Available Now',
      value: displayStats.available_items,
      icon: BarChart3,
      color: 'green',
      trend: '+12%'
    },
    {
      title: 'Popular Items',
      value: displayStats.popular_items,
      icon: TrendingUp,
      color: 'orange',
      trend: '+8%'
    },
    {
      title: 'Avg Price',
      value: `ETB ${displayStats.average_price?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'blue',
      trend: '+5%'
    },
    {
      title: 'Categories',
      value: displayStats.total_categories,
      icon: Tag,
      color: 'indigo',
      trend: null
    },
    {
      title: 'Revenue Share',
      value: displayStats.revenue_share || '0%',
      icon: Percent,
      color: 'emerald',
      trend: '+3%'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Menu Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="text-center p-4">
            <div className={`w-12 h-12 ${getBgColor(stat.color)} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 ${getTextColor(stat.color)}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
            {stat.trend && (
              <p className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} mt-2`}>
                {stat.trend} from last month
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions for dynamic Tailwind classes
const getBgColor = (color) => {
  switch(color) {
    case 'purple': return 'bg-purple-100';
    case 'green': return 'bg-green-100';
    case 'orange': return 'bg-orange-100';
    case 'blue': return 'bg-blue-100';
    case 'indigo': return 'bg-indigo-100';
    case 'emerald': return 'bg-emerald-100';
    default: return 'bg-gray-100';
  }
};

const getTextColor = (color) => {
  switch(color) {
    case 'purple': return 'text-purple-600';
    case 'green': return 'text-green-600';
    case 'orange': return 'text-orange-600';
    case 'blue': return 'text-blue-600';
    case 'indigo': return 'text-indigo-600';
    case 'emerald': return 'text-emerald-600';
    default: return 'text-gray-600';
  }
};