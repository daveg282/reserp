'use client';

import { 
  Plus, Folder, Edit, Trash2, 
  ChevronRight, Calendar,
  AlertCircle, Tag, List
} from 'lucide-react';
import { useState } from 'react';

export default function MenuCategories({
  categories = [],
  onEdit,
  onDelete,
  onAdd,
  userRole = 'manager'
}) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Yet</h3>
        <p className="text-gray-600 mb-6">
          Organize your menu by creating categories
        </p>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Menu Categories</h3>
            <p className="text-sm text-gray-600 mt-1">
              {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} in total
            </p>
          </div>
          <button
            onClick={onAdd}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>

        <div className="space-y-4">
          {categories.map(category => (
            <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition">
              {/* Category Header */}
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 truncate">{category.name}</h4>
                      {category.item_count > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          {category.item_count} item{category.item_count !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Created: {formatDate(category.created_at)}
                      </span>
                      {category.updated_at && category.updated_at !== category.created_at && (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Updated: {formatDate(category.updated_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedCategory === category.id ? 'rotate-90' : ''}`} />
                </div>
              </div>

              {/* Category Details (Expanded) */}
              {expandedCategory === category.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="space-y-4 mb-4">
                    {/* Description */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
                      <p className="text-gray-600 text-sm bg-white p-3 rounded-lg border border-gray-200">
                        {category.description || 'No description provided'}
                      </p>
                    </div>

                    {/* Category Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Category ID</h5>
                        <p className="text-sm font-medium text-gray-900">#{category.id}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Created Date</h5>
                        <p className="text-sm font-medium text-gray-900">{formatDate(category.created_at)}</p>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <h5 className="text-xs font-medium text-gray-500 mb-1">Menu Items</h5>
                        <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          <List className="w-4 h-4" />
                          {category.item_count || 0} item{category.item_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-300">
                    <button
                      onClick={() => onEdit(category)}
                      className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center gap-2 text-sm transition"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete the category "${category.name}"? Items in this category will be moved to "Uncategorized".`)) {
                          onDelete(category);
                        }
                      }}
                      className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}