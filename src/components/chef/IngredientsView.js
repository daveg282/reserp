'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  FiFilter, FiSearch, FiRefreshCw,
  FiEye, FiEdit, FiTrash2, FiSave,
  FiX, FiPackage
} from 'react-icons/fi';
import {
  FaExclamationTriangle, FaClipboardList
} from 'react-icons/fa';

const IngredientsView = ({
  ingredients = [], // From chefInventoryAPI.getIngredients()
  menuItems = [], // From chefInventoryAPI.getMenuItems() (includes recipes)
  isLoading = false,
  error = null,
  onRefresh,
  userRole = 'chef',
  onSaveRecipe, // For adding/updating recipes
  onUpdateRecipe,
  onDeleteRecipe
}) => {
  const { t } = useTranslation('chef');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeForm, setRecipeForm] = useState({
    menuItemId: null,
    ingredients: [] // Only ingredients array for recipe
  });
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  
  // Extract unique categories from menuItems
  const categories = menuItems.reduce((acc, item) => {
    if (item.category && !acc.includes(item.category)) {
      acc.push(item.category);
    }
    return acc;
  }, []).sort();

  // Filter menu items based on search and category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === 'all' || 
      item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

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

  // Save recipe (only ingredients)
  const handleSaveRecipe = () => {
    if (recipeForm.ingredients.length === 0) {
      alert('Please add at least one ingredient to the recipe');
      return;
    }

    if (onSaveRecipe) {
      // Only pass the ingredients data, not menu item details
      onSaveRecipe({
        menuItemId: recipeForm.menuItemId,
        ingredients: recipeForm.ingredients
      });
      setRecipeForm({
        menuItemId: null,
        ingredients: []
      });
      setShowRecipeForm(false);
      setEditingRecipe(null);
    }
  };

  // Edit recipe - only open the ingredients editor
  const handleEditRecipe = (menuItem) => {
    setRecipeForm({
      menuItemId: menuItem.id,
      ingredients: menuItem.recipe || []
    });
    setEditingRecipe(menuItem.id);
    setShowRecipeForm(true);
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

  // Get menu items organized by category
  const getMenuItemsByCategory = () => {
    const itemsByCategory = {};
    
    // Initialize categories
    categories.forEach(category => {
      itemsByCategory[category] = [];
    });
    
    // Add uncategorized section
    itemsByCategory['Uncategorized'] = [];
    
    // Sort menu items into categories
    menuItems.forEach(item => {
      if (item.category) {
        if (itemsByCategory[item.category]) {
          itemsByCategory[item.category].push(item);
        } else {
          itemsByCategory[item.category] = [item];
        }
      } else {
        itemsByCategory['Uncategorized'].push(item);
      }
    });
    
    // Filter out empty categories
    const result = {};
    Object.keys(itemsByCategory).forEach(category => {
      if (itemsByCategory[category].length > 0) {
        result[category] = itemsByCategory[category];
      }
    });
    
    return result;
  };

  const menuItemsByCategory = getMenuItemsByCategory();

  // Combined loading state
  const combinedLoading = isLoading;

  if (combinedLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center py-8 md:py-12 bg-white rounded-xl border w-full max-w-md mx-auto">
          <div className="flex justify-center mb-3 md:mb-4">
            <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
          <p className="text-sm md:text-base text-gray-600">Loading recipes and ingredients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-8 text-center max-w-lg w-full mx-auto">
          <FaExclamationTriangle className="w-8 h-8 md:w-12 md:h-12 text-red-400 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-semibold text-red-800 mb-2">Failed to Load Data</h3>
          <p className="text-xs md:text-sm text-red-600 mb-3 md:mb-4 break-words">{error}</p>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-medium mx-auto text-sm md:text-base"
          >
            <FiRefreshCw className="w-3 h-3 md:w-4 md:h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Recipe Management</h1>
          <p className="text-xs md:text-sm text-gray-600 mt-0.5 md:mt-1">Manage ingredient recipes for menu items</p>
        </div>
        <div className="flex gap-2 md:gap-3 w-full lg:w-auto">
          <button
            onClick={onRefresh}
            disabled={combinedLoading}
            className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 md:gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl disabled:opacity-50 text-sm md:text-base"
          >
            <FiRefreshCw className={`w-3 h-3 md:w-4 md:h-4 ${combinedLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 md:w-4 md:h-4" />
              <input
                type="text"
                placeholder="Search menu items by name, description, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-1.5 md:py-2 border text-sm md:text-base text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-2 md:px-3 py-1.5 md:py-2 border border-gray-300 text-sm md:text-base text-black rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Menu Items Grid - Organized by Category */}
      {filteredMenuItems.length === 0 ? (
        <div className="text-center py-8 md:py-12 bg-white rounded-lg md:rounded-xl border border-gray-200">
          <FaClipboardList className="w-8 h-8 md:w-12 md:h-12 text-gray-300 mx-auto mb-3 md:mb-4" />
          <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-1 md:mb-2">No Menu Items Found</h3>
          <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">No menu items available to manage recipes</p>
        </div>
      ) : (
        <div className="space-y-6 md:space-y-8">
          {Object.keys(menuItemsByCategory).map(category => {
            const categoryItems = menuItemsByCategory[category];
            const filteredCategoryItems = categoryItems.filter(item => {
              const matchesSearch = 
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchQuery.toLowerCase());
              
              const matchesCategoryFilter = 
                categoryFilter === 'all' || 
                item.category === categoryFilter;
              
              return matchesSearch && matchesCategoryFilter;
            });

            if (filteredCategoryItems.length === 0) return null;

            return (
              <div key={category} className="space-y-3 md:space-y-4">
                {/* Category Header */}
                <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{category}</h3>
                    <p className="text-xs md:text-sm text-gray-600">
                      {filteredCategoryItems.length} {filteredCategoryItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500">
                    Manage recipes for items in this category
                  </div>
                </div>

                {/* Menu Items Grid for this Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  {filteredCategoryItems.map(menuItem => {
                    const requirements = calculateRequirements(menuItem.id);
                    const availability = checkRecipeAvailability(menuItem.recipe || []);
                    const canMake = availability.canMake;

                    return (
                      <div key={menuItem.id} className="bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-3 md:p-4">
                          {/* Menu Item Header */}
                          <div className="flex justify-between items-start mb-3 md:mb-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{menuItem.name}</h4>
                              <div className="mt-1 flex flex-wrap items-center gap-1 md:gap-2">
                                <span className="text-xs text-gray-600 truncate">Category: {menuItem.category}</span>
                                <span className={`text-[10px] md:text-xs font-semibold px-1.5 md:px-2 py-0.5 rounded-full ${
                                  canMake ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {canMake ? 'Available' : 'Out of Stock'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          {menuItem.description && (
                            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 line-clamp-2">{menuItem.description}</p>
                          )}

                          {/* Recipe Ingredients Summary */}
                          <div className="mb-4 md:mb-5">
                            <h5 className="text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">Recipe Ingredients:</h5>
                            <div className="space-y-1.5 md:space-y-2 max-h-32 overflow-y-auto pr-1 md:pr-2">
                              {requirements.slice(0, 3).map((req, idx) => (
                                <div key={idx} className="flex justify-between items-center text-xs md:text-sm">
                                  <span className="text-gray-900 truncate mr-2">{req.ingredient_name}</span>
                                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                                    <span className={`font-medium ${
                                      req.sufficient ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {req.quantity_required} {req.ingredient_unit}
                                    </span>
                                    {!req.sufficient && (
                                      <span className="text-[10px] md:text-xs text-red-500">({req.shortage} short)</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {requirements.length > 3 && (
                                <div className="text-[10px] md:text-xs text-gray-500 text-center">
                                  +{requirements.length - 3} more ingredients
                                </div>
                              )}
                              {requirements.length === 0 && (
                                <div className="text-center text-gray-500 text-xs md:text-sm py-1 md:py-2">
                                  No recipe defined
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Availability Status */}
                          <div className="mb-4 md:mb-5 p-2 md:p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="text-[10px] md:text-xs text-gray-600">Ingredients Status</div>
                                <div className={`text-xs md:text-sm font-semibold ${
                                  canMake ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  {canMake ? 'All Available' : `${availability.missing.length} Missing`}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-[10px] md:text-xs text-gray-600">Total Ingredients</div>
                                <div className="text-xs md:text-sm font-semibold text-gray-900">
                                  {requirements.length}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditRecipe(menuItem)}
                              className="flex-1 flex items-center justify-center gap-1 md:gap-2 bg-orange-500 hover:bg-orange-600 text-white py-1.5 md:py-2 rounded-lg text-xs md:text-sm"
                            >
                              <FiEdit className="w-3 h-3 md:w-4 md:h-4" />
                              Edit Recipe
                            </button>
                            <button
                              onClick={() => setSelectedMenuItem(menuItem)}
                              className="flex-1 flex items-center text-black justify-center gap-1 md:gap-2 border border-gray-300 hover:bg-gray-50 py-1.5 md:py-2 rounded-lg text-xs md:text-sm"
                            >
                              <FiEye className="w-3 h-3 md:w-4 md:h-4" />
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recipe Form Modal - ONLY FOR INGREDIENTS */}
      {showRecipeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                {editingRecipe ? 'Edit Recipe Ingredients' : 'Add Recipe Ingredients'}
              </h3>
              <button 
                onClick={() => {
                  setShowRecipeForm(false);
                  setEditingRecipe(null);
                  setRecipeForm({ menuItemId: null, ingredients: [] });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Current Menu Item Info (Read Only) */}
              {editingRecipe && (
                <div className="p-3 md:p-4 bg-blue-50 rounded-lg mb-3 md:mb-4">
                  <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2">Menu Item:</h4>
                  <div className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                    <div>
                      <span className="text-gray-600">Name:</span>
                      <p className="font-medium truncate">{menuItems.find(m => m.id === editingRecipe)?.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium truncate">{menuItems.find(m => m.id === editingRecipe)?.category}</p>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-2">
                    Note: You can only edit the ingredients for this recipe. Menu details are managed separately.
                  </p>
                </div>
              )}

              {/* Ingredient Selector */}
              <div className='text-black'>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">
                  Add Ingredients (from Inventory)
                </label>
                <div className="mb-3 md:mb-4 p-2 md:p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-1.5 md:gap-2 text-blue-700 text-xs md:text-sm">
                    <FiPackage className="w-3 h-3 md:w-4 md:h-4" />
                    <span>Select ingredients from your inventory to add to this recipe</span>
                  </div>
                </div>
                
                {ingredients.length === 0 ? (
                  <div className="p-3 md:p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs md:text-sm text-gray-600">No ingredients found in inventory.</p>
                    <p className="text-[10px] md:text-xs text-gray-500 mt-1">Add ingredients to inventory first.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-6 max-h-48 md:max-h-60 overflow-y-auto p-1">
                    {ingredients.map(ingredient => (
                      <button
                        key={ingredient.id}
                        onClick={() => addIngredientToRecipe(ingredient)}
                        className="flex items-center justify-between p-2 md:p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="text-left min-w-0 flex-1">
                          <div className="font-medium text-xs md:text-sm text-gray-900 truncate">{ingredient.name}</div>
                          <div className="text-[10px] md:text-xs text-gray-500">
                            {parseFloat(ingredient.current_stock) || 0} {ingredient.unit}
                          </div>
                        </div>
                        <FiPackage className="w-3 h-3 md:w-4 md:h-4 text-gray-400 ml-1 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Ingredients */}
              {recipeForm.ingredients.length > 0 && (
                <div>
                  <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">Recipe Ingredients</h4>
                  <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-60 overflow-y-auto pr-1 md:pr-2">
                    {recipeForm.ingredients.map((item, index) => {
                      const ingredient = ingredients.find(i => i.id === item.ingredient_id);
                      const currentStock = parseFloat(ingredient?.current_stock) || 0;
                      const required = parseFloat(item.quantity_required) || 0;
                      const sufficient = currentStock >= required;

                      return (
                        <div key={item.ingredient_id} className="flex flex-wrap items-center gap-2 p-2 md:p-3 bg-gray-50 text-black rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-xs md:text-sm text-gray-900 truncate">{item.ingredient_name}</div>
                            <div className="text-[10px] md:text-xs text-gray-500">
                              {currentStock} {ingredient?.unit} available
                              {!sufficient && (
                                <span className="ml-1 text-red-600">
                                  (Shortage: {required - currentStock} {ingredient?.unit})
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 md:gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.001"
                              value={item.quantity_required}
                              onChange={(e) => updateIngredientQuantity(item.ingredient_id, e.target.value)}
                              className="w-16 md:w-20 px-1 md:px-2 py-0.5 md:py-1 border border-gray-300 rounded text-center text-xs md:text-sm"
                            />
                            <span className="text-[10px] md:text-xs text-gray-600">{ingredient?.unit}</span>
                          </div>
                          
                          <button
                            onClick={() => removeIngredientFromRecipe(item.ingredient_id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Recipe Summary */}
                  <div className="mt-3 md:mt-4 p-2 md:p-3 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-[10px] md:text-xs text-black">Total Ingredients</div>
                        <div className="text-sm md:text-base font-semibold text-black">{recipeForm.ingredients.length}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] md:text-xs text-gray-600">Availability</div>
                        <div className={`text-xs md:text-sm font-semibold ${
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
              <div className="flex justify-end gap-2 md:gap-3 pt-4 md:pt-6 border-t">
                <button
                  onClick={() => {
                    setShowRecipeForm(false);
                    setEditingRecipe(null);
                    setRecipeForm({ menuItemId: null, ingredients: [] });
                  }}
                  className="px-3 md:px-4 py-1.5 md:py-2 border text-xs md:text-sm text-black border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRecipe}
                  disabled={recipeForm.ingredients.length === 0}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs md:text-sm"
                >
                  <FiSave className="w-3 h-3 md:w-4 md:h-4" />
                  {editingRecipe ? 'Update Recipe' : 'Save Recipe'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Detail Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
          <div className="bg-white rounded-xl p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 truncate pr-2">{selectedMenuItem.name}</h3>
              <button 
                onClick={() => setSelectedMenuItem(null)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <FiX className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">Menu Item Information</h4>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500">Category</p>
                    <p className="text-xs md:text-sm font-medium text-black truncate">{selectedMenuItem.category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500">Menu Price</p>
                    <p className="text-xs md:text-sm font-medium text-black">${(selectedMenuItem.price || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500">Total Ingredients</p>
                    <p className="text-xs md:text-sm font-medium text-black">{selectedMenuItem.recipe?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500">Status</p>
                    <p className={`text-xs md:text-sm font-medium ${
                      selectedMenuItem.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedMenuItem.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                {selectedMenuItem.description && (
                  <div className="mt-3 md:mt-4">
                    <p className="text-[10px] md:text-xs text-gray-500">Description</p>
                    <p className="text-xs md:text-sm text-gray-700">{selectedMenuItem.description}</p>
                  </div>
                )}
              </div>

              {/* Ingredients Breakdown */}
              <div>
                <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">Ingredients Breakdown</h4>
                <div className="space-y-2 md:space-y-3 max-h-48 md:max-h-60 overflow-y-auto pr-1 md:pr-2">
                  {calculateRequirements(selectedMenuItem.id).map((req, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 md:p-3 border border-gray-200 rounded-lg">
                      <div className="min-w-0 flex-1">
                        <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{req.ingredient_name}</div>
                        <div className="text-[10px] md:text-xs text-gray-500">
                          Available: {req.current_stock} {req.ingredient_unit}
                        </div>
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <div className={`text-xs md:text-sm font-bold ${
                          req.sufficient ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {req.quantity_required} {req.ingredient_unit}
                        </div>
                        {!req.sufficient && (
                          <div className="text-[10px] text-red-500">
                            Short: {req.shortage} {req.ingredient_unit}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 md:gap-3 pt-4 md:pt-6 border-t">
                <button
                  onClick={() => setSelectedMenuItem(null)}
                  className="px-3 md:px-4 py-1.5 md:py-2 border text-xs md:text-sm text-black border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleEditRecipe(selectedMenuItem);
                    setSelectedMenuItem(null);
                  }}
                  className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xs md:text-sm"
                >
                  <FiEdit className="w-3 h-3 md:w-4 md:h-4" />
                  Edit Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientsView;