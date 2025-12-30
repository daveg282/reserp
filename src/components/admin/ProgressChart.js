export default function ProgressChart({ value, max = 100, color = 'blue', label, showPercentage = true }) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  
  const colorClasses = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    gray: 'bg-gray-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        {label && <span className="text-gray-700">{label}</span>}
        {showPercentage && (
          <span className="font-medium text-gray-900">{value} ({percentage}%)</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}