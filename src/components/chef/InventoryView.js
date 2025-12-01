import { useTranslation } from 'react-i18next';
import { Package, AlertCircle, DollarSign, Plus, Edit, Trash2, Save, X, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function InventoryView({ 
  inventory = [], 
  categories = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  getLowStockItems,
  getTotalStockValue 
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
    unit: 'pcs',
    cost: 0
  });

  // Calculate stats
  const stats = {
    totalItems: inventory.length,
    lowStock: getLowStockItems ? getLowStockItems().length : inventory.filter(item => item.currentStock <= item.minStock).length,
    stockValue: getTotalStockValue ? getTotalStockValue() : inventory.reduce((sum, item) => sum + (item.currentStock * (item.cost || 0)), 0)
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    if (filter === 'low' && item.currentStock > item.minStock) return false;
    if (filter === 'out' && item.currentStock > 0) return false;
    if (searchQuery) {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  // Units options
  const units = ['pcs', 'kg', 'g', 'L', 'ml', 'box', 'pack'];

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'currentStock' || name === 'minStock' || name === 'cost' 
        ? parseFloat(value) || 0 
        : value
    });
  };

  // Handle add item
  const handleAddItem = () => {
    if (!formData.name.trim()) return;

    const newItem = {
      id: `item_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString()
    };

    if (onAddItem) onAddItem(newItem);
    setIsAdding(false);
    resetForm();
  };

  // Handle update item
  const handleUpdateItem = () => {
    if (!formData.name.trim()) return;

    if (onUpdateItem) onUpdateItem(editingId, formData);
    setEditingId(null);
    resetForm();
  };

  // Handle delete item
  const handleDeleteItem = (id, name) => {
    if (window.confirm(`${t('inventory.confirmDelete')} "${name}"?`)) {
      if (onDeleteItem) onDeleteItem(id);
    }
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category || '',
      currentStock: item.currentStock,
      minStock: item.minStock,
      unit: item.unit || 'pcs',
      cost: item.cost || 0
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      currentStock: 0,
      minStock: 5,
      unit: 'pcs',
      cost: 0
    });
  };

  // Get stock status
  const getStockStatus = (item) => {
    if (item.currentStock === 0) {
      return {
        label: t('inventory.outOfStock'),
        color: 'bg-red-100 text-red-700',
        bgColor: 'bg-red-50'
      };
    }
    if (item.currentStock <= item.minStock) {
      return {
        label: t('inventory.lowStock'),
        color: 'bg-orange-100 text-orange-700',
        bgColor: 'bg-orange-50'
      };
    }
    return {
      label: t('inventory.good'),
      color: 'bg-green-100 text-green-700',
      bgColor: 'bg-green-50'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{t('inventory.title')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('inventory.subtitle', 'Track and manage kitchen inventory')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('inventory.addItem')}</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('inventory.searchPlaceholder', 'Search items...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-gray-700"
          >
            <option value="all">{t('inventory.all')}</option>
            <option value="low">{t('inventory.lowStock')}</option>
            <option value="out">{t('inventory.outOfStock')}</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
          <p className="text-sm text-gray-600">{t('inventory.totalItems')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
          <AlertCircle className="w-8 h-8 text-orange-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
          <p className="text-sm text-gray-600">{t('inventory.lowStock')}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
          <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-900">
            ${stats.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-600">{t('inventory.stockValue')}</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? t('inventory.editItem') : t('inventory.addItem')}
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
                  {t('inventory.itemName')} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('inventory.itemNamePlaceholder', 'Enter item name')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventory.category')}
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('inventory.categoryPlaceholder', 'e.g., Vegetables, Meat')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('inventory.currentStock')}
                  </label>
                  <input
                    type="number"
                    name="currentStock"
                    min="0"
                    value={formData.currentStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('inventory.minStock')}
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    min="0"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventory.unit')}
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('inventory.cost')} ({t('inventory.perUnit')})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    name="cost"
                    min="0"
                    step="0.01"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-full pl-8 pr-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={editingId ? handleUpdateItem : handleAddItem}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? t('inventory.update') : t('inventory.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {t('inventory.item')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {t('inventory.currentStock')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {t('inventory.minStock')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {t('inventory.unit')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {t('inventory.status')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                  {t('inventory.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.length > 0 ? (
                filteredInventory.map((item) => {
                  const status = getStockStatus(item);
                  
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          {item.category && (
                            <p className="text-xs text-gray-600 mt-1">{item.category}</p>
                          )}
                          {item.cost > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              ${item.cost.toFixed(2)} {t('inventory.perUnit')}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 font-medium">{item.currentStock}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{item.minStock}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{item.unit}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className={`h-1.5 rounded-full ${
                              item.currentStock === 0 ? 'bg-red-500' :
                              item.currentStock <= item.minStock ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, (item.currentStock / (item.minStock * 3 || 1)) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title={t('inventory.edit')}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title={t('inventory.delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery || filter !== 'all'
                        ? t('inventory.noResults')
                        : t('inventory.emptyDescription')}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {t('inventory.emptyDescription', 'No inventory items found. Add your first item to get started.')}
                    </p>
                    <button
                      onClick={() => setIsAdding(true)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors inline-flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('inventory.addFirstItem')}
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}