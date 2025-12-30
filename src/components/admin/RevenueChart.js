export default function RevenueChart({ timeRange, salesData }) {
  const data = salesData?.[timeRange] || [];
  const maxValue = Math.max(...data);
  const labels = generateLabels(timeRange);

  function generateLabels(range) {
    switch (range) {
      case 'today':
        return Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
      case 'week':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'month':
        return Array.from({ length: 12 }, (_, i) => i + 1);
      case 'year':
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      default:
        return [];
    }
  }

  return (
    <div className="h-48 lg:h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-end justify-between h-full space-x-1">
        {data.slice(0, labels.length).map((value, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-blue-600 hover:to-blue-700 cursor-pointer shadow-md"
              style={{ height: `${(value / maxValue) * 80}%` }}
              title={`ETB ${value.toLocaleString()}`}
            ></div>
            <span className="text-xs text-gray-500 mt-1">
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded shadow"></div>
            <span className="text-gray-600">Revenue</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-300 rounded shadow"></div>
            <span className="text-gray-600">Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}