'use client';
import { X, Star, User } from 'lucide-react';

export default function StaffDetailsModal({ staff, onClose }) {
  // Don't render anything if staff is undefined or null
  if (!staff) {
    return null;
  }

  // Safe defaults for staff properties
  const staffData = {
    avatar: staff.avatar || '',
    name: staff.name || 'Unknown Staff',
    role: staff.role || 'Staff Member',
    rating: staff.rating || 0,
    tablesServed: staff.tablesServed || staff.tables || 0,
    sales: staff.sales || 0,
    efficiency: staff.efficiency || 0,
    // Handle different property names
    ...staff
  };

  // Generate avatar initials if no avatar provided
  const getAvatarInitials = () => {
    if (staffData.avatar) return staffData.avatar;
    
    const nameParts = staffData.name.split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return staffData.name[0]?.toUpperCase() || 'S';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 lg:p-6 border-b border-gray-200">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900">Staff Details</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-xl">
              {getAvatarInitials()}
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-900">{staffData.name}</h4>
              <p className="text-gray-600">{staffData.role}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                <span className="font-semibold text-gray-900">{staffData.rating}</span>
                <span className="text-gray-500 text-sm">rating</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{staffData.tablesServed}</p>
              <p className="text-sm text-gray-600">Tables Served</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">
                ETB {staffData.sales.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Sales</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{staffData.efficiency}%</p>
              <p className="text-sm text-gray-600">Efficiency</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 lg:p-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{staffData.rating}</p>
              <p className="text-sm text-gray-600">Customer Rating</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base">
              View Schedule
            </button>
            <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2.5 lg:py-3 rounded-xl font-semibold transition text-sm lg:text-base">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}