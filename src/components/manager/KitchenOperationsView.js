// components/manager/KitchenOperationsView.js
'use client';

import { useState, useEffect } from 'react';
import { 
  ChefHat,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  Loader2,
  Utensils,
  Thermometer,
  Timer,
  TrendingDown,
  BarChart3,
  User,
  Star
} from 'lucide-react';

export default function KitchenOperationsView({ 
  userRole,
  kitchenData = null,        // Receive data from parent
  kitchenStats = null,       // Receive stats from parent
  isLoading = false,         // Receive loading state
  error = null,              // Receive error state
  onRefresh,                 // Refresh function from parent
  onUpdateItemStatus,        // Function to update item status
  onUpdateOrderStatus        // Function to update order status
}) {
  const [activeTab, setActiveTab] = useState('stations');
  const [searchQuery, setSearchQuery] = useState('');
  const [stationFilter, setStationFilter] = useState('all');

  const stationStatusColors = {
    active: 'bg-green-100 text-green-800',
    busy: 'bg-yellow-100 text-yellow-800',
    idle: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-red-100 text-red-800'
  };

  const itemStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    preparing: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    served: 'bg-purple-100 text-purple-800'
  };

  // Sample kitchen stations data (would come from API)
  const kitchenStations = [
    { id: 1, name: 'Grill Station', chef: 'John Smith', status: 'busy', currentOrders: 4, itemsInQueue: 8, efficiency: 85 },
    { id: 2, name: 'Fry Station', chef: 'Sarah Johnson', status: 'active', currentOrders: 2, itemsInQueue: 5, efficiency: 92 },
    { id: 3, name: 'Salad Station', chef: 'Mike Wilson', status: 'idle', currentOrders: 0, itemsInQueue: 2, efficiency: 78 },
    { id: 4, name: 'Dessert Station', chef: 'Emma Davis', status: 'active', currentOrders: 1, itemsInQueue: 3, efficiency: 95 },
    { id: 5, name: 'Beverage Station', chef: 'Robert Brown', status: 'maintenance', currentOrders: 0, itemsInQueue: 0, efficiency: 0 },
  ];

  // Sample kitchen orders (would come from API)
  const kitchenOrders = [
    { 
      id: 101, 
      orderNumber: 'ORD00101',
      table: 'T2', 
      items: [
        { id: 1, name: 'Grilled Salmon', station: 'Grill Station', status: 'preparing', time: '12 min' },
        { id: 2, name: 'Caesar Salad', station: 'Salad Station', status: 'ready', time: 'Ready' },
        { id: 3, name: 'French Fries', station: 'Fry Station', status: 'preparing', time: '8 min' }
      ],
      total: 3450,
      status: 'preparing',
      time: '15 min',
      notes: 'No onions on burger'
    },
    { 
      id: 102, 
      orderNumber: 'ORD00102',
      table: 'V1', 
      items: [
        { id: 4, name: 'Chocolate Cake', station: 'Dessert Station', status: 'ready', time: 'Ready' },
        { id: 5, name: 'Iced Tea', station: 'Beverage Station', status: 'pending', time: 'Pending' }
      ],
      total: 1250,
      status: 'preparing',
      time: '8 min',
      notes: 'Extra chocolate sauce'
    }
  ];

  const filteredStations = kitchenStations.filter(station => {
    const matchesSearch = searchQuery === '' || 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.chef.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = stationFilter === 'all' || station.status === stationFilter;
    
    return matchesSearch && matchesFilter;
  });

  const filteredOrders = kitchenOrders.filter(order => 
    searchQuery === '' || 
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.table.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading kitchen operations data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Operations</h1>
          <p className="text-gray-600">Monitor kitchen stations, chefs, and food preparation</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
          
          {userRole === 'admin' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <ChefHat className="w-4 h-4" />
              Manage Stations
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Error</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button 
                onClick={onRefresh}
                className="mt-2 text-sm text-red-700 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Stations</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStations.filter(s => s.status === 'active' || s.status === 'busy').length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {filteredStations.filter(s => s.status === 'busy').length} busy
              </p>
            </div>
            <ChefHat className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orders in Queue</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStations.reduce((sum, station) => sum + station.currentOrders, 0)}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                2 less than yesterday
              </p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Prep Time</p>
              <p className="text-2xl font-bold text-gray-900">18 min</p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingDown className="w-3 h-3 mr-1" />
                5 min faster
              </p>
            </div>
            <Timer className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Kitchen Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredStations.length > 0 
                  ? Math.round(filteredStations.reduce((sum, station) => sum + station.efficiency, 0) / filteredStations.length) 
                  : 0}%
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +5% from last week
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('stations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stations'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Kitchen Stations
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders in Progress
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance
          </button>
        </nav>
      </div>

      {/* Stations Tab */}
      {activeTab === 'stations' && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search kitchen stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select
                  value={stationFilter}
                  onChange={(e) => setStationFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Stations</option>
                  <option value="active">Active</option>
                  <option value="busy">Busy</option>
                  <option value="idle">Idle</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredStations.map((station) => (
              <div key={station.id} className="border rounded-xl p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{station.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{station.chef}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stationStatusColors[station.status]}`}>
                    {station.status.charAt(0).toUpperCase() + station.status.slice(1)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Orders:</span>
                    <span className="font-medium">{station.currentOrders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items in Queue:</span>
                    <span className="font-medium">{station.itemsInQueue}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Efficiency:</span>
                    <span className={`font-medium ${station.efficiency > 85 ? 'text-green-600' : station.efficiency > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {station.efficiency}%
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${station.efficiency > 85 ? 'bg-green-500' : station.efficiency > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${station.efficiency}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  {station.status !== 'maintenance' && (
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm">
                      View Orders
                    </button>
                  )}
                  {userRole === 'admin' && (
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                      Manage
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders in Progress Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by table or order number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Stations</option>
                  <option>Grill Station</option>
                  <option>Fry Station</option>
                  <option>Salad Station</option>
                  <option>Dessert Station</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{order.orderNumber}</h4>
                    <p className="text-sm text-gray-600">Table {order.table} • {order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">ETB {order.total.toLocaleString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${itemStatusColors[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                          <Utensils className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.station}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${itemStatusColors[item.status]}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                        <span className={`text-sm font-medium ${item.status === 'ready' ? 'text-green-600' : 'text-gray-600'}`}>
                          {item.time}
                        </span>
                        {item.status === 'preparing' && (
                          <button 
                            onClick={() => onUpdateItemStatus && onUpdateItemStatus(item.id, 'ready')}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs"
                          >
                            Mark Ready
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {order.notes && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      {order.notes}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  {order.items.some(item => item.status === 'preparing') ? (
                    <button 
                      onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'ready')}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      Mark All Ready
                    </button>
                  ) : order.items.every(item => item.status === 'ready') ? (
                    <button 
                      onClick={() => onUpdateOrderStatus && onUpdateOrderStatus(order.id, 'served')}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 text-sm"
                    >
                      Mark Order Served
                    </button>
                  ) : (
                    <button className="flex-1 bg-gray-600 text-white py-2 rounded-lg text-sm opacity-50 cursor-not-allowed">
                      In Progress
                    </button>
                  )}
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Kitchen Performance Metrics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Station Performance</h4>
              <div className="space-y-3">
                {filteredStations.map((station) => (
                  <div key={station.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{station.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${station.efficiency > 85 ? 'bg-green-500' : station.efficiency > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${station.efficiency}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium ${station.efficiency > 85 ? 'text-green-600' : station.efficiency > 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {station.efficiency}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <h5 className="font-semibold text-gray-900 mb-3">Top Performing Chefs</h5>
                <div className="space-y-2">
                  {filteredStations
                    .filter(s => s.status !== 'maintenance')
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .slice(0, 3)
                    .map((station, index) => (
                      <div key={station.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{station.chef}</p>
                            <p className="text-xs text-gray-500">{station.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                          <span className="font-semibold text-gray-900">{station.efficiency}%</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Key Metrics</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Average Prep Time</span>
                    <span className="font-bold text-gray-900">18 minutes</span>
                  </div>
                  <div className="text-sm text-gray-600">Time from order received to ready</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Order Accuracy Rate</span>
                    <span className="font-bold text-green-600">99.2%</span>
                  </div>
                  <div className="text-sm text-gray-600">Correct orders vs total orders</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Waste Percentage</span>
                    <span className="font-bold text-red-600">2.8%</span>
                  </div>
                  <div className="text-sm text-gray-600">Food waste vs total production</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Busiest Time</span>
                    <span className="font-bold text-gray-900">7:30 PM</span>
                  </div>
                  <div className="text-sm text-gray-600">Peak order volume time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}