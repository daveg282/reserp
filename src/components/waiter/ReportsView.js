import { TrendingUp, DollarSign, Clock, Users, Download, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const iconMap = {
  DollarSign,
  TrendingUp,
  Clock,
  Users
};

// Move static data inside component to avoid hydration issues
const staticReportsData = {
  stats: [
    {
      icon: 'DollarSign',
      titleKey: 'totalRevenue',
      value: 'ETB 12,450',
      color: 'bg-green-500',
      trend: 'up',
      change: '+12%'
    },
    {
      icon: 'TrendingUp',
      titleKey: 'totalOrders',
      value: '89',
      color: 'bg-blue-500',
      trend: 'up', 
      change: '+8%'
    },
    {
      icon: 'Clock',
      titleKey: 'averageOrder',
      value: 'ETB 140',
      color: 'bg-purple-500',
      trend: 'up',
      change: '+5%'
    },
    {
      icon: 'Users',
      titleKey: 'tablesServed',
      value: '15',
      color: 'bg-amber-500',
      trend: 'up',
      change: '+3%'
    }
  ],
  popularItems: [
    { name: 'Spaghetti Carbonara', orders: 23, revenue: 'ETB 2,760' },
    { name: 'Grilled Salmon', orders: 18, revenue: 'ETB 2,700' },
    { name: 'Caesar Salad', orders: 15, revenue: 'ETB 1,200' },
    { name: 'Beef Burger', orders: 12, revenue: 'ETB 1,140' },
    { name: 'Chocolate Cake', orders: 10, revenue: 'ETB 600' }
  ],
  tablePerformance: [
    { table: 'T01', orders: 8, avgTime: '25min', revenue: 'ETB 1,240' },
    { table: 'T04', orders: 7, avgTime: '28min', revenue: 'ETB 1,180' },
    { table: 'T07', orders: 6, avgTime: '22min', revenue: 'ETB 1,050' },
    { table: 'T12', orders: 5, avgTime: '30min', revenue: 'ETB 980' }
  ]
};

export default function ReportsView({ setActiveView, setShowDailyOrders }) {
  const { t } = useTranslation('waiter');
  const { stats, popularItems, tablePerformance } = staticReportsData;

   const viewAllOrders = () => {
    setShowDailyOrders(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{t('reports.title')}</h3>
          <p className="text-gray-600 mt-1">{t('reports.dailySubtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={viewAllOrders}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <List className="w-4 h-4" />
            {t('reports.viewAllOrders')}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" />
            {t('reports.export')}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = iconMap[stat.icon];
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
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
              <p className="text-gray-600 text-sm">{t(`reports.${stat.titleKey}`)}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Items */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">{t('reports.popularItems')}</h4>
            <span className="text-sm text-gray-500">{t('reports.topToday')}</span>
          </div>
          <div className="space-y-4">
            {popularItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.orders} {t('reports.orders')} • {t('reports.sold')}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">{item.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-900">{t('reports.tablePerformance')}</h4>
            <span className="text-sm text-gray-500">{t('reports.today')}</span>
          </div>
          <div className="space-y-4">
            {tablePerformance.map((table, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div>
                  <p className="font-medium text-gray-900">
                    {t('reports.table')} {table.table}
                  </p>
                  <p className="text-sm text-gray-500">
                    {table.orders} {t('reports.orders')} • {table.avgTime} {t('reports.avgTime')}
                  </p>
                </div>
                <span className="font-semibold text-green-600">{table.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}