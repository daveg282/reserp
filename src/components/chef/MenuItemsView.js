'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Utensils, 
  ChefHat, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Package,
  ShoppingBag,
  Tag,
  Layers,
  Scale,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import AuthService from '@/lib/auth-utils';

export default function MenuItemsView({ 
  token,
  userRole = 'chef',
  onAddIngredient,
  onRemoveIngredient,
  onRefresh
}) {
  const { t } = useTranslation('chef');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemIngredients, setItemIngredients] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [newIngredientData, setNewIngredientData] = useState({
    ingredient_id: '',
    quantity_required: 1,
    unit: 'g'
  });

  // Check permissions
  const canWrite = ['admin', 'manager'].includes(userRole);
  const canView = ['admin', 'manager', 'chef'].includes(userRole);

  // Fetch menu items
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // You'll need to import menuItemsAPI
      const items = await menuItemsAPI.getMenuItems(token);
      setMenuItems(items);
      
    } catch (err) {
      console.error('Fetch menu items error:', err);
      setError(err.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all ingredients for adding to recipes
  const fetchAllIngredients = async () => {
    try {
      const ingredients = await chefInventoryAPI.getIngredients(token);
      setAllIngredients(ingredients);
    } catch (err) {
      console.error('Fetch ingredients error:', err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      // You'll need to import menuAPI
      const categoriesData = await menuAPI.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  // Load menu item details with ingredients
  const loadMenuItemDetails = async (menuItemId) => {
    try {
      const details = await menuItemsAPI.getMenuItemIngredients(menuItemId, token);
      setSelectedItem(details.menu_item);
      setItemIngredients(details.ingredients || []);
    } catch (err) {
      console.error('Load menu item details error:', err);
      setError(err.message || 'Failed to load item details');
    }
  };

  // Handle add ingredient to recipe
  const handleAddIngredient = async () => {
    if (!newIngredientData.ingredient_id || !newIngredientData.quantity_required) {
      alert('Please select an ingredient and enter quantity');
      return;
    }

    try {
      await menuItemsAPI.addIngredientToMenuItem(
        selectedItem.id,
        newIngredientData.ingredient_id,
        newIngredientData.quantity_required,
        token
      );
      
      // Refresh the item details
      await loadMenuItemDetails(selectedItem.id);
      setShowAddIngredient(false);
      setNewIngredientData({
        ingredient_id: '',
        quantity_required: 1,
        unit: 'g'
      });
      
      if (onRefresh) onRefresh();
      
    } catch (err) {
      console.error('Add ingredient error:', err);
      setError(err.message || 'Failed to add ingredient');
    }
  };

  // Handle remove ingredient from recipe
  const handleRemoveIngredient = async (ingredientId) => {
    if (!window.confirm('Are you sure you want to remove this ingredient from the recipe?')) {
      return;
    }

    try {
      await menuItemsAPI.removeIngredientFromMenuItem(
        selectedItem.id,
        ingredientId,
        token
      );
      
      // Refresh the item details
      await loadMenuItemDetails(selectedItem.id);
      
      if (onRefresh) onRefresh();
      
    } catch (err) {
      console.error('Remove ingredient error:', err);
      setError(err.message || 'Failed to remove ingredient');
    }
  };

  // Calculate total ingredient cost
  const calculateTotalCost = () => {
    return itemIngredients.reduce((total, ingredient) => {
      const ingredientCost = allIngredients.find(i => i.id === ingredient.ingredient_id)?.cost_per_unit || 0;
      return total + (ingredientCost * ingredient.quantity_required);
    }, 0);
  };

  // Initialize
  useEffect(() => {
    if (token) {
      fetchMenuItems();
      fetchCategories();
      fetchAllIngredients();
    }
  }, [token]);

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = searchQuery 
      ? item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const matchesCategory = categoryFilter === 'all' || item.category_id == categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view menu items.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <XCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-800">Error Loading Menu Items</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchMenuItems}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t('menuItems.title', 'Menu Items')}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {canWrite 
              ? 'Manage menu items and their recipes'
              : 'View menu items and their required ingredients'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchMenuItems}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center space-x-2 transition-colors"
          >
            <span className="text-lg">⟳</span>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          <div className="flex border border-gray-300 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2.5 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2.5 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items List */}
        <div className={`${selectedItem ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMenuItems.length > 0 ? (
                filteredMenuItems.map(item => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => loadMenuItemDetails(item.id)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                        </div>
                        <div className="ml-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            ${item.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{item.preparation_time || 15} min</span>
                        </div>
                        <div className="flex items-center">
                          {item.available ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Available
                            </span>
                          ) : (
                            <span className="flex items-center text-red-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {item.category_name || 'Uncategorized'}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          View Recipe →
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <Utensils className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No menu items found</h4>
                  <p className="text-gray-600">
                    {searchQuery || categoryFilter !== 'all' 
                      ? 'Try adjusting your search or filter'
                      : 'No menu items available'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Item
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Prep Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                        Category
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMenuItems.map(item => (
                      <tr 
                        key={item.id} 
                        className="hover:bg-gray-50 transition cursor-pointer"
                        onClick={() => loadMenuItemDetails(item.id)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{item.description}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">${item.price}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{item.preparation_time || 15} min</p>
                        </td>
                        <td className="px-6 py-4">
                          {item.available ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Available
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                              Unavailable
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{item.category_name || '—'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Selected Item Details Sidebar */}
        {selectedItem && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-6">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-gray-900 text-xl">{selectedItem.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                {/* Item Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Price</p>
                    <p className="font-bold text-gray-900 text-lg">${selectedItem.price}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600">Prep Time</p>
                    <p className="font-bold text-gray-900 text-lg">{selectedItem.preparation_time || 15} min</p>
                  </div>
                </div>

                {/* Ingredients Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h5 className="font-semibold text-gray-900">Recipe Ingredients</h5>
                    {canWrite && (
                      <button
                        onClick={() => setShowAddIngredient(true)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center"
                      >
                        <PlusCircle className="w-4 h-4 mr-1" />
                        Add Ingredient
                      </button>
                    )}
                  </div>

                  {/* Add Ingredient Form */}
                  {showAddIngredient && canWrite && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Ingredient
                          </label>
                          <select
                            value={newIngredientData.ingredient_id}
                            onChange={(e) => setNewIngredientData({
                              ...newIngredientData,
                              ingredient_id: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          >
                            <option value="">Choose ingredient</option>
                            {allIngredients.map(ing => (
                              <option key={ing.id} value={ing.id}>
                                {ing.name} ({ing.current_stock} {ing.unit})
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={newIngredientData.quantity_required}
                              onChange={(e) => setNewIngredientData({
                                ...newIngredientData,
                                quantity_required: parseFloat(e.target.value) || 0
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Unit
                            </label>
                            <input
                              type="text"
                              value={newIngredientData.unit}
                              onChange={(e) => setNewIngredientData({
                                ...newIngredientData,
                                unit: e.target.value
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                              placeholder="g, kg, ml, etc."
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={handleAddIngredient}
                            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                          >
                            Add to Recipe
                          </button>
                          <button
                            onClick={() => setShowAddIngredient(false)}
                            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Ingredients List */}
                  {itemIngredients.length > 0 ? (
                    <div className="space-y-3">
                      {itemIngredients.map((ing, index) => {
                        const ingredientInfo = allIngredients.find(i => i.id === ing.ingredient_id);
                        
                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">
                                {ingredientInfo?.name || `Ingredient #${ing.ingredient_id}`}
                              </p>
                              <div className="flex items-center text-sm text-gray-600 mt-1">
                                <Scale className="w-3 h-3 mr-1" />
                                <span>{ing.quantity_required} {ing.unit || ingredientInfo?.unit || 'unit'}</span>
                                {ingredientInfo && (
                                  <span className="mx-2">•</span>
                                )}
                                {ingredientInfo && (
                                  <span>Stock: {ingredientInfo.current_stock} {ingredientInfo.unit}</span>
                                )}
                              </div>
                            </div>
                            
                            {canWrite && (
                              <button
                                onClick={() => handleRemoveIngredient(ing.ingredient_id)}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                                title="Remove from recipe"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                      
                      {/* Cost Summary */}
                      <div className="mt-6 p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Ingredient Cost</p>
                            <p className="font-bold text-gray-900 text-lg">
                              ${calculateTotalCost().toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Profit Margin</p>
                            <p className="font-bold text-green-700">
                              ${(selectedItem.price - calculateTotalCost()).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No ingredients defined for this item</p>
                      {canWrite && (
                        <button
                          onClick={() => setShowAddIngredient(true)}
                          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                        >
                          Add First Ingredient
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Read-only Notice for Chef */}
                {!canWrite && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-700">Read-only view</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      Only admins and managers can modify recipes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}