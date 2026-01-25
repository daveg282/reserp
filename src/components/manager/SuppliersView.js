'use client';
import { useState } from 'react';
import {
  Building2, Users, Phone, Mail, MapPin,
  CheckCircle, XCircle, Clock,
  Plus, Search, Edit, Trash2, Eye,
  RefreshCw, Star, X, AlertCircle
} from 'lucide-react';

export default function SuppliersView({
  suppliers = [],
  supplierPerformance = [],
  onRefresh,
  onAddSupplier,
  onEditSupplier,
  onDeleteSupplier,
  onViewDetails,
  onGenerateReport,
  isLoading = false,
  error = null,
  userRole = 'manager'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    payment_terms: 'Net 30',
    status: 'active'
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter and sort suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = 
      supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || supplier.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'orders':
        aValue = a.totalOrders || 0;
        bValue = b.totalOrders || 0;
        break;
      case 'value':
        aValue = a.totalValue || 0;
        bValue = b.totalValue || 0;
        break;
      default:
        return 0;
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const getStatusBadge = (status) => {
    const statuses = {
      'active': { label: 'Active', color: 'green', bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      'pending': { label: 'Pending', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      'inactive': { label: 'Inactive', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700', icon: XCircle }
    };
    return statuses[status] || statuses.inactive;
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
  };

  const handleAddClick = () => {
    setModalMode('add');
    setModalError('');
    setFormData({
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      payment_terms: 'Net 30',
      status: 'active'
    });
    setShowModal(true);
  };

  const handleEditClick = (supplier) => {
    setModalMode('edit');
    setSelectedSupplier(supplier);
    setModalError('');
    
    // Debug: Log what we're sending
    console.log('📝 Editing supplier data:', {
      id: supplier.id,
      name: supplier.name,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      paymentTerms: supplier.paymentTerms,
      status: supplier.status
    });
    
    // Prepare form data - only include fields that exist in the database
    setFormData({
      name: supplier.name || '',
      contact_person: supplier.contactPerson || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      payment_terms: supplier.paymentTerms || 'Net 30',
      status: supplier.status || 'active'
    });
    setShowModal(true);
  };

  const handleModalSubmit = async () => {
    if (!formData.name.trim()) {
      setModalError('Supplier name is required');
      return;
    }

    setIsSubmitting(true);
    setModalError('');

    try {
      // Debug: Log what we're sending
      console.log('📤 Submitting form data:', {
        mode: modalMode,
        formData: formData,
        selectedSupplierId: selectedSupplier?.id
      });
      
      if (modalMode === 'add' && onAddSupplier) {
        await onAddSupplier(formData);
        console.log('✅ Supplier added successfully');
        setShowModal(false);
      } else if (modalMode === 'edit' && selectedSupplier && onEditSupplier) {
        await onEditSupplier(selectedSupplier.id, formData);
        console.log('✅ Supplier updated successfully');
        setShowModal(false);
      }
    } catch (error) {
      console.error('❌ Operation failed:', error);
      setModalError(error.message || 'Failed to save supplier. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = async (supplierId, supplierName) => {
    if (window.confirm(`Are you sure you want to delete "${supplierName}"? This action cannot be undone.`)) {
      try {
        if (onDeleteSupplier) {
          await onDeleteSupplier(supplierId, supplierName);
          console.log('✅ Supplier deleted successfully');
        }
      } catch (error) {
        console.error('❌ Delete failed:', error);
        alert(`Failed to delete supplier: ${error.message}`);
      }
    }
  };

  const handleViewDetails = (supplierId) => {
    if (onViewDetails) {
      onViewDetails(supplierId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Suppliers</h3>
          <p className="text-gray-600">Manage your vendor relationships</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleAddClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search suppliers..."
              className="w-full text-black pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border text-black rounded-lg px-3 py-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            className="border text-black rounded-lg px-3 py-2"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
            <option value="orders">Sort by Orders</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
        
        {(searchQuery || filterStatus !== 'all') && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Filtered results:</span>
            {searchQuery && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                Search: "{searchQuery}"
              </span>
            )}
            {filterStatus !== 'all' && (
              <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
                Status: {filterStatus}
              </span>
            )}
            <button onClick={clearFilters} className="text-gray-600 hover:text-gray-900">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Suppliers Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto" />
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No suppliers found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => {
            const status = getStatusBadge(supplier.status);
            const StatusIcon = status.icon;
            
            return (
              <div key={supplier.id} className="bg-white rounded-lg border p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-black">{supplier.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${status.bg} ${status.text}`}>
                          <StatusIcon className="w-3 h-3 inline mr-1" />
                          {status.label}
                        </span>
                       
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {supplier.contactPerson || 'No contact'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {supplier.phone || 'No phone'}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {supplier.email || 'No email'}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4 border-t">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(supplier)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="w-4 h-4 text-black" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(supplier.id, supplier.name)}
                      className="p-1 hover:bg-red-50 rounded text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 text-black">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">
                  {modalMode === 'add' ? 'Add New Supplier' : 'Edit Supplier'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Error */}
              {modalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{modalError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSubmitting}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      disabled={isSubmitting}
                      className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      disabled={isSubmitting}
                      className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    disabled={isSubmitting}
                    className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                    rows="2"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Terms
                    </label>
                    <select
                      disabled={isSubmitting}
                      className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                      value={formData.payment_terms}
                      onChange={(e) => setFormData({...formData, payment_terms: e.target.value})}
                    >
                      <option>Net 30</option>
                      <option>Net 15</option>
                      <option>Net 60</option>
                      <option>COD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      disabled={isSubmitting}
                      className="w-full border rounded-lg px-3 py-2 disabled:bg-gray-50"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleModalSubmit}
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {modalMode === 'add' ? 'Adding...' : 'Saving...'}
                      </>
                    ) : (
                      modalMode === 'add' ? 'Add Supplier' : 'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}