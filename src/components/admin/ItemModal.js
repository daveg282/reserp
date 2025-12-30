import { useState } from 'react';
import { Save } from 'lucide-react';
import BaseModal from './BaseModal';

export default function ItemModal({ 
  isOpen, 
  onClose, 
  item = null, 
  onSave 
}) {
  const isEdit = !!item;
  
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'Proteins',
    currentStock: item?.currentStock || 0,
    minStock: item?.minStock || 10,
    unit: item?.unit || 'kg',
    cost: item?.cost || 0,
    supplier: item?.supplier || '',
    lastOrder: item?.lastOrder || new Date().toISOString().split('T')[0]
  });

  const categories = [
    'Proteins',
    'Vegetables', 
    'Grains',
    'Oils',
    'Beverages',
    'Dairy',
    'Spices',
    'Others'
  ];

  const units = ['kg', 'L', 'g', 'ml', 'pcs', 'boxes'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: item?.id || Date.now(),
      lowStock: formData.currentStock <= formData.minStock
    });
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name.includes('Stock') || name === 'cost' ? Number(value) : value 
    }));
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Inventory Item' : 'Add Inventory Item'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Chicken Breast"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit *
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock *
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Stock *
            </label>
            <input
              type="number"
              name="minStock"
              value={formData.minStock}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost per Unit (ETB) *
          </label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier *
          </label>
          <input
            type="text"
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Fresh Foods Co."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Order Date
          </label>
          <input
            type="date"
            name="lastOrder"
            value={formData.lastOrder}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Update' : 'Add'} Item</span>
          </button>
        </div>
      </form>
    </BaseModal>
  );
}