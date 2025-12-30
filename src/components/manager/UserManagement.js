'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  User, 
  ChefHat, 
  Receipt, 
  Crown,
  Filter,
  RefreshCw,
  Check,
  X,
  Users,
  Eye,
  Key,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  UserCog
} from 'lucide-react';

export default function UserManagement({ 
  users = [],
  onRefresh,
  onAddUser,
  onEditUser,
  onDeleteUser,
  onResetPassword,
  onToggleStatus,
  isLoading = false,
  error = null,
  userRole = 'manager'
}) {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'waiter',
    first_name: '',
    last_name: '',
    phone: '',
    position: '',
    hourly_rate: 0,
    status: 'active'
  });

  // Role options with icons
  const roleOptions = [
    { value: 'admin', label: 'Administrator', icon: Crown, color: 'bg-red-100 text-red-800', bgColor: 'bg-red-50' },
    { value: 'manager', label: 'Manager', icon: Shield, color: 'bg-purple-100 text-purple-800', bgColor: 'bg-purple-50' },
    { value: 'chef', label: 'Chef', icon: ChefHat, color: 'bg-orange-100 text-orange-800', bgColor: 'bg-orange-50' },
    { value: 'waiter', label: 'Waiter', icon: User, color: 'bg-blue-100 text-blue-800', bgColor: 'bg-blue-50' },
    { value: 'cashier', label: 'Cashier', icon: Receipt, color: 'bg-green-100 text-green-800', bgColor: 'bg-green-50' }
  ];

  // Filter users based on search and role
  useEffect(() => {
    let result = users;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.username?.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);

  // Format user name from API response
  const formatUserName = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email?.split('@')[0] || 'User';
  };

  // Handle user actions
  const handleAddUserClick = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'waiter',
      first_name: '',
      last_name: '',
      phone: '',
      position: '',
      hourly_rate: 0,
      status: 'active'
    });
    setShowAddModal(true);
  };

  const handleEditUserClick = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || '',
      email: user.email || '',
      password: '', // Keep empty for security
      role: user.role || 'waiter',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      position: user.position || '',
      hourly_rate: user.hourly_rate || 0,
      status: user.status || 'active'
    });
    setShowEditModal(true);
  };

  const handleDeleteUserClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleViewUserClick = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleResetPasswordClick = (user) => {
    if (onResetPassword) {
      onResetPassword(user.id);
    }
  };

  const handleToggleStatusClick = (user) => {
    if (onToggleStatus) {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      onToggleStatus(user.id, newStatus);
    }
  };

  const handleSubmitAdd = (e) => {
    e.preventDefault();
    if (onAddUser) {
      onAddUser(formData);
      setShowAddModal(false);
    }
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    if (onEditUser && selectedUser) {
      onEditUser(selectedUser.id, formData);
      setShowEditModal(false);
    }
  };

  const handleConfirmDelete = () => {
    if (onDeleteUser && selectedUser) {
      onDeleteUser(selectedUser.id);
      setShowDeleteModal(false);
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.icon : User;
  };

  // Get role color
  const getRoleColor = (role) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.color : 'bg-gray-100 text-gray-800';
  };

  // Get role label
  const getRoleLabel = (role) => {
    const roleOption = roleOptions.find(r => r.value === role);
    return roleOption ? roleOption.label : role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Calculate stats based on API response
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const staffUsers = users.filter(u => !['admin', 'manager'].includes(u.role)).length;
  const adminManagerUsers = users.filter(u => ['admin', 'manager'].includes(u.role)).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage staff accounts and permissions</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleAddUserClick}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-xl font-semibold transition"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Total Users</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalUsers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {activeUsers}
                <span className="text-sm font-normal ml-2">
                  ({totalUsers > 0 ? Math.round((activeUsers/totalUsers)*100) : 0}%)
                </span>
              </p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700 font-medium">Staff Members</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">
                {staffUsers}
              </p>
            </div>
            <UserCog className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-300 rounded-xl text-black px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => error = null}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="3" className="px-6 py-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="mt-2 text-gray-600">No users found</p>
                  <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const RoleIcon = getRoleIcon(user.role);
                const roleOption = roleOptions.find(r => r.value === user.role);
                const userName = formatUserName(user);
                const isActive = user.status === 'active';
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 ${roleOption?.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                          <RoleIcon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userName}
                            {user.role === 'admin' && (
                              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-xs text-gray-500">
                            @{user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center mb-2">
                        <RoleIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs font-medium ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      {user.created_at && (
                        <div className="text-xs text-gray-500 flex items-center mt-1">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUserClick(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditUserClick(user)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatusClick(user)}
                          className={`p-2 rounded-lg transition ${
                            isActive 
                              ? 'text-yellow-600 hover:bg-yellow-50' 
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={isActive ? 'Deactivate User' : 'Activate User'}
                        >
                          {isActive ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleResetPasswordClick(user)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUserClick(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete User"
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

      {/* View User Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 ${roleOptions.find(r => r.value === selectedUser.role)?.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center`}>
                    {(() => {
                      const Icon = getRoleIcon(selectedUser.role);
                      return <Icon className="w-8 h-8 text-gray-700" />;
                    })()}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {formatUserName(selectedUser)}
                    </h4>
                    <p className="text-sm text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(selectedUser.role)}`}>
                        {getRoleLabel(selectedUser.role)}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        selectedUser.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">@{selectedUser.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Position</p>
                    <p className="font-medium">{selectedUser.position || 'Not specified'}</p>
                  </div>
                  {selectedUser.phone && (
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{selectedUser.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="font-medium">
                      {selectedUser.created_at 
                        ? new Date(selectedUser.created_at).toLocaleDateString()
                        : 'Unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Last Updated</p>
                  <p className="font-medium">
                    {selectedUser.updated_at 
                      ? new Date(selectedUser.updated_at).toLocaleDateString()
                      : 'Not available'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Add New User</h3>
              <form onSubmit={handleSubmitAdd}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      minLength="6"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {roleOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 text-black">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit User</h3>
              <form onSubmit={handleSubmitEdit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (leave blank to keep current)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        {roleOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Delete User
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete <span className="font-semibold">{formatUserName(selectedUser)}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}