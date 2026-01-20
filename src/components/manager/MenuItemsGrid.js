'use client';

import { 
  Edit, Trash2, RotateCcw,
  CheckCircle, XCircle,
  Grid3x3, List, Zap,
  TrendingUp
} from 'lucide-react';

export default function MenuItemsGrid({
  items = [],
  viewMode = 'grid',
  onEdit,
  onDelete,
  onToggleAvailability,
  onTogglePopular,
  userRole = 'manager'
}) {
  
  const formatPrice = (price) => {
    return `ETB ${parseFloat(price || 0).toFixed(2)}`;
  };

  // Helper to get category name
  const getCategoryName = (item) => {
    return item.category_name || item.category?.name || 'Uncategorized';
  };

  // Check if item is available - FIXED: available is 0/1
  const isAvailable = (item) => {
    return item.available === 1; // Database uses 0/1
  };

  // Get preparation time
  const getPrepTime = (item) => {
    return item.preparation_time || 15;
  };

  // Check if item is popular
  const isPopular = (item) => {
    return item.popular === 1; // Database uses 0/1
  };

  // Grid View
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            {/* Item Header with Color */}
            <div className={`h-2 ${isAvailable(item) ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-red-500 to-red-600'}`}></div>
            
            {/* Item Content */}
            <div className="p-4">
              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {isPopular(item) && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {isAvailable(item) ? (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Unavailable
                  </span>
                )}
              </div>

              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900 text-lg truncate">{item.name}</h4>
                <span className="font-bold text-gray-900 text-lg">{formatPrice(item.price)}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {getCategoryName(item)}
                </span>
                <span className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  {getPrepTime(item)} min
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-between space-x-2 pt-3 border-t border-gray-200">
                {/* Edit Button */}
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition"
                >
                  Edit
                </button>
                
                {/* Toggle Availability Button */}
                <button
                  onClick={() => onToggleAvailability(item)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                    isAvailable(item) 
                      ? 'bg-red-50 hover:bg-red-100 text-red-700' 
                      : 'bg-green-50 hover:bg-green-100 text-green-700'
                  }`}
                >
                  {isAvailable(item) ? (
                    <>
                      <XCircle className="w-4 h-4" />
                      Make Unavailable
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Make Available
                    </>
                  )}
                </button>
                
                {/* Delete Button (for admins only) */}
                {userRole === 'admin' && (
                  <button
                    onClick={() => {
                      if (confirm(`Permanently delete "${item.name}"? This action cannot be undone.`)) {
                        onDelete(item);
                      }
                    }}
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List View
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {item.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                    {isPopular(item) && (
                      <div className="mt-1">
                        <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1 inline-flex">
                          <TrendingUp className="w-3 h-3" />
                          Popular
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {getCategoryName(item)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {isAvailable(item) ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircle className="w-3 h-3 mr-1" />
                    Unavailable
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  {/* Toggle Availability Button */}
                  <button
                    onClick={() => onToggleAvailability(item)}
                    className={`p-2 rounded-lg transition ${
                      isAvailable(item) 
                        ? 'text-red-600 hover:bg-red-100' 
                        : 'text-green-600 hover:bg-green-100'
                    }`}
                    title={isAvailable(item) ? 'Make Unavailable' : 'Make Available'}
                  >
                    {isAvailable(item) ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                  
                  {/* Delete Button (for admins only) */}
                  {userRole === 'admin' && (
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete "${item.name}"? This action cannot be undone.`)) {
                          onDelete(item);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete Permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}