'use client';

import { useState, useEffect } from 'react';
import { X, Tag, Palette, Hash } from 'lucide-react';

export default function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6B7280', // Default gray
    display_order: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        color: initialData.color || '#6B7280',
        display_order: initialData.display_order || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#6B7280',
        display_order: ''
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.display_order || parseInt(formData.display_order) < 0) {
      newErrors.display_order = 'Valid display order is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        display_order: parseInt(formData.display_order)
      };
      
      if (initialData) {
        await onSubmit(initialData.id, dataToSubmit);
      } else {
        await onSubmit(dataToSubmit);
      }
      
      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Color options
  const colorOptions = [
    { name: 'Gray', value: '#6B7280' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Green', value: '#10B981' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Category' : 'Add Category'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {initialData ? 'Update category details' : 'Create a new menu category'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="e.g., Appetizers, Main Course"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe this category..."
            />
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Order *
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                className={`w-full pl-10 pr-4 py-2 border ${errors.display_order ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="e.g., 1 (first), 2 (second)..."
              />
            </div>
            {errors.display_order && (
              <p className="mt-1 text-sm text-red-600">{errors.display_order}</p>
            )}
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Category Color
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({...formData, color: color.value})}
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color.value ? 'border-gray-800' : 'border-transparent'}`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 rounded-full mr-2 border"
                  style={{ backgroundColor: formData.color }}
                />
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-12 h-8 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {initialData ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                <>
                  {initialData ? 'Update Category' : 'Add Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}