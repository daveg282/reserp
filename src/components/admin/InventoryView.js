import { Plus, Download, AlertCircle } from 'lucide-react';
import InventoryCard from './InventoryCard';
import PageHeader from './PageHeader';

export default function InventoryView({ inventory = [], deleteItem }) {
  const handleAddItem = () => {
    console.log('Add item clicked');
    // Implementation for adding inventory item
  };

  const handleExport = () => {
    console.log('Export clicked');
    // Implementation for export
  };

  const stats = {
    total: inventory.length,
    lowStock: inventory.filter(i => i.lowStock).length,
    outOfStock: inventory.filter(i => i.currentStock === 0).length,
    totalValue: inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0)
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <PageHeader
        title="Inventory Management"
        description={`${stats.total} items • ${stats.lowStock} low stock • ETB ${stats.totalValue.toFixed(2)} total value`}
        actions={[
          {
            icon: Plus,
            label: 'Add Item',
            onClick: handleAddItem,
            variant: 'primary'
          },
          {
            icon: Download,
            label: 'Export',
            onClick: handleExport,
            variant: 'secondary'
          }
        ]}
      />

      {/* Inventory Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Total Items</p>
          <p className="text-lg font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 mb-1">Low Stock</p>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-amber-600">{stats.lowStock}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Out of Stock</p>
          <p className="text-lg font-bold text-red-600">{stats.outOfStock}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1">Total Value</p>
          <p className="text-lg font-bold text-emerald-600">ETB {stats.totalValue.toFixed(2)}</p>
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {inventory.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No inventory items found</h3>
            <p className="text-gray-600">Try adding some items or adjust your search</p>
          </div>
        ) : (
          inventory.map(item => (
            <InventoryCard 
              key={item.id} 
              item={item} 
              deleteItem={deleteItem}
            />
          ))
        )}
      </div>
    </div>
  );
}