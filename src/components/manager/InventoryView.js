'use client';
import { 
  Plus, Package, AlertCircle, X, DollarSign, 
  Database, Users, BarChart3, ShoppingCart, Filter, ChevronDown 
} from 'lucide-react';

export default function InventoryView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Inventory Management</h3>
        <div className="flex flex-wrap gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Order Supplies</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: '156', icon: Package, color: 'purple', change: '+12' },
          { label: 'Low Stock', value: '8', icon: AlertCircle, color: 'red', change: '-2' },
          { label: 'Out of Stock', value: '3', icon: X, color: 'red', change: '+1' },
          { label: 'Value', value: 'ETB 25,840', icon: DollarSign, color: 'emerald', change: '+5.2%' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Low Stock Items</h4>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
              View All Items →
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Fresh Salmon', category: 'Seafood', current: '5kg', min: '10kg', supplier: 'Ocean Foods' },
              { name: 'Basil Leaves', category: 'Herbs', current: '200g', min: '500g', supplier: 'Fresh Garden' },
              { name: 'Parmesan Cheese', category: 'Dairy', current: '3kg', min: '8kg', supplier: 'Italian Deli' },
              { name: 'Extra Virgin Olive Oil', category: 'Oils', current: '2L', min: '5L', supplier: 'Mediterranean Imports' },
              { name: 'Fresh Truffles', category: 'Gourmet', current: '150g', min: '300g', supplier: 'Truffle Masters' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white border border-red-300 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="text-gray-600">{item.category}</span>
                      <span className="text-red-600 font-medium">Current: {item.current}</span>
                      <span className="text-gray-600">Min: {item.min}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{item.supplier}</p>
                  <button className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>
          <div className="space-y-3">
            {[
              { label: 'Inventory Count', icon: Database, color: 'blue' },
              { label: 'Suppliers List', icon: Users, color: 'purple' },
              { label: 'Waste Tracking', icon: AlertCircle, color: 'red' },
              { label: 'Stock Reports', icon: BarChart3, color: 'emerald' },
              { label: 'Purchase Orders', icon: ShoppingCart, color: 'orange' },
              { label: 'Category Management', icon: Filter, color: 'cyan' },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                    <action.icon className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transform rotate-270" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Recent Inventory Activity</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Date & Time</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Item</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Action</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Quantity</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Staff</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'Today, 14:30', item: 'Ribeye Steak', action: 'Stock In', quantity: '+20kg', staff: 'Michael Chen' },
                { date: 'Today, 11:15', item: 'Fresh Salmon', action: 'Stock Out', quantity: '-5kg', staff: 'Sarah Johnson' },
                { date: 'Yesterday, 19:45', item: 'Pasta', action: 'Stock In', quantity: '+15kg', staff: 'Emma Rodriguez' },
                { date: 'Yesterday, 16:20', item: 'Wine - Cabernet', action: 'Stock In', quantity: '+24 bottles', staff: 'David Kim' },
                { date: 'Dec 1, 09:30', item: 'Cheese Plate', action: 'Adjustment', quantity: '-3 units', staff: 'Lisa Wang' },
              ].map((activity, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 text-sm text-gray-600">{activity.date}</td>
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{activity.item}</p>
                  </td>
                  <td className="py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.action === 'Stock In' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : activity.action === 'Stock Out'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-3">
                    <p className={`font-semibold ${
                      activity.quantity.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {activity.quantity}
                    </p>
                  </td>
                  <td className="py-3">
                    <p className="text-sm text-gray-900">{activity.staff}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}