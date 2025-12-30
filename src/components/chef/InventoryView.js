import { 
  Package, 
  AlertCircle, 
  DollarSign, 
  Plus, 
  Search, 
  Filter, 
  Eye,
  RefreshCw
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function InventoryView({ 
  inventory = [], 
  stats = {},
  isLoading = false,
  error = null,
  onRefresh,
  userRole = 'chef',
  onAddItem,
  onUpdateItem,
  onDeleteItem
}) {
  const { t } = useTranslation('chef');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Check if user has write permissions
  const canWrite = ['admin', 'manager'].includes(userRole);
  const canView = ['admin', 'manager', 'chef'].includes(userRole);

  if (!canView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to view inventory.</p>
        </div>
      </div>
    );
  }

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = searchQuery 
      ? item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    if (filter === 'low') return item.current_stock <= item.minimum_stock && item.current_stock > 0;
    if (filter === 'out') return item.current_stock === 0;
    if (filter === 'good') return item.current_stock > item.minimum_stock;
    
    return matchesSearch;
  });

  // Get stock status
  const getStockStatus = (item) => {
    if (item.current_stock === 0) {
      return {
        label: t('inventory.outOfStock'),
        color: 'bg-red-100 text-red-700',
        bgColor: 'bg-red-50',
        icon: '🔴'
      };
    }
    if (item.current_stock <= item.minimum_stock) {
      return {
        label: t('inventory.lowStock'),
        color: 'bg-orange-100 text-orange-700',
        bgColor: 'bg-orange-50',
        icon: '🟡'
      };
    }
    return {
      label: t('inventory.good'),
      color: 'bg-green-100 text-green-700',
      bgColor: 'bg-green-50',
      icon: '🟢'
    };
  };

  // Calculate stock percentage
  const getStockPercentage = (item) => {
    const maxStock = Math.max(item.minimum_stock * 3, item.current_stock);
    return Math.min(100, (item.current_stock / maxStock) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-lg font-semibold text-red-800">Error Loading Inventory</h3>
        </div>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
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
          <h3 className="text-xl font-bold text-gray-900">{t('inventory.title')}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {canWrite 
              ? 'Manage and track kitchen inventory'
              : 'View current inventory levels'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onRefresh}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium flex items-center space-x-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          
          {canWrite && (
            <button 
              onClick={onAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalItems || 0}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.lowStock || 0}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.outOfStock || 0}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${stats.totalValue ? stats.totalValue.toLocaleString(undefined, { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                }) : '0.00'}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory items..."
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
            <option value="all">All Items</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
            <option value="good">Good Stock</option>
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

      {/* Inventory Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => {
              const status = getStockStatus(item);
              const stockPercentage = getStockPercentage(item);
              
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-lg truncate">{item.name}</h4>
                        {item.category && (
                          <span className="text-sm text-gray-600 mt-1 block">{item.category}</span>
                        )}
                      </div>
                      
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Current Stock</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{item.current_stock}</div>
                          <div className="text-sm text-gray-600">{item.unit}</div>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className={`h-2.5 rounded-full ${
                            item.current_stock === 0 ? 'bg-red-500' :
                            item.current_stock <= item.minimum_stock ? 'bg-orange-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>Min: {item.minimum_stock}</span>
                        <span>{Math.round(item.minimum_stock * 3)}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">Min Stock</p>
                        <p className="font-semibold text-gray-900">{item.minimum_stock} {item.unit}</p>
                      </div>
                      
                      {item.cost_per_unit > 0 && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600">Cost</p>
                          <p className="font-semibold text-gray-900">
                            ${item.cost_per_unit.toFixed(2)} / {item.unit}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || filter !== 'all' 
                  ? 'No items found'
                  : 'No inventory items'}
              </h4>
              <p className="text-gray-600">
                {searchQuery || filter !== 'all' 
                  ? 'Try adjusting your search or filter'
                  : 'Inventory items will appear here'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Inventory List View */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Item
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Min Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
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
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">{item.current_stock}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{item.minimum_stock}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{item.unit}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.icon} {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {searchQuery || filter !== 'all'
                          ? 'No items found'
                          : 'No inventory items'}
                      </h3>
                      <p className="text-gray-600">
                        {searchQuery || filter !== 'all'
                          ? 'Try adjusting your search or filter'
                          : 'Inventory items will appear here'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}