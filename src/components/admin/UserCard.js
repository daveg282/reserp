import { Edit, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { getTimeElapsed, getStatusColor, getRoleColor } from '../../utils/helpers';

export default function UserCard({ user, deleteUser }) {
  const handleEdit = () => {
    console.log('Edit user:', user.id);
    // Implementation for editing user
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{user.name}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={handleEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label={`Edit ${user.name}`}
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 hover:bg-red-50 rounded-lg transition"
            aria-label={`Delete ${user.name}`}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-xs lg:text-sm">
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{user.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
        <span className="text-xs text-gray-500">
          Last login: {getTimeElapsed(user.lastLogin)}
        </span>
      </div>
    </div>
  );
}