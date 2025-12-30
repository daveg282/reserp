export const getTimeElapsed = (time) => {
  const diff = Math.floor((new Date() - new Date(time)) / 60000);
  if (diff < 1) return 'Just now';
  if (diff < 60) return `${diff} min ago`;
  return `${Math.floor(diff / 60)} hours ago`;
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active': return 'bg-emerald-100 text-emerald-700';
    case 'inactive': return 'bg-gray-100 text-gray-700';
    case 'completed': return 'bg-emerald-100 text-emerald-700';
    case 'preparing': return 'bg-amber-100 text-amber-700';
    case 'pending': return 'bg-amber-100 text-amber-700';
    case 'occupied': return 'bg-blue-100 text-blue-700';
    case 'available': return 'bg-emerald-100 text-emerald-700';
    case 'reserved': return 'bg-purple-100 text-purple-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export const getRoleColor = (role) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700';
    case 'waiter': return 'bg-blue-100 text-blue-700';
    case 'cashier': return 'bg-green-100 text-green-700';
    case 'chef': return 'bg-orange-100 text-orange-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};