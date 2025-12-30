'use client';

import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, DollarSign, Tag, FileText } from 'lucide-react';

export default function MenuItemModal({
  isOpen,
  onClose,
  onSubmit,
  categories = [],
  initialData = null
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    ingredients: '',
    preparation_time: '',
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    is_spicy: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with initial data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        category_id: initialData.category_id || initialData.category?.id || '',
        ingredients: initialData.ingredients || '',
        preparation_time: initialData.preparation_time || '',
        is_vegetarian: initialData.is_vegetarian || false,
        is_vegan: initialData.is_vegan || false,
        is_gluten_free: initialData.is_gluten_free || false,
        is_spicy: initialData.is_spicy || false
      });
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        description: '',
        price: '',
        category_id: '',
        ingredients: '',
        preparation_time: '',
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        is_spicy: false
      });
    }
  }, [initialData, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    if (!formData.preparation_time || parseInt(formData.preparation_time) <= 0) {
      newErrors.preparation_time = 'Valid preparation time is required';
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
        price: parseFloat(formData.price),
        preparation_time: parseInt(formData.preparation_time)
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {initialData ? 'Update menu item details' : 'Add a new item to your menu'}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="e.g., Classic Burger"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (ETB) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className={`w-full pl-10 pr-4 py-2 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                  className={`w-full px-4 py-2 border ${errors.category_id ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                )}
              </div>

              {/* Preparation Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preparation Time (minutes) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.preparation_time}
                  onChange={(e) => setFormData({...formData, preparation_time: e.target.value})}
                  className={`w-full px-4 py-2 border ${errors.preparation_time ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="e.g., 15"
                />
                {errors.preparation_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.preparation_time}</p>
                )}
              </div>

              {/* Dietary Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Dietary Tags
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_vegetarian}
                      onChange={(e) => setFormData({...formData, is_vegetarian: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_vegan}
                      onChange={(e) => setFormData({...formData, is_vegan: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Vegan</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_gluten_free}
                      onChange={(e) => setFormData({...formData, is_gluten_free: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Gluten Free</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_spicy}
                      onChange={(e) => setFormData({...formData, is_spicy: e.target.checked})}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Spicy</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="Describe the menu item..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredients *
                </label>
                <textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  rows="4"
                  className={`w-full px-4 py-2 border ${errors.ingredients ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="List ingredients separated by commas..."
                />
                {errors.ingredients && (
                  <p className="mt-1 text-sm text-red-600">{errors.ingredients}</p>
                )}
              </div>

              {/* Image Upload (Placeholder) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-2">
                    Drag & drop an image or click to browse
                  </p>
                  <p className="text-gray-400 text-xs">
                    Recommended: 800x600px, max 5MB
                  </p>
                </div>
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
                  {initialData ? 'Update Item' : 'Add Item'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}