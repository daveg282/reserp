'use client';

import { Tag, CheckCircle, Folder } from 'lucide-react';

export default function MenuStats({ stats }) {
  // Use provided stats or defaults
  const displayStats = stats || {
    total_items: 0,
    available_items: 0,
    total_categories: 0
  };

  // Simple stat cards
  const statCards = [
    {
      title: 'Total Items',
      value: displayStats.total_items || 0,
      icon: Tag,
      color: 'purple'
    },
    {
      title: 'Available Items',
      value: displayStats.available_items || 0,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Categories',
      value: displayStats.total_categories || 0,
      icon: Folder,
      color: 'blue'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Menu Overview</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="text-center p-4">
            <div className={`w-12 h-12 ${getBgColor(stat.color)} rounded-full flex items-center justify-center mx-auto mb-3`}>
              <stat.icon className={`w-6 h-6 ${getTextColor(stat.color)}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper functions
const getBgColor = (color) => {
  switch(color) {
    case 'purple': return 'bg-purple-100';
    case 'green': return 'bg-green-100';
    case 'blue': return 'bg-blue-100';
    default: return 'bg-gray-100';
  }
};

const getTextColor = (color) => {
  switch(color) {
    case 'purple': return 'text-purple-600';
    case 'green': return 'text-green-600';
    case 'blue': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};