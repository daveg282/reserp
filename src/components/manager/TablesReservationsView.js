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
  Download,
  RefreshCw,
  AlertTriangle,
  Loader2,
  MapPin
} from 'lucide-react';

export default function TablesReservationsView({ 
  userRole,
  tablesData = [],         // Receive data from parent
  tableStats = null,       // Receive stats from parent
  isLoading = false,       // Receive loading state
  error = null,            // Receive error state
  onRefresh,               // Refresh function from parent
  onAddTable,              // Function to add new table
  onEditTable,             // Function to edit table
  onDeleteTable            // Function to delete table
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const tableStatusColors = {
    available: 'bg-green-100 text-green-800 border-green-300',
    occupied: 'bg-red-100 text-red-800 border-red-300',
    reserved: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    maintenance: 'bg-gray-100 text-gray-800 border-gray-300'
  };

  // Transform API data to match component expectations
  const transformedTables = Array.isArray(tablesData) ? tablesData.map(table => ({
    id: table.id,
    number: table.table_number || table.number,
    capacity: table.capacity || 2,
    status: table.status || 'available',
    location: table.section || table.location || 'Main Hall',
    customers: table.customer_count || table.customers || 0,
    waiter: table.waiter || null
  })) : [];

  const filteredTables = transformedTables.filter(table => {
    const matchesSearch = searchQuery === '' || 
      (table.number?.toString().toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (table.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || table.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (tableId, tableData) => {
    if (onEditTable) {
      onEditTable(tableId, tableData);
    }
  };

  const handleDelete = (tableId) => {
    if (onDeleteTable) {
      onDeleteTable(tableId);
    }
  };

  const handleAddTable = () => {
    if (onAddTable) {
      onAddTable();
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Tables Management</h1>
          <p className="text-gray-600">Manage tables and occupancy</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-black bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Refresh
          </button>
          
          {/* ADD TABLE BUTTON */}
          {userRole === 'manager' && (
            <button 
              onClick={handleAddTable}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
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
            <div className="flex-1">
              <p className="font-medium text-red-800">Error Loading Tables</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={onRefresh}
                  className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded transition-colors"
                >
                  Try again
                </button>
              </div>
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

      {/* Tables List */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tables by number or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
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
                  <tr key={table.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">Table {table.number}</div>
                      <div className="text-sm text-gray-500">ID: {table.id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-700 mr-2" />
                        <span className="font-medium text-black">{table.capacity} seats</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${tableStatusColors[table.status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                        {table.status ? table.status.charAt(0).toUpperCase() + table.status.slice(1) : 'Unknown'}
                      </span>
                     
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-gray-900">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        {table.location}
                      </div>
                      {table.waiter && (
                        <div className="text-sm text-gray-500">Waiter: {table.waiter}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleEdit(table.id, table)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                          title="Edit Table"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        {/* Delete Button (Admin only) */}
                        {userRole === 'admin' && (
                          <button 
                            onClick={() => handleDelete(table.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete Table"
                          >
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
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-3">
              <div>
                Showing {filteredTables.length} of {transformedTables.length} tables
              </div>
              <div className="flex items-center gap-4 flex-wrap">
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
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  Maintenance
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}