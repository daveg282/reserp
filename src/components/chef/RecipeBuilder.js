'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiPackage, FiAlertTriangle, FiDollarSign, 
  FiFilter, FiSearch, FiRefreshCw,
  FiEye, FiTrendingDown, FiTrendingUp,
  FiChevronLeft, FiChevronRight, FiInfo,
  FiPlus, FiEdit, FiTrash2, FiSave,
  FiShoppingCart, FiChef, FiCoffee, FiPizza,
  FiCheck, FiX, FiMenu, FiShoppingBag
} from 'react-icons/fi';
import {
  FaWeightHanging, FaBoxOpen, FaTruckLoading,
  FaSortAmountDown, FaSortAmountUp, FaExclamationTriangle,
  FaUtensils, FaHamburger, FaIceCream, FaGlassMartiniAlt,
  FaCheese, FaBreadSlice, FaFish, FaEgg, FaCarrot
} from 'react-icons/fa';

const RecipeBuilder = ({
  ingredients = [],
  menuItems = [],
  isLoading = false,
  error = null,
  onRefresh,
  userRole = 'chef',
  onSaveRecipe,
  onUpdateRecipe,
  onDeleteRecipe
}) => {
  const { t } = useTranslation('chef');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' or 'ingredients'
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeForm, setRecipeForm] = useState({
    name: '',
    description: '',
    category: '',
    ingredients: []
  });
  const [showRecipeForm, setShowRecipeForm] = useState(false);

  // Filter ingredients and menu items
  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ingredient.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMenuItems = menuItems.filter(item =>
    item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unique categories
  const ingredientCategories = ['all', ...new Set(ingredients.map(i => i.category).filter(Boolean))];
  const menuCategories = ['all', ...new Set(menuItems.map(m => m.category).filter(Boolean))];

  // Calculate ingredient requirements for a menu item
  const calculateRequirements = (menuItemId) => {
    const menuItem = menuItems.find(m => m.id === menuItemId);
    if (!menuItem || !menuItem.recipe) return [];
    
    return menuItem.recipe.map(recipeItem => {
      const ingredient = ingredients.find(i => i.id === recipeItem.ingredient_id);
      if (!ingredient) return null;
      
      const required = parseFloat(recipeItem.quantity_required) || 0;
      const current = parseFloat(ingredient.current_stock) || 0;
      const sufficient = current >= required;
      
      return {
        ...recipeItem,
        ingredient_name: ingredient.name,
        ingredient_unit: ingredient.unit,
        current_stock: current,
        sufficient,
        shortage: sufficient ? 0 : required - current
      };
    }).filter(Boolean);
  };

  // Add ingredient to recipe form
  const addIngredientToRecipe = (ingredient) => {
    const existing = recipeForm.ingredients.find(item => item.ingredient_id === ingredient.id);
    if (existing) {
      setRecipeForm(prev => ({
        ...prev,
        ingredients: prev.ingredients.map(item =>
          item.ingredient_id === ingredient.id
            ? { ...item, quantity_required: (parseFloat(item.quantity_required) || 0) + 1 }
            : item
        )
      }));
    } else {
      setRecipeForm(prev => ({
        ...prev,
        ingredients: [
          ...prev.ingredients,
          {
            ingredient_id: ingredient.id,
            ingredient_name: ingredient.name,
            quantity_required: 1,
            unit: ingredient.unit,
            notes: ''
          }
        ]
      }));
    }
  };

  // Remove ingredient from recipe
  const removeIngredientFromRecipe = (ingredientId) => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(item => item.ingredient_id !== ingredientId)
    }));
  };

  // Update ingredient quantity
  const updateIngredientQuantity = (ingredientId, quantity) => {
    setRecipeForm(prev => ({
      ...prev,
      ingredients: prev.ingredients.map(item =>
        item.ingredient_id === ingredientId
          ? { ...item, quantity_required: parseFloat(quantity) || 0 }
          : item
      )
    }));
  };

  // Save recipe
  const handleSaveRecipe = () => {
    if (!recipeForm.name.trim()) {
      alert('Please enter a recipe name');
      return;
    }
    
    if (recipeForm.ingredients.length === 0) {
      alert('Please add at least one ingredient to the recipe');
      return;
    }

    if (onSaveRecipe) {
      onSaveRecipe(recipeForm);
      setRecipeForm({
        name: '',
        description: '',
        category: '',
        ingredients: []
      });
      setShowRecipeForm(false);
    }
  };

  // Edit recipe
  const handleEditRecipe = (menuItem) => {
    setRecipeForm({
      name: menuItem.name,
      description: menuItem.description || '',
      category: menuItem.category || '',
      ingredients: menuItem.recipe || []
    });
    setEditingRecipe(menuItem.id);
    setShowRecipeForm(true);
  };

  // Calculate total cost for a recipe
  const calculateRecipeCost = (recipeItems) => {
    return recipeItems.reduce((total, item) => {
      const ingredient = ingredients.find(i => i.id === item.ingredient_id);
      if (!ingredient) return total;
      
      const quantity = parseFloat(item.quantity_required) || 0;
      const costPerUnit = parseFloat(ingredient.cost_per_unit) || 0;
      return total + (quantity * costPerUnit);
    }, 0);
  };

  // Check if recipe can be made (all ingredients available)
  const checkRecipeAvailability = (recipeItems) => {
    if (!recipeItems || recipeItems.length === 0) return { canMake: false, missing: [] };
    
    const missing = recipeItems.filter(item => {
      const ingredient = ingredients.find(i => i.id === item.ingredient_id);
      if (!ingredient) return true;
      
      const required = parseFloat(item.quantity_required) || 0;
      const available = parseFloat(ingredient.current_stock) || 0;
      return available < required;
    });

    return {
      canMake: missing.length === 0,
      missing: missing.map(item => {
        const ingredient = ingredients.find(i => i.id === item.ingredient_id);
        const required = parseFloat(item.quantity_required) || 0;
        const available = parseFloat(ingredient?.current_stock) || 0;
        
        return {
          ingredient_name: ingredient?.name || 'Unknown',
          required,
          available,
          shortage: required - available,
          unit: ingredient?.unit
        };
      })
    };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="text-gray-600">Loading recipe builder...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <FaExclamationTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-medium mx-auto"
        >
          <FiRefreshCw />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipe & Formula Builder</h1>
          <p className="text-gray-600">Program menu items with ingredients for automatic deduction</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl disabled:opacity-50"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </button>
          {userRole === 'chef' && (
            <button
              onClick={() => setShowRecipeForm(true)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl"
            >
              <FiPlus />
              New Recipe
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('recipes')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'recipes'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FaUtensils />
              Menu Items & Recipes ({menuItems.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('ingredients')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ingredients'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FiPackage />
              Ingredients ({ingredients.length})
            </div>
          </button>
        </nav>
      </div>

      {/* Recipe Form Modal */}
      {showRecipeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}
              </h3>
              <button 
                onClick={() => {
                  setShowRecipeForm(false);
                  setEditingRecipe(null);
                  setRecipeForm({ name: '', description: '', category: '', ingredients: [] });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Recipe Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    value={recipeForm.name}
                    onChange={(e) => setRecipeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g., Spaghetti Carbonara, Chicken Alfredo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={recipeForm.description}
                    onChange={(e) => setRecipeForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="2"
                    placeholder="Brief description of the recipe..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={recipeForm.category}
                    onChange={(e) => setRecipeForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Category</option>
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Salads">Salads</option>
                    <option value="Sides">Sides</option>
                  </select>
                </div>
              </div>

              {/* Ingredient Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Add Ingredients
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                  {filteredIngredients.slice(0, 9).map(ingredient => (
                    <button
                      key={ingredient.id}
                      onClick={() => addIngredientToRecipe(ingredient)}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{ingredient.name}</div>
                        <div className="text-sm text-gray-500">
                          {parseFloat(ingredient.current_stock) || 0} {ingredient.unit} available
                        </div>
                      </div>
                      <FiPlus className="text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Ingredients */}
              {recipeForm.ingredients.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Recipe Ingredients</h4>
                  <div className="space-y-3">
                    {recipeForm.ingredients.map((item, index) => {
                      const ingredient = ingredients.find(i => i.id === item.ingredient_id);
                      const currentStock = parseFloat(ingredient?.current_stock) || 0;
                      const required = parseFloat(item.quantity_required) || 0;
                      const sufficient = currentStock >= required;

                      return (
                        <div key={item.ingredient_id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{item.ingredient_name}</div>
                            <div className="text-sm text-gray-500">
                              {currentStock} {ingredient?.unit} available
                              {!sufficient && (
                                <span className="ml-2 text-red-600">
                                  (Shortage: {required - currentStock} {ingredient?.unit})
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.001"
                              value={item.quantity_required}
                              onChange={(e) => updateIngredientQuantity(item.ingredient_id, e.target.value)}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-center"
                            />
                            <span className="text-gray-600">{ingredient?.unit}</span>
                          </div>
                          
                          <button
                            onClick={() => removeIngredientFromRecipe(item.ingredient_id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Recipe Summary */}
                  <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-gray-600">Total Ingredients</div>
                        <div className="text-lg font-semibold">{recipeForm.ingredients.length}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Estimated Cost</div>
                        <div className="text-lg font-semibold">
                          ${calculateRecipeCost(recipeForm.ingredients).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Availability</div>
                        <div className={`text-lg font-semibold ${
                          checkRecipeAvailability(recipeForm.ingredients).canMake 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {checkRecipeAvailability(recipeForm.ingredients).canMake 
                            ? 'Can Make' 
                            : 'Insufficient'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => {
                    setShowRecipeForm(false);
                    setEditingRecipe(null);
                    setRecipeForm({ name: '', description: '', category: '', ingredients: [] });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRecipe}
                  disabled={!recipeForm.name.trim() || recipeForm.ingredients.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave />
                  {editingRecipe ? 'Update Recipe' : 'Save Recipe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipes Tab */}
      {activeTab === 'recipes' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 min-w-[180px]"
              >
                <option value="all">All Categories</option>
                {menuCategories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Items Grid */}
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <FiMenu className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Menu Items Found</h3>
              <p className="text-gray-500 mb-6">Create your first recipe to get started</p>
              {userRole === 'chef' && (
                <button
                  onClick={() => setShowRecipeForm(true)}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium mx-auto"
                >
                  <FiPlus />
                  Create First Recipe
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map(menuItem => {
                const requirements = calculateRequirements(menuItem.id);
                const totalCost = calculateRecipeCost(menuItem.recipe || []);
                const availability = checkRecipeAvailability(menuItem.recipe || []);
                const canMake = availability.canMake;

                return (
                  <div key={menuItem.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      {/* Menu Item Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg">{menuItem.name}</h4>
                          {menuItem.category && (
                            <span className="inline-block px-2 py-1 mt-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {menuItem.category}
                            </span>
                          )}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          canMake ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {canMake ? 'Available' : 'Out of Stock'}
                        </div>
                      </div>

                      {/* Description */}
                      {menuItem.description && (
                        <p className="text-gray-600 text-sm mb-4">{menuItem.description}</p>
                      )}

                      {/* Recipe Ingredients */}
                      <div className="mb-6">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Ingredients Required:</h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                          {requirements.map((req, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-gray-900">{req.ingredient_name}</span>
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${
                                  req.sufficient ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {req.quantity_required} {req.ingredient_unit}
                                </span>
                                {!req.sufficient && (
                                  <span className="text-xs text-red-500">({req.shortage} short)</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cost and Availability */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600">Recipe Cost</div>
                          <div className="font-semibold text-gray-900">${totalCost.toFixed(2)}</div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-xs text-gray-600">Ingredient Status</div>
                          <div className={`font-semibold ${
                            canMake ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {canMake ? 'All Available' : `${availability.missing.length} Missing`}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditRecipe(menuItem)}
                          className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg"
                        >
                          <FiEdit />
                          Edit Recipe
                        </button>
                        <button
                          onClick={() => setSelectedMenuItem(menuItem)}
                          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg"
                        >
                          <FiEye />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ingredients Tab */}
      {activeTab === 'ingredients' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Ingredients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map(ingredient => {
              const currentStock = parseFloat(ingredient.current_stock) || 0;
              const minimumStock = parseFloat(ingredient.minimum_stock) || 10;
              const stockStatus = currentStock <= minimumStock 
                ? (currentStock === 0 ? 'Out of Stock' : 'Low Stock')
                : 'Adequate';
              
              const stockPercentage = Math.round((currentStock / minimumStock) * 100);
              
              // Find which recipes use this ingredient
              const usedInRecipes = menuItems.filter(menuItem => 
                menuItem.recipe?.some(item => item.ingredient_id === ingredient.id)
              );

              return (
                <div key={ingredient.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{ingredient.name}</h4>
                        <span className="text-sm text-gray-600">{ingredient.category}</span>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        stockStatus === 'Adequate' ? 'bg-green-100 text-green-800' :
                        stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stockStatus}
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Stock</span>
                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">{currentStock}</div>
                          <div className="text-sm text-gray-600">{ingredient.unit}</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                        <div 
                          className={`h-2.5 rounded-full ${
                            stockStatus === 'Out of Stock' ? 'bg-red-500' :
                            stockStatus === 'Low Stock' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0</span>
                        <span>Min: {minimumStock}</span>
                        <span>{minimumStock * 3}</span>
                      </div>
                    </div>

                    {/* Used In Recipes */}
                    <div className="mb-6">
                      <div className="text-sm font-medium text-gray-700 mb-2">Used in Recipes:</div>
                      {usedInRecipes.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Not used in any recipes</p>
                      ) : (
                        <div className="space-y-1">
                          {usedInRecipes.slice(0, 3).map(recipe => {
                            const recipeItem = recipe.recipe.find(r => r.ingredient_id === ingredient.id);
                            const required = parseFloat(recipeItem?.quantity_required) || 0;
                            
                            return (
                              <div key={recipe.id} className="flex justify-between items-center text-sm">
                                <span className="text-gray-900 truncate">{recipe.name}</span>
                                <span className="text-gray-600">{required} {ingredient.unit}</span>
                              </div>
                            );
                          })}
                          {usedInRecipes.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{usedInRecipes.length - 3} more recipes
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (userRole === 'chef') {
                            addIngredientToRecipe(ingredient);
                            setActiveTab('recipes');
                            setShowRecipeForm(true);
                          }
                        }}
                        disabled={userRole !== 'chef'}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                          userRole === 'chef'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        Add to Recipe
                      </button>
                      <button
                        onClick={() => alert(`Update stock for ${ingredient.name}`)}
                        className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                      >
                        Update Stock
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Menu Item Detail Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{selectedMenuItem.name}</h3>
              <button 
                onClick={() => setSelectedMenuItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recipe Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{selectedMenuItem.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Ingredients</p>
                    <p className="font-medium">{selectedMenuItem.recipe?.length || 0}</p>
                  </div>
                </div>
                {selectedMenuItem.description && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{selectedMenuItem.description}</p>
                  </div>
                )}
              </div>

              {/* Ingredients Breakdown */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ingredients Breakdown</h4>
                <div className="space-y-3">
                  {calculateRequirements(selectedMenuItem.id).map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{req.ingredient_name}</div>
                        <div className="text-sm text-gray-500">
                          Available: {req.current_stock} {req.ingredient_unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          req.sufficient ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {req.quantity_required} {req.ingredient_unit}
                        </div>
                        {!req.sufficient && (
                          <div className="text-xs text-red-500">
                            Short: {req.shortage} {req.ingredient_unit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Cost Analysis</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ingredient Cost</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${calculateRecipeCost(selectedMenuItem.recipe || []).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Menu Price</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${parseFloat(selectedMenuItem.price || 0).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit Margin</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedMenuItem.price 
                        ? `${((1 - (calculateRecipeCost(selectedMenuItem.recipe || []) / selectedMenuItem.price)) * 100).toFixed(1)}%`
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className={`text-xl font-bold ${
                      checkRecipeAvailability(selectedMenuItem.recipe || []).canMake 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {checkRecipeAvailability(selectedMenuItem.recipe || []).canMake 
                        ? 'Available' 
                        : 'Limited'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditRecipe(selectedMenuItem);
                    setSelectedMenuItem(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  <FiEdit />
                  Edit Recipe
                </button>
                <button
                  onClick={() => {
                    if (onDeleteRecipe) {
                      onDeleteRecipe(selectedMenuItem.id);
                      setSelectedMenuItem(null);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <FiTrash2 />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeBuilder;