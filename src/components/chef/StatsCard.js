import { TrendingUp, DollarSign, Clock, Users } from 'lucide-react';

const iconMap = {
  DollarSign,
  TrendingUp,
  Clock,
  Users
};

function StatsCard({ stat }) {
  const IconComponent = iconMap[stat.icon];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${stat.color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <span className={`text-sm font-medium ${
          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {stat.change}
        </span>
      </div>
      <h4 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h4>
      <p className="text-gray-600 text-sm">{stat.title}</p>
    </div>
  );
}

export default StatsCard;