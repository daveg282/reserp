'use client';
import { useState, useEffect } from 'react';
import { 
  Package, AlertCircle, DollarSign, TrendingUp, 
  Plus, Search, Filter, Download, RefreshCw,
  Edit, Trash2, ChevronDown, Calendar,
  CheckCircle, XCircle, Clock, BarChart3, TrendingDown,
  X, Save, ArrowUpDown, PackageOpen, Truck
} from 'lucide-react';

// ========== HELPER FUNCTIONS ==========
const getStockStatus = (current, min) => {
  if (current === 0 || current === undefined || current === null) {
    return { label: 'Out of Stock', color: 'red', bg: 'bg-red-100', text: 'text-red-700' };
  }
  if (min === 0 || min === undefined || min === null) {
    if (current <= 5) return { label: 'Low Stock', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700' };
    return { label: 'In Stock', color: 'green', bg: 'bg-green-100', text: 'text-green-700' };
  }
  if (current <= min) return { label: 'Low Stock', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-700' };
  if (current <= min * 2) return { label: 'Moderate', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700' };
  return { label: 'In Stock', color: 'green', bg: 'bg-green-100', text: 'text-green-700' };
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return 'ETB 0.00';
  return `ETB ${parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

// Inventory Modal Component
const InventoryModal = ({ isOpen, onClose, type, title, itemData, onSubmit, suppliers = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: 'kg',
    current_stock: 0,
    minimum_stock: 0,
    cost_per_unit: 0,
    supplier_id: '',
    supplier_name: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize form with item data for editing
  useEffect(() => {
    if (itemData && type === 'edit') {
      console.log('📝 Editing item data:', itemData);
      
      // Find the supplier from the suppliers array
      let supplierId = '';
      let supplierName = '';
      
      // The supplier is already in itemData.supplier (from the table)
      // But we need to find the ID from suppliers array
      if (itemData.supplier && suppliers.length > 0) {
        const foundSupplier = suppliers.find(s => 
          s.name === itemData.supplier || 
          s.id == itemData.supplierCode || 
          s.id == itemData.supplier_id
        );
        
        if (foundSupplier) {
          supplierId = foundSupplier.id;
          supplierName = foundSupplier.name;
        }
      }
      
      setFormData({
        name: itemData.name || '',
        category: itemData.category || '',
        unit: itemData.unit || 'kg',
        current_stock: itemData.current_stock || itemData.stockLevel || 0,
        minimum_stock: itemData.minimum_stock || itemData.minStock || 0,
        cost_per_unit: itemData.cost_per_unit || itemData.unitCost || 0,
        supplier_id: supplierId || itemData.supplierCode || itemData.supplier_id || '',
        supplier_name: supplierName || itemData.supplier || '',
        notes: itemData.notes || ''
      });
    } else if (type === 'add') {
      // Reset form for add
      setFormData({
        name: '',
        category: '',
        unit: 'kg',
        current_stock: 0,
        minimum_stock: 0,
        cost_per_unit: 0,
        supplier_id: '',
        supplier_name: '',
        notes: ''
      });
    }
  }, [itemData, type, suppliers]);

  const handleSupplierChange = (e) => {
    const selectedSupplierId = e.target.value;
    const selectedSupplier = suppliers.find(s => s.id == selectedSupplierId);
    
    setFormData({
      ...formData,
      supplier_id: selectedSupplierId,
      supplier_name: selectedSupplier ? selectedSupplier.name : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('📤 Modal submitting data:', formData);
      
      // Call the onSubmit prop
      await onSubmit(formData);
      
      console.log('✅ Modal: Operation successful');
      onClose();
      
    } catch (err) {
      console.error('🔥 Modal: Submit error:', err);
      const errorMsg = err.message || 'Failed to save item';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-black">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                >
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="piece">piece</option>
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="box">box</option>
                  <option value="pack">pack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.current_stock}
                  onChange={(e) => setFormData({...formData, current_stock: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Stock *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={formData.minimum_stock}
                  onChange={(e) => setFormData({...formData, minimum_stock: parseFloat(e.target.value) || 0})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost per Unit *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">ETB</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={formData.cost_per_unit}
                    onChange={(e) => setFormData({...formData, cost_per_unit: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier (Optional)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.supplier_id}
                onChange={handleSupplierChange}
              >
                <option value="">Select a supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{type === 'add' ? 'Add Item' : 'Update Item'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Stock Adjustment Modal
const StockAdjustmentModal = ({ isOpen, onClose, item, onSubmit }) => {
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity('');
      setReason('');
      setAdjustmentType('add');
    }
  }, [item]);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!quantity || parseFloat(quantity) <= 0) {
    setError('Please enter a valid quantity');
    setLoading(false);
    return;
  }

  try {
    console.log('📤 Stock adjustment data:', {
      adjustmentType,
      quantity: parseFloat(quantity),
      reason
    });
    
    const adjustmentData = {
      quantity: adjustmentType === 'add' ? parseFloat(quantity) : -parseFloat(quantity),
      notes: reason || 'Manual stock adjustment'
    };
    
    await onSubmit(adjustmentData);
    
    console.log('✅ Stock adjustment successful');
    onClose();
  } catch (err) {
    console.error('🔥 Stock adjustment error:', err);
    setError(err.message || 'Failed to update stock');
  } finally {
    setLoading(false);
  }
};

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Adjust Stock: {item.name}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Current Stock</p>
            <p className="text-2xl font-bold text-gray-900">
              {item.stockLevel?.toFixed(3)} {item.unit}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`flex-1 py-3 rounded-lg border transition ${adjustmentType === 'add' ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <div className="flex flex-col items-center">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span>Add Stock</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setAdjustmentType('remove')}
                className={`flex-1 py-3 rounded-lg border transition ${adjustmentType === 'remove' ? 'bg-red-50 border-red-300 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
              >
                <div className="flex flex-col items-center">
                  <TrendingDown className="w-6 h-6 mb-2" />
                  <span>Remove Stock</span>
                </div>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity ({item.unit}) *
              </label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason (Optional)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="">Select reason</option>
                <option value="restock">Restock</option>
                <option value="usage">Usage/Consumption</option>
                <option value="damage">Damage/Loss</option>
                <option value="correction">Stock Correction</option>
                <option value="other">Other</option>
              </select>
            </div>

            {reason === 'other' && (
              <div>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Specify reason"
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Stock</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Main StockManagementView Component
export default function StockManagementView({ 
  inventoryData = [],
  lowStockItems = [],
  stockSummary = {},
  categories = [],
  suppliers = [],
  onRefresh,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onUpdateStock,
  onGenerateReport,
  isLoading = false,
  error = null,
  userRole = 'manager'
}) {
  // Debug props
  console.log('📊 StockManagementView props:');
  console.log('- onAddItem exists:', !!onAddItem);
  console.log('- onEditItem exists:', !!onEditItem);
  console.log('- onDeleteItem exists:', !!onDeleteItem);
  console.log('- inventoryData count:', inventoryData.length);
  console.log('- Sample inventory item:', inventoryData[0]);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'add', // 'add' or 'edit'
    title: '',
    itemId: null,
    itemData: null
  });

  const [stockAdjustModal, setStockAdjustModal] = useState({
    isOpen: false,
    item: null
  });

  // Component states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Filter and sort inventory
  const filteredInventory = inventoryData.filter(item => {
    const name = item.name || '';
    const code = item.code || '';
    const supplier = item.supplier || '';
    const category = item.category || 'Uncategorized';
    const stockLevel = item.stockLevel || 0;
    const minStock = item.minStock || 0;
    
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    const matchesStockFilter = !showLowStockOnly || stockLevel <= minStock;
    
    return matchesSearch && matchesCategory && matchesStockFilter;
  }).sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    const stockA = a.stockLevel || 0;
    const stockB = b.stockLevel || 0;
    const unitCostA = a.unitCost || 0;
    const unitCostB = b.unitCost || 0;
    
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    if (sortBy === 'stock') {
      return sortOrder === 'asc'
        ? stockA - stockB
        : stockB - stockA;
    }
    if (sortBy === 'value') {
      const valueA = stockA * unitCostA;
      const valueB = stockB * unitCostB;
      return sortOrder === 'asc'
        ? valueA - valueB
        : valueB - valueA;
    }
    return 0;
  });

  // Handlers for modals
  const handleAddClick = () => {
    setModalConfig({
      isOpen: true,
      type: 'add',
      title: 'Add New Inventory Item',
      itemId: null,
      itemData: null
    });
  };

  const handleEditClick = (itemId) => {
    console.log('✏️ Edit clicked for item ID:', itemId, 'Type:', typeof itemId);
    console.log('📊 All available items:', inventoryData.map(item => ({id: item.id, name: item.name})));
    
    const itemToEdit = inventoryData.find(item => {
      console.log(`🔍 Comparing: ${item.id} (${typeof item.id}) with ${itemId} (${typeof itemId})`);
      return item.id == itemId; // Use == for loose comparison
    });
    
    if (itemToEdit) {
      console.log('✅ Found item to edit:', {
        id: itemToEdit.id,
        name: itemToEdit.name,
        _original: itemToEdit._original
      });
      
      setModalConfig({
        isOpen: true,
        type: 'edit',
        title: 'Edit Inventory Item',
        itemId: itemId,
        itemData: itemToEdit
      });
    } else {
      console.error('❌ Item not found. Looking for ID:', itemId);
      console.error('❌ Available IDs:', inventoryData.map(item => item.id));
      alert(`Item with ID ${itemId} not found. Please refresh the page.`);
    }
  };

  const handleDeleteClick = async (itemId) => {
    if (confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      if (onDeleteItem) {
        try {
          console.log('🔄 Attempting to delete item ID:', itemId);
          const result = await onDeleteItem(itemId);
          console.log('Delete result from handler:', result);
          
          if (result && result.success) {
            alert('✅ Item deleted successfully!');
            if (onRefresh) onRefresh();
          } else {
            alert(`❌ Failed to delete item: ${result?.message || 'Unknown error'}`);
          }
        } catch (error) {
          console.error('Delete error:', error);
          alert(`❌ Error: ${error.message}`);
        }
      }
    }
  };

  const handleUpdateStockClick = (itemId) => {
    const item = inventoryData.find(item => item.id === itemId);
    if (item) {
      setStockAdjustModal({
        isOpen: true,
        item: item
      });
    }
  };

  // FIXED: Modal submit handler that properly calls the right function
  const handleModalSubmit = async (formData) => {
    console.log('📤 Modal submit called with:', formData);
    console.log('Modal type:', modalConfig.type);
    console.log('Modal itemId:', modalConfig.itemId);
    
    try {
      // SAFE conversion of supplier_id
      const safeFormData = {
        ...formData,
        supplier_id: (() => {
          const id = formData.supplier_id;
          if (id === undefined || id === null || id === '') {
            return null;
          }
          if (typeof id === 'string') {
            const trimmed = id.trim();
            if (trimmed === '') return null;
            const num = parseInt(trimmed);
            return isNaN(num) ? null : num;
          }
          if (typeof id === 'number') {
            return id;
          }
          return null;
        })()
      };
      
      console.log('🔧 Safe form data:', safeFormData);
      
      let result;
      
      if (modalConfig.type === 'add' && onAddItem) {
        console.log('➕ Calling onAddItem...');
        result = await onAddItem(safeFormData);
        console.log('✅ Add result:', result);
      } else if (modalConfig.type === 'edit' && onEditItem) {
        console.log('✏️ Calling onEditItem...');
        result = await onEditItem(modalConfig.itemId, safeFormData);
        console.log('✅ Edit result:', result);
      } else {
        throw new Error('No handler available for this operation');
      }
      
      // Check if result indicates success
      if (result && result.success) {
        console.log('✅ Modal: Operation successful');
        // Refresh the data
        if (onRefresh) {
          await onRefresh();
        }
        // Close modal
        setModalConfig({...modalConfig, isOpen: false});
        return result;
      } else {
        const errorMsg = result?.message || 'Failed to save item';
        console.error('❌ Modal: Operation failed:', errorMsg);
        throw new Error(errorMsg);
      }
      
    } catch (err) {
      console.error('🔥 Modal: Submit error:', err);
      throw err;
    }
  };

  const handleStockAdjustSubmit = async (adjustmentData) => {
    if (onUpdateStock && stockAdjustModal.item) {
      try {
        console.log('📤 Stock adjustment for item:', stockAdjustModal.item.id, adjustmentData);
        const result = await onUpdateStock(stockAdjustModal.item.id, adjustmentData);
        if (result && result.success) {
          // Refresh data
          if (onRefresh) await onRefresh();
          setStockAdjustModal({...stockAdjustModal, isOpen: false});
        } else {
          alert(result?.message || 'Failed to update stock');
        }
      } catch (error) {
        alert(error.message || 'Failed to update stock');
      }
    }
  };

  // Helper functions
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id).filter(Boolean));
    }
  };

  // Normalize categories
  const normalizedCategories = Array.isArray(categories) 
    ? categories.map(cat => {
        if (typeof cat === 'string') {
          return { id: cat.toLowerCase().replace(/\s+/g, '-'), name: cat };
        }
        return cat;
      })
    : [];

  return (
    <>
      {/* Modals */}
      <InventoryModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({...modalConfig, isOpen: false})}
        type={modalConfig.type}
        title={modalConfig.title}
        itemData={modalConfig.itemData}
        onSubmit={handleModalSubmit}
          suppliers={suppliers}
      />

      <StockAdjustmentModal
        isOpen={stockAdjustModal.isOpen}
        onClose={() => setStockAdjustModal({...stockAdjustModal, isOpen: false})}
        item={stockAdjustModal.item}
        onSubmit={handleStockAdjustSubmit}
      />

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Stock Management</h3>
            <p className="text-gray-600 mt-1">Manage inventory items, track stock levels, and monitor usage</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddClick}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
            
            <button
              onClick={() => onRefresh && onRefresh()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-purple-50">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600">
                +{stockSummary?.newItemsThisMonth || 0}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stockSummary?.totalItems || inventoryData.length}
            </p>
            <p className="text-sm text-gray-600">Total Items</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-red-50">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-sm font-medium text-red-600">
                {stockSummary?.lowStockCount || lowStockItems.length}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stockSummary?.lowStockValue ? formatCurrency(stockSummary.lowStockValue) : '—'}
            </p>
            <p className="text-sm text-gray-600">Low Stock Value</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-emerald-50">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-medium text-emerald-600">
                {stockSummary?.totalValueChange || '+5.2%'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stockSummary?.totalValue ? formatCurrency(stockSummary.totalValue) : '—'}
            </p>
            <p className="text-sm text-gray-600">Total Inventory Value</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <span className={`text-sm font-medium ${(stockSummary?.turnoverRate || 0) > 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stockSummary?.turnoverRate ? `${stockSummary.turnoverRate}x` : '—'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stockSummary?.turnoverDays ? `${stockSummary.turnoverDays}d` : '—'}
            </p>
            <p className="text-sm text-gray-600">Turnover Days</p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items by name, code, or supplier..."
                className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                className="border border-gray-300 rounded-xl text-black px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {normalizedCategories.map(cat => (
                  <option key={cat.id || cat} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowLowStockOnly(!showLowStockOnly)}
                className={`px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition text-black ${
                  showLowStockOnly 
                    ? 'bg-orange-100 text-orange-700 border border-orange-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                <span>Low Stock Only</span>
              </button>

              <select
                className="border border-gray-300 rounded-xl text-black px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="stock">Sort by Stock Level</option>
                <option value="value">Sort by Value</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 text-black"
              >
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </button>
            </div>
          </div>

          {/* Bulk Actions - REMOVED */}
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-black"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Item</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Stock Level</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Unit Cost</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Total Value</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Supplier</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Last Updated</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center">
                      <div className="flex justify-center">
                        <RefreshCw className="w-6 h-6 text-gray-400 animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500">
                      {searchQuery || selectedCategory !== 'all' || showLowStockOnly
                        ? 'No items match your filters'
                        : 'No inventory items found'}
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const stockLevel = item.stockLevel || 0;
                    const minStock = item.minStock || 0;
                    const unitCost = item.unitCost || 0;
                    const totalValue = stockLevel * unitCost;
                    const stockStatus = getStockStatus(stockLevel, minStock);
                    
                    return (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stockStatus.bg}`}>
                              <Package className={`w-5 h-5 ${stockStatus.text}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.name || 'Unnamed Item'}</p>
                              <p className="text-xs text-gray-500">{item.code || `ID: ${item.id}`}</p>
                            </div>
                          </div>
                        </td>
                       
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {stockLevel.toFixed(2)} {item.unit || 'unit'}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`text-xs font-medium ${stockStatus.text}`}>
                                {stockStatus.label}
                              </span>
                              {minStock > 0 && (
                                <span className="text-xs text-gray-500">
                                  (Min: {minStock.toFixed(2)})
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900 font-medium">{formatCurrency(unitCost)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900 font-bold">{formatCurrency(totalValue)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900">{item.supplier || '—'}</p>
                  
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-600">
                            {item.lastUpdated ? new Date(item.lastUpdated).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : '—'}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditClick(item.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStockClick(item.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Update Stock"
                            >
                              <TrendingUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}