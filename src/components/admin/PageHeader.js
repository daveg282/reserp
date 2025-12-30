export default function PageHeader({ title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
      <div>
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>
      
      {actions && actions.length > 0 && (
        <div className="flex space-x-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const variantClasses = {
              primary: 'bg-blue-600 hover:bg-blue-700 text-white',
              secondary: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
              danger: 'bg-red-600 hover:bg-red-700 text-white'
            };
            
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition ${
                  variantClasses[action.variant || 'primary']
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}