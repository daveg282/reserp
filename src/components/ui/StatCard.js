export default function StatCard({ value, label, icon }) {
  return (
    <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-300">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
        {value}
      </div>
      <div className="text-sm font-medium text-gray-600">{label}</div>
    </div>
  );
}