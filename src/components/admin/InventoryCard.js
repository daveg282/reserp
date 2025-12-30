import { Edit, Trash2, AlertCircle } from 'lucide-react';

export default function InventoryCard({ item, deleteItem }) {
  const handleEdit = () => {
    console.log('Edit item:', item.id);
    // Implementation for editing item
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${item.name}?`)) {
      deleteItem(item.id);
    }
  };

  const stockPercentage = Math.round((item.currentStock / (item.minStock * 2)) * 100);
  const isCritical = item.currentStock <= item.minStock * 0.5;
  const isLow = item.currentStock <= item.minStock;

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm lg:text-base">{item.name}</h3>
          <p className="text-xs lg:text-sm text-gray-600">{item.category}</p>
        </div>
        {isLow && (
          <div className="flex items-center space-x-1">
            <AlertCircle className={`w-5 h-5 lg:w-6 lg:h-6 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
          </div>
        )}
      </div>
      
      {/* Stock Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Stock Level</span>
          <span>{item.currentStock} / {item.minStock * 2} {item.unit}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              isCritical ? 'bg-red-500' : 
              isLow ? 'bg-amber-500' : 
              'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(stockPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-2 text-xs lg:text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Current Stock</span>
          <span className={`font-medium ${
            isCritical ? 'text-red-600' : 
            isLow ? 'text-amber-600' : 
            'text-gray-900'
          }`}>
            {item.currentStock} {item.unit}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Minimum Stock</span>
          <span className="text-gray-900">{item.minStock} {item.unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Cost</span>
          <span className="text-gray-900">ETB {item.cost}/unit</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Supplier</span>
          <span className="text-gray-900 truncate ml-2">{item.supplier}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Last ordered: {new Date(item.lastOrder).toLocaleDateString()}
        </span>
        <div className="flex space-x-1">
          <button 
            onClick={handleEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label={`Edit ${item.name}`}
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}