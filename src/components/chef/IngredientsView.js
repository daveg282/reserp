import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X, Search, Filter, Package, TrendingUp, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function IngredientsView({ 
  inventory = [],
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
  updateInventoryItem 
}) {
  const { t } = useTranslation('chef');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    currentStock: 0,
    minStock: 5,
    unit: 'kg',
    costPerUnit: 0
  });

  // Categories for organization
  const categories = [
    'Vegetables', 'Meat', 'Dairy', 'Spices', 
    'Grains', 'Fruits', 'Beverages', 'Other'
  ];

  // Units options
  const units = ['kg', 'g', 'L', 'ml', 'pcs', 'box', 'pack', 'bunch'];

  // Filter ingredients
  const filteredIngredients = inventory.filter(item => {
    const matchesSearch = searchQuery 
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    if (filter === 'low') return item.currentStock <= item.minStock && item.currentStock > 0;
    if (filter === 'out') return item.currentStock === 0;
    if (filter === 'good') return item.currentStock > item.minStock;
    
    return matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(item => item.currentStock <= item.minStock && item.currentStock > 0).length,
    outOfStock: inventory.filter(item => item.currentStock === 0).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * (item.costPerUnit || 0)), 0)
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'currentStock' || name === 'minStock' || name === 'costPerUnit' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  // Handle add ingredient
  const handleAddIngredient = () => {
    if (!formData.name.trim()) return;

    const newIngredient = {
      id: `ingredient_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };

    if (onAddIngredient) onAddIngredient(newIngredient);
    setIsAdding(false);
    resetForm();
  };

  // Handle update ingredient
  const handleUpdateIngredient = () => {
    if (!formData.name.trim()) return;

    const updatedData = {
      ...formData,
      lastUpdated: new Date().toISOString()
    };

    if (onUpdateIngredient) onUpdateIngredient(editingId, updatedData);
    setEditingId(null);
    resetForm();
  };

  // Handle delete ingredient
  const handleDeleteIngredient = (id, name) => {
    if (window.confirm(`${t('ingredients.confirmDelete')} "${name}"?`)) {
      if (onDeleteIngredient) onDeleteIngredient(id);
    }
  };

  // Handle edit ingredient
  const handleEditIngredient = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category || '',
      currentStock: item.currentStock,
      minStock: item.minStock,
      unit: item.unit || 'kg',
      costPerUnit: item.costPerUnit || 0
    });
  };

  // Handle quick restock
  const handleQuickRestock = (item, amount) => {
    if (updateInventoryItem) {
      updateInventoryItem(item.id, { 
        currentStock: item.currentStock + amount,
        lastUpdated: new Date().toISOString()
      });
    }
  };

  // Handle bulk restock
  const handleBulkRestock = (amount) => {
    const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);
    lowStockItems.forEach(item => {
      if (updateInventoryItem) {
        updateInventoryItem(item.id, { 
          currentStock: Math.max(item.minStock * 2, item.currentStock + amount),
          lastUpdated: new Date().toISOString()
        });
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: 0,
      minStock: 5,
      unit: 'kg',
      costPerUnit: 0
    });
  };

  // Get stock status
  const getStockStatus = (item) => {
    if (item.currentStock === 0) {
      return {
        label: t('ingredients.outOfStock'),
        color: 'bg-red-100 text-red-700',
        progressColor: 'bg-red-500',
        icon: '🚫'
      };
    }
    if (item.currentStock <= item.minStock) {
      return {
        label: t('ingredients.lowStock'),
        color: 'bg-orange-100 text-orange-700',
        progressColor: 'bg-orange-500',
        icon: '⚠️'
      };
    }
    return {
      label: t('ingredients.goodStock'),
      color: 'bg-green-100 text-green-700',
      progressColor: 'bg-green-500',
      icon: '✅'
    };
  };

  // Calculate stock percentage
  const getStockPercentage = (item) => {
    const maxStock = Math.max(item.minStock * 3, item.currentStock);
    return Math.min(100, (item.currentStock / maxStock) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t('ingredients.title')}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {t('ingredients.subtitle', 'Manage and track kitchen ingredients')}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleBulkRestock(10)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('ingredients.bulkRestock')}</span>
          </button>
          
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('ingredients.addIngredient')}</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('ingredients.searchPlaceholder', 'Search ingredients...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700"
          >
            <option value="all">{t('ingredients.all')}</option>
            <option value="low">{t('ingredients.lowStock')}</option>
            <option value="out">{t('ingredients.outOfStock')}</option>
            <option value="good">{t('ingredients.goodStock')}</option>
          </select>
          
          <select
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700"
            onChange={(e) => setFilter(e.target.value === 'all' ? 'all' : e.target.value)}
          >
            <option value="all">{t('ingredients.allCategories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          {(searchQuery || filter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="px-4 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              {t('ingredients.clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('ingredients.total')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('ingredients.lowStock')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStock}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('ingredients.outOfStock')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.outOfStock}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <span className="text-2xl">🚫</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('ingredients.totalValue')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? t('ingredients.editIngredient') : t('ingredients.addIngredient')}
            </h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ingredients.name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder={t('ingredients.namePlaceholder', 'e.g., Tomatoes, Chicken Breast')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ingredients.category')}
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">{t('ingredients.selectCategory')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ingredients.currentStock')}
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    min="0"
                    step="0.1"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('ingredients.minStock')}
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    min="0"
                    step="0.1"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ingredients.unit')}
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('ingredients.costPerUnit')}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="costPerUnit"
                    min="0"
                    step="0.01"
                    value={formData.costPerUnit}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={editingId ? handleUpdateIngredient : handleAddIngredient}
                  disabled={!formData.name.trim()}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? t('ingredients.update') : t('ingredients.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ingredients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIngredients.length > 0 ? (
          filteredIngredients.map(item => {
            const status = getStockStatus(item);
            const stockPercentage = getStockPercentage(item);
            
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.name}</h4>
                      {item.category && (
                        <span className="text-sm text-gray-600 mt-1">{item.category}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditIngredient(item)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('ingredients.edit')}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteIngredient(item.id, item.name)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title={t('ingredients.delete')}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                      <span className="mr-1">{status.icon}</span>
                      {status.label}
                    </span>
                    
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{item.currentStock}</div>
                      <div className="text-sm text-gray-600">{item.unit}</div>
                    </div>
                  </div>

                  {/* Stock Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{t('ingredients.stockLevel')}</span>
                      <span className="font-semibold text-black">
                        {item.currentStock} / {item.minStock} {t('ingredients.min')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${status.progressColor}`}
                        style={{ width: `${stockPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">{t('ingredients.minStock')}</p>
                      <p className="font-semibold text-gray-900">{item.minStock} {item.unit}</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-600">{t('ingredients.costPerUnit')}</p>
                      <p className="font-semibold text-gray-900">
                        ${(item.costPerUnit || 0).toFixed(2)} / {item.unit}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickRestock(item, 5)}
                        className="flex-1 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        +5 {item.unit}
                      </button>
                      <button
                        onClick={() => handleQuickRestock(item, 10)}
                        className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        +10 {item.unit}
                      </button>
                      <button
                        onClick={() => handleQuickRestock(item, item.minStock)}
                        className="flex-1 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        Min
                      </button>
                    </div>
                    
                    <button
                      onClick={() => {
                        const amount = prompt(
                          `${t('ingredients.enterAmount', 'Enter restock amount for')} ${item.name}:`,
                          item.minStock.toString()
                        );
                        if (amount && !isNaN(amount)) {
                          handleQuickRestock(item, parseFloat(amount));
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors"
                    >
                      {t('ingredients.customRestock', 'Custom Restock')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              {searchQuery || filter !== 'all' 
                ? t('ingredients.noResultsTitle', 'No ingredients found')
                : t('ingredients.emptyTitle', 'No ingredients yet')}
            </h4>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchQuery || filter !== 'all' 
                ? t('ingredients.noResultsDesc', 'Try adjusting your search or filter to find what you\'re looking for.')
                : t('ingredients.emptyDesc', 'Start by adding your first ingredient to track inventory.')}
            </p>
            {(!searchQuery && filter === 'all') && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors inline-flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('ingredients.addFirstIngredient', 'Add First Ingredient')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bulk Actions Footer */}
      {filteredIngredients.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="font-semibold text-gray-900">{t('ingredients.bulkActions', 'Bulk Actions')}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {t('ingredients.bulkActionsDesc', 'Perform actions on multiple ingredients at once')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (window.confirm(t('ingredients.confirmBulkRestock', 'Restock all low-stock items to their minimum levels?'))) {
                    handleBulkRestock(0);
                  }
                }}
                className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg text-sm transition-colors flex items-center"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {t('ingredients.restockAllLow', 'Restock All Low Stock')}
              </button>
              
              <button
                onClick={() => {
                  const exportData = JSON.stringify(inventory, null, 2);
                  const blob = new Blob([exportData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `ingredients_${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
                className="px-4 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg text-sm transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('ingredients.exportData', 'Export Data')}
              </button>
            </div>
          </div>
          
          {stats.lowStock > 0 && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start">
                <span className="text-amber-500 mr-3">⚠️</span>
                <div>
                  <p className="font-medium text-amber-800">
                    {t('ingredients.lowStockAlert', 'Low Stock Alert')}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    {t('ingredients.lowStockCount', 'You have {count} items running low on stock. Consider restocking soon.', { count: stats.lowStock })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}