'use client';
import { Plus, Star,Users } from 'lucide-react';

// Define getStatusColor locally
const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700';
    case 'break': return 'bg-amber-100 text-amber-700';
    case 'off': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default function StaffView({ staffPerformance, setSelectedStaff, setShowStaffDetails }) {
  // Ensure staffPerformance is an array
  const staffList = Array.isArray(staffPerformance) ? staffPerformance : [];

  // Helper function to safely format sales
  const formatSales = (sales) => {
    const salesNumber = Number(sales);
    if (isNaN(salesNumber) || salesNumber === 0) {
      return 'ETB 0';
    }
    return `ETB ${salesNumber.toLocaleString()}`;
  };

  // Helper function to safely format rating
  const formatRating = (rating) => {
    const ratingNumber = Number(rating);
    if (isNaN(ratingNumber) || ratingNumber === 0) {
      return '0.0';
    }
    return ratingNumber.toFixed(1);
  };

  // Helper function to safely format efficiency
  const formatEfficiency = (efficiency) => {
    const efficiencyNumber = Number(efficiency);
    if (isNaN(efficiencyNumber) || efficiencyNumber === 0) {
      return 0;
    }
    return Math.min(Math.max(efficiencyNumber, 0), 100); // Ensure between 0-100
  };

  // Helper function to get avatar initials
  const getAvatar = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900">Staff Management</h3>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Staff</span>
          </button>
          <select className="border border-gray-300 rounded-xl px-3 lg:px-4 py-2 text-sm font-medium text-black">
            <option>All Roles</option>
            <option>Head Waiter</option>
            <option>Senior Waiter</option>
            <option>Waiter</option>
            <option>Trainee</option>
          </select>
        </div>
      </div>

      {staffList.length === 0 ? (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Users className="w-12 h-12 mx-auto" />
          </div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">No Staff Data Available</h4>
          <p className="text-gray-500 mb-6">Staff performance data is not available or still loading.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
            Add First Staff Member
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Staff Member</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Sales</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Efficiency</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {staffList.map(staff => {
                  const avatar = staff.avatar || getAvatar(staff.name || '');
                  const sales = formatSales(staff.sales);
                  const efficiency = formatEfficiency(staff.efficiency);
                  const rating = formatRating(staff.rating);
                  const status = staff.status || 'off';
                  
                  return (
                    <tr key={staff.id || staff.name} className="hover:bg-gray-50 transition">
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                            {avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm lg:text-base">
                              {staff.name || 'Unknown Staff'}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {staff.id || staff.employeeId || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-sm text-gray-900">
                        {staff.role || 'Not specified'}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <p className="font-semibold text-gray-900 text-sm lg:text-base">{sales}</p>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 lg:w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${efficiency}%` }}
                            ></div>
                          </div>
                          <span className="text-xs lg:text-sm font-semibold text-gray-900">{efficiency}%</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-gray-900 text-sm lg:text-base">{rating}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowStaffDetails(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition"
                          >
                            View
                          </button>
                          <button className="bg-gray-600 hover:bg-gray-700 text-white px-2 lg:px-3 py-1 rounded-lg text-xs lg:text-sm font-medium transition">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}