export default function FeatureCard({ 
  title, 
  description, 
  items, 
  gradientFrom, 
  gradientTo, 
  borderColor,
  icon 
}) {
  const baseColor = gradientFrom.split('-')[1]; // Extract color name from gradient
  
  return (
    <div className={`group relative bg-gradient-to-br ${gradientFrom} ${gradientTo} p-8 rounded-3xl border ${borderColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-5 transform translate-x-10 -translate-y-10">
        <div className="w-full h-full bg-current rounded-full"></div>
      </div>
      
      {/* Icon Container */}
      <div className={`relative z-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg border border-gray-100`}>
        <div className={`text-${baseColor}-600`}>
          {icon}
        </div>
      </div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 relative z-10 group-hover:text-gray-800 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
        {description}
      </p>
      
      <ul className="space-y-3 relative z-10">
        {items.map((item, index) => (
          <li key={index} className="flex items-center text-gray-700 group/item">
            <div className={`w-2 h-2 bg-${baseColor}-500 rounded-full mr-3 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300`}></div>
            <span className="text-sm font-medium group-hover/item:text-gray-900 transition-colors duration-300">
              {item}
            </span>
          </li>
        ))}
      </ul>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500 rounded-3xl"></div>
    </div>
  );
}