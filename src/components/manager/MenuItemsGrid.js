'use client';

import { 
  Edit, Trash2, Eye, Star, 
  CheckCircle, XCircle, Flame,
  Leaf, Shield, Zap, Grid3x3,
  List
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
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
            {/* Item Image/Placeholder */}
            <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-white">🍽️</span>
                    </div>
                    <p className="text-white font-medium">{item.name}</p>
                  </div>
                </div>
              )}
              
              {/* Badges */}
              <div className="absolute top-3 left-3 space-y-2">
                {item.is_popular && (
                  <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Popular
                  </span>
                )}
                {item.availability ? (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    Unavailable
                  </span>
                )}
              </div>

              {/* Dietary Tags */}
              <div className="absolute top-3 right-3 flex space-x-1">
                {item.is_vegetarian && (
                  <span className="bg-green-100 text-green-800 p-1 rounded" title="Vegetarian">
                    <Leaf className="w-3 h-3" />
                  </span>
                )}
                {item.is_spicy && (
                  <span className="bg-red-100 text-red-800 p-1 rounded" title="Spicy">
                    <Flame className="w-3 h-3" />
                  </span>
                )}
                {item.is_gluten_free && (
                  <span className="bg-blue-100 text-blue-800 p-1 rounded" title="Gluten Free">
                    <Shield className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>

            {/* Item Details */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-900 text-lg truncate">{item.name}</h4>
                <span className="font-bold text-gray-900 text-lg">ETB {item.price}</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="bg-gray-100 px-2 py-1 rounded">
                  {item.category?.name || 'Uncategorized'}
                </span>
                <span className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  {item.preparation_time || 15} min
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-between space-x-2 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onEdit(item)}
                  className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onToggleAvailability(item)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${item.availability ? 'bg-red-50 hover:bg-red-100 text-red-700' : 'bg-green-50 hover:bg-green-100 text-green-700'}`}
                >
                  {item.availability ? 'Make Unavailable' : 'Make Available'}
                </button>
                <button
                  onClick={() => onTogglePopular(item)}
                  className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium transition"
                >
                  {item.is_popular ? 'Remove Popular' : 'Mark Popular'}
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition"
                >
                  Delete
                </button>
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prep Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {items.map(item => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-full w-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-lg">🍽️</span>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.is_vegetarian && (
                        <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">Vegetarian</span>
                      )}
                      {item.is_spicy && (
                        <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded">Spicy</span>
                      )}
                      {item.is_popular && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  {item.category?.name || 'Uncategorized'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="font-semibold text-gray-900">ETB {item.price}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center text-gray-700">
                  <Zap className="w-4 h-4 mr-1" />
                  {item.preparation_time || 15} min
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {item.availability ? (
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
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onToggleAvailability(item)}
                    className={`p-2 rounded-lg transition ${item.availability ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'}`}
                    title={item.availability ? 'Make Unavailable' : 'Make Available'}
                  >
                    {item.availability ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onTogglePopular(item)}
                    className={`p-2 ${item.is_popular ? 'text-amber-600 hover:bg-amber-100' : 'text-gray-600 hover:bg-gray-100'} rounded-lg transition`}
                    title={item.is_popular ? 'Remove Popular' : 'Mark Popular'}
                  >
                    <Star className={`w-4 h-4 ${item.is_popular ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}