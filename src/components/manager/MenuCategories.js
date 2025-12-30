'use client';

import { 
  Plus, Folder, Edit, Trash2, 
  Eye, ChevronRight, Hash, Palette 
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Categories</h3>
        <button
          onClick={onAdd}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="space-y-3">
        {categories.map(category => (
          <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden">
            {/* Category Header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleCategory(category.id)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: category.color || '#6B7280' }}
                >
                  <Folder className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{category.item_count || 0} items</span>
                    <span className="flex items-center">
                      <Hash className="w-3 h-3 mr-1" />
                      Order: {category.display_order || 0}
                    </span>
                    {category.description && (
                      <span className="truncate max-w-xs">{category.description}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
                    <p className="text-gray-600 text-sm">
                      {category.description || 'No description provided'}
                    </p>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Details</h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Color:</span>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-gray-900">{category.color}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Display Order:</span>
                        <span className="text-gray-900">{category.display_order || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-gray-900">
                          {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
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
                    onClick={() => onDelete(category)}
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
  );
}