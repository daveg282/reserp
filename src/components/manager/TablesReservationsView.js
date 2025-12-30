'use client';

import { useState } from 'react';
import { 
  Table, 
  User, 
  Clock, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  Loader2,
  BarChart3,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export default function TablesReservationsView({ 
  userRole,
  tablesData = [],         // Receive data from parent
  tableStats = null,       // Receive stats from parent
  isLoading = false,       // Receive loading state
  error = null,            // Receive error state
  onRefresh,               // Refresh function from parent
  onOccupyTable,           // Function to occupy table
  onFreeTable,             // Function to free table
  onReserveTable           // Function to reserve table
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tables');

  const tableStatusColors = {
    available: 'bg-green-100 text-green-800 border-green-300',
    occupied: 'bg-red-100 text-red-800 border-red-300',
    reserved: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    maintenance: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  const reservationStatusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
    noShow: 'bg-gray-100 text-gray-800'
  };

  // Transform API data to match component expectations
  const transformedTables = Array.isArray(tablesData) ? tablesData.map(table => ({
    id: table.id,
    number: table.table_number || table.number, // Handle both field names
    capacity: table.capacity,
    status: table.status,
    location: table.section || table.location, // Handle both field names
    customers: table.customer_count || table.customers || 0,
    waiter: table.waiter || null,
    reservation: table.reservation || (table.status === 'reserved' ? '7:30 PM' : null)
  })) : [];

  const filteredTables = transformedTables.filter(table => {
    const matchesSearch = searchQuery === '' || 
      (table.number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (table.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Mock reservations data (you would need to fetch this via API)
  const reservations = [
    { id: 1, customerName: 'John Smith', tableNumber: 'T3', guests: 4, time: '19:30', date: 'Today', status: 'confirmed', phone: '+1234567890' },
    { id: 2, customerName: 'Sarah Johnson', tableNumber: 'V1', guests: 8, time: '20:00', date: 'Today', status: 'confirmed', phone: '+1234567891' },
    { id: 3, customerName: 'Mike Wilson', tableNumber: 'T5', guests: 6, time: '19:00', date: 'Tomorrow', status: 'pending', phone: '+1234567892' },
  ];

  const filteredReservations = reservations.filter(reservation => 
    searchQuery === '' || 
    reservation.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && transformedTables.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 text-purple-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading tables data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tables & Reservations</h1>
          <p className="text-gray-600">Manage tables, occupancy, and reservations</p>
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
              <Plus className="w-4 h-4" />
              Add Table
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
              <p className="text-sm text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">
                {isLoading ? '...' : (tableStats?.total || transformedTables.length)}
              </p>
            </div>
            <Table className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {isLoading ? '...' : (tableStats?.available || transformedTables.filter(t => t.status === 'available').length)}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Occupied</p>
              <p className="text-2xl font-bold text-red-600">
                {isLoading ? '...' : (tableStats?.occupied || transformedTables.filter(t => t.status === 'occupied').length)}
              </p>
            </div>
            <User className="w-8 h-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reserved</p>
              <p className="text-2xl font-bold text-yellow-600">
                {isLoading ? '...' : (tableStats?.reserved || transformedTables.filter(t => t.status === 'reserved').length)}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tables')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tables'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tables
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reservations'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Analytics
          </button>
        </nav>
      </div>

      {/* Tables Tab */}
      {activeTab === 'tables' && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="reserved">Reserved</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Tables List */}
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-purple-600 mx-auto" />
              <p className="text-gray-600 mt-2">Loading tables...</p>
            </div>
          ) : filteredTables.length === 0 ? (
            <div className="p-8 text-center">
              <Table className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600">No tables found</p>
              {searchQuery && (
                <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Table</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Capacity</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTables.map((table) => (
                    <tr key={table.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">Table {table.number}</div>
                        <div className="text-sm text-gray-500">ID: {table.id}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{table.capacity} seats</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${tableStatusColors[table.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                          {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : 'Unknown'}
                        </span>
                        {table.reservation && (
                          <div className="text-xs text-gray-500 mt-1">{table.reservation}</div>
                        )}
                        {table.customers > 0 && (
                          <div className="text-xs text-gray-500 mt-1">{table.customers} customers</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-gray-900">{table.location || 'Main Dining'}</div>
                        {table.waiter && (
                          <div className="text-sm text-gray-500">Waiter: {table.waiter}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {table.status === 'available' && (
                            <button 
                              onClick={() => onOccupyTable && onOccupyTable(table.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Occupy Table"
                            >
                              <User className="w-4 h-4" />
                            </button>
                          )}
                          {table.status === 'occupied' && (
                            <button 
                              onClick={() => onFreeTable && onFreeTable(table.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Free Table"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          {table.status === 'available' && (
                            <button 
                              onClick={() => onReserveTable && onReserveTable(table.id)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg"
                              title="Reserve Table"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit Table">
                            <Edit className="w-4 h-4" />
                          </button>
                          {userRole === 'admin' && (
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete Table">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {filteredTables.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <div>
                  Showing {filteredTables.length} of {transformedTables.length} tables
                </div>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Available
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Occupied
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Reserved
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reservations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <select className="px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Today</option>
                  <option>Tomorrow</option>
                  <option>This Week</option>
                  <option>All Dates</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Calendar className="w-4 h-4" />
                  Calendar View
                </button>
              </div>
            </div>
          </div>

          {/* Reservations List */}
          <div className="divide-y divide-gray-200">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="p-4 hover:bg-gray-50">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{reservation.customerName}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Table className="w-3 h-3" />
                            Table {reservation.tableNumber}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {reservation.guests} guests
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {reservation.time} • {reservation.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${reservationStatusColors[reservation.status]}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {reservation.phone && (
                  <div className="mt-3 text-sm text-gray-600">
                    📱 {reservation.phone}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              {filteredReservations.length} reservations for selected period
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl shadow border p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Table Performance Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Table Utilization</h4>
              <div className="space-y-3">
                {['Main Hall', 'VIP Section', 'Garden Area'].map((location, idx) => {
                  const locationTables = transformedTables.filter(t => t.location === location);
                  const utilization = locationTables.length > 0 
                    ? Math.round((locationTables.filter(t => t.status !== 'available').length / locationTables.length) * 100)
                    : 0;
                  
                  return (
                    <div key={location} className="flex items-center justify-between">
                      <span className="text-gray-700">{location}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${utilization > 70 ? 'bg-green-500' : utilization > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{utilization}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Key Metrics</h4>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Average Table Turnover</span>
                    <span className="font-bold text-gray-900">{tableStats?.avgTurnover || '1.8 hours'}</span>
                  </div>
                  <div className="text-sm text-gray-600">Time from seating to payment</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Occupancy Rate</span>
                    <span className="font-bold text-green-600">{tableStats?.occupancyRate || '70%'}</span>
                  </div>
                  <div className="text-sm text-gray-600">Tables occupied vs total</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">Peak Hours</span>
                    <span className="font-bold text-gray-900">7:00 PM - 9:00 PM</span>
                  </div>
                  <div className="text-sm text-gray-600">Highest occupancy period</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}