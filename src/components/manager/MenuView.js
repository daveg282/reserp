'use client';
import { 
  Plus, Download, Printer, Calendar, DollarSign, Package, 
  X, Utensils, Eye, Edit, ChevronDown, BarChart3 
} from 'lucide-react';

export default function MenuView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Menu Management</h3>
          <p className="text-gray-600 mt-1">Add and manage menu items, categories, and pricing</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Menu</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Add New Menu Item</h4>
          
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Pasta Carbonara"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                  <option value="">Select Category</option>
                  <option value="appetizers">Appetizers</option>
                  <option value="main-course">Main Course</option>
                  <option value="desserts">Desserts</option>
                  <option value="drinks">Drinks</option>
                  <option value="sides">Side Dishes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your menu item..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price (ETB) *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price (ETB)
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preparation Time (minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 15"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ingredients
              </label>
              <div className="space-y-2">
                {['Pasta', 'Bacon', 'Eggs', 'Parmesan Cheese', 'Cream'].map((ingredient, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{ingredient}</span>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Ingredient</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergens & Dietary Information
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Contains Gluten', color: 'red' },
                  { label: 'Contains Dairy', color: 'amber' },
                  { label: 'Vegetarian', color: 'emerald' },
                  { label: 'Spicy', color: 'orange' },
                ].map((tag, i) => (
                  <div key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium bg-${tag.color}-100 text-${tag.color}-700`}>
                    {tag.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium">
                Save Menu Item
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Menu Categories</h4>
            <div className="space-y-3">
              {[
                { name: 'Appetizers', count: 12, color: 'blue' },
                { name: 'Main Course', count: 24, color: 'purple' },
                { name: 'Desserts', count: 8, color: 'pink' },
                { name: 'Drinks', count: 18, color: 'cyan' },
                { name: 'Side Dishes', count: 10, color: 'emerald' },
              ].map((category, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-8 bg-${category.color}-500 rounded-full`} />
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      <p className="text-sm text-gray-600">{category.count} items</p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h4>
            <div className="space-y-3">
              {[
                { label: 'Import from CSV', icon: Download, color: 'blue' },
                { label: 'Print Menu', icon: Printer, color: 'gray' },
                { label: 'Set Seasonal Items', icon: Calendar, color: 'emerald' },
                { label: 'Update Prices', icon: DollarSign, color: 'amber' },
                { label: 'Manage Ingredients', icon: Package, color: 'purple' },
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
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Recent Menu Items</h4>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
            View All Items →
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Item Name</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Category</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Price</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Cost</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Profit Margin</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Status</th>
                <th className="pb-3 text-left text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Pasta Carbonara', category: 'Main Course', price: 'ETB 180', cost: 'ETB 45', margin: '75%', status: 'active' },
                { name: 'Grilled Salmon', category: 'Main Course', price: 'ETB 280', cost: 'ETB 95', margin: '66%', status: 'active' },
                { name: 'Tiramisu', category: 'Desserts', price: 'ETB 120', cost: 'ETB 28', margin: '77%', status: 'active' },
                { name: 'Caesar Salad', category: 'Appetizers', price: 'ETB 85', cost: 'ETB 22', margin: '74%', status: 'inactive' },
                { name: 'Mojito', category: 'Drinks', price: 'ETB 95', cost: 'ETB 18', margin: '81%', status: 'active' },
              ].map((item, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                        <Utensils className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Preptime: 15min</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-gray-900">{item.price}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-gray-600">{item.cost}</p>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full"
                          style={{ width: item.margin }}
                        />
                      </div>
                      <span className="font-semibold text-emerald-600">{item.margin}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
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