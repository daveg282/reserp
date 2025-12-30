'use client';
import { ArrowUp, ArrowDown } from 'lucide-react';

// Define getTrendIcon locally in StatsCard
const getTrendIcon = (trend) => {
  if (trend === 'up') return <ArrowUp className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-500" />;
  return <span className="w-4 h-4 text-gray-400">→</span>;
};

export default function StatsCard({ label, value, change, trend, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2 lg:mb-3 xl:mb-4">
        <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${color}-50`}>
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${color}-600`} />
        </div>
        <div className={`flex items-center space-x-1 text-xs lg:text-sm font-medium ${
          trend === 'up' ? 'text-emerald-600' : 'text-red-600'
        }`}>
          {getTrendIcon(trend)}
          <span>{change}</span>
        </div>
      </div>
      <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs lg:text-sm text-gray-600">{label}</p>
    </div>
  );
}