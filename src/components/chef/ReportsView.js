import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, TrendingUp, AlertCircle, Download, BarChart3, TrendingDown, Users } from 'lucide-react';
import { useState } from 'react';

export default function ReportsView() {
  const { t } = useTranslation('chef');
  const [timeRange, setTimeRange] = useState('week');
  
  // Sample report data
  const reportData = {
    week: {
      ordersPrepared: 328,
      avgPrepTime: 18.5,
      foodCost: 28.3,
      waste: 1240,
      revenue: 45890,
      popularDishes: [
        { name: 'Grilled Salmon', orders: 156 },
        { name: 'Spaghetti Carbonara', orders: 143 },
        { name: 'Ribeye Steak', orders: 128 },
        { name: 'Chicken Alfredo', orders: 112 },
        { name: 'Caesar Salad', orders: 98 }
      ],
      efficiency: {
        orderAccuracy: 98.2,
        onTimeDelivery: 94.7,
        staffEfficiency: 88.5
      }
    },
    month: {
      ordersPrepared: 1428,
      avgPrepTime: 19.2,
      foodCost: 29.1,
      waste: 5420,
      revenue: 195430,
      popularDishes: [
        { name: 'Grilled Salmon', orders: 654 },
        { name: 'Spaghetti Carbonara', orders: 589 },
        { name: 'Ribeye Steak', orders: 512 },
        { name: 'Chicken Alfredo', orders: 487 },
        { name: 'Caesar Salad', orders: 423 }
      ],
      efficiency: {
        orderAccuracy: 97.8,
        onTimeDelivery: 93.4,
        staffEfficiency: 87.2
      }
    }
  };

  const data = reportData[timeRange];

  const handleExport = () => {
    const exportData = {
      timeRange,
      ...data,
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kitchen_report_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t('reports.title')}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {t('reports.subtitle', 'Kitchen performance and analytics')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
          >
            <option value="week">{t('reports.thisWeek')}</option>
            <option value="month">{t('reports.thisMonth')}</option>
          </select>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t('reports.export')}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">+12%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.ordersPrepared}</p>
          <p className="text-sm text-gray-600 mt-1">{t('reports.ordersPrepared')}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-blue-600">-1.2m</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.avgPrepTime}m</p>
          <p className="text-sm text-gray-600 mt-1">{t('reports.avgPrepTime')}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-red-600">+0.8%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.foodCost}%</p>
          <p className="text-sm text-gray-600 mt-1">{t('reports.foodCost')}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">-5%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.waste.toLocaleString()} ETB</p>
          <p className="text-sm text-gray-600 mt-1">{t('reports.waste')}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{t('reports.revenue')}</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.revenue.toLocaleString()} ETB</p>
          <p className="text-sm text-gray-600 mt-2">
            {timeRange === 'week' ? t('reports.weeklyRevenue') : t('reports.monthlyRevenue')}
          </p>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-sm font-medium text-emerald-700">
              {t('reports.revenueTrend', '12% increase from last period')}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-gray-900">{t('reports.customerSatisfaction')}</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">4.7/5</p>
          <p className="text-sm text-gray-600 mt-2">{t('reports.averageRating')}</p>
          <div className="mt-4 flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-amber-400">★</span>
            ))}
            <span className="text-sm text-gray-600 ml-2">(1,248 reviews)</span>
          </div>
        </div>
      </div>

      {/* Popular Dishes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4">{t('reports.popularDishes')}</h4>
        <div className="space-y-3">
          {data.popularDishes.map((dish, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-gray-400 font-medium">#{index + 1}</span>
                <span className="font-semibold text-gray-900">{dish.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{dish.orders} {t('reports.orders')}</span>
                <span className="text-sm text-gray-400">
                  {Math.round((dish.orders / data.ordersPrepared) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kitchen Efficiency */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-bold text-gray-900 mb-4">{t('reports.kitchenEfficiency')}</h4>
        <div className="space-y-6">
          {Object.entries(data.efficiency).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {t(`reports.${key}`)}
                </span>
                <span className="font-semibold text-gray-900">{value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    value > 95 ? 'bg-green-500' :
                    value > 85 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${value}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-bold text-gray-900 mb-4">{t('reports.insights')}</h4>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('reports.insight1Title')}</p>
              <p className="text-sm text-gray-600 mt-1">{t('reports.insight1Desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('reports.insight2Title')}</p>
              <p className="text-sm text-gray-600 mt-1">{t('reports.insight2Desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}