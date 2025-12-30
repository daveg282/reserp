export default function StatCard({ stat }) {
  const Icon = stat.icon;
  const isPositive = stat.change?.startsWith('+');
  
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-3 lg:p-4 xl:p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-2 lg:mb-3 xl:mb-4">
        <div className={`p-2 lg:p-3 rounded-lg lg:rounded-xl bg-${stat.color}-50`}>
          <Icon className={`w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-${stat.color}-600`} />
        </div>
        {stat.change && (
          <span className={`text-xs lg:text-sm font-semibold ${
            isPositive ? 'text-emerald-600' : 'text-red-600'
          }`}>
            {stat.change}
          </span>
        )}
      </div>
      <p className="text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
      <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
    </div>
  );
}