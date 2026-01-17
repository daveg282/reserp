'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

export default function TableModal({ 
  show, 
  onClose, 
  mode, 
  tableData, 
  onSubmit,
  userRole 
}) {
  const [formData, setFormData] = useState({
    table_number: '',
    capacity: 4,
    section: 'Main Hall',
    status: 'available',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Sections for dropdown
  const sections = [
    'Main Hall',
    'VIP Section', 
    'Garden Area',
    'Bar Area',
    'Patio',
    'Private Room'
  ];

  // Status options
  const statusOptions = [
    { value: 'available', label: 'Available', color: 'green' },
    { value: 'occupied', label: 'Occupied', color: 'red' },
    { value: 'reserved', label: 'Reserved', color: 'yellow' },
    { value: 'maintenance', label: 'Maintenance', color: 'gray' }
  ];

  // Initialize form data when modal opens or tableData changes
  useEffect(() => {
    if (mode === 'edit' && tableData) {
      setFormData({
        table_number: tableData.table_number || '',
        capacity: tableData.capacity || 4,
        section: tableData.section || 'Main Hall',
        status: tableData.status || 'available',
      });
    } else {
      // Reset for create mode
      setFormData({
        table_number: '',
        capacity: 4,
        section: 'Main Hall',
        status: 'available',
      });
    }
    setErrors({});
  }, [show, mode, tableData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.table_number.trim()) {
      newErrors.table_number = 'Table number is required';
    }
    
    if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }
    
    if (formData.capacity > 20) {
      newErrors.capacity = 'Capacity cannot exceed 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for backend (NO notes field)
      const formDataToSend = {
        table_number: formData.table_number.trim(),
        capacity: parseInt(formData.capacity),
        section: formData.section,
        status: formData.status || 'available',
        customer_count: 0
      };
      
      console.log('📤 Submitting data:', formDataToSend);
      console.log('Mode:', mode);
      
      // CORRECT: Different calls for create vs edit
      let success;
      
      if (mode === 'edit' && tableData && tableData.id) {
        // EDIT mode: pass (id, data)
        console.log('Calling onSubmit for EDIT with:', tableData.id, formDataToSend);
        success = await onSubmit(tableData.id, formDataToSend);
      } else {
        // CREATE mode: pass (data) only
        console.log('Calling onSubmit for CREATE with:', formDataToSend);
        success = await onSubmit(formDataToSend);
      }
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting table:', error);
      alert(`Error: ${error.message || 'Failed to submit form'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Add New Table' : 'Edit Table'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-black">
            {/* Table Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Number *
              </label>
              <input
                type="text"
                name="table_number"
                value={formData.table_number}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.table_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., T1, V2, 101"
                disabled={isSubmitting}
              />
              {errors.table_number && (
                <p className="mt-1 text-sm text-red-600">{errors.table_number}</p>
              )}
            </div>
            
            {/* Capacity and Section in one row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  max="20"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.capacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  {sections.map((section) => (
                    <option key={section} value={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Status (only for admin/manager in edit mode) */}
            {(userRole === 'admin' || userRole === 'manager') && mode === 'edit' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* Footer */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {mode === 'create' ? 'Creating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {mode === 'create' ? 'Create Table' : 'Save Changes'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}