import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { getTimeElapsed } from '@/utils/helpers';

export default function NotificationCard({ notification, onMarkRead }) {
  const getIcon = (type) => {
    switch (type) {
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      case 'info': return Info;
      default: return Bell;
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'warning': return 'text-amber-500';
      case 'success': return 'text-emerald-500';
      case 'info': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const Icon = getIcon(notification.type);

  return (
    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition group">
      <div className={`p-2 rounded-lg ${getIconColor(notification.type).replace('text', 'bg')} bg-opacity-10`}>
        <Icon className={`w-4 h-4 ${getIconColor(notification.type)}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">{getTimeElapsed(notification.time)}</p>
      </div>
      {onMarkRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
          aria-label="Mark as read"
        >
          <CheckCircle className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}