'use client';

// Define getPriorityColor locally in this component
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high': 
      return 'bg-red-100 text-red-700 border-red-200';
    case 'medium': 
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'low': 
      return 'bg-blue-100 text-blue-700 border-blue-200';
    default: 
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function AlertCard({ alert }) {
  return (
    <div className={`p-3 rounded-xl border ${getPriorityColor(alert?.priority || '')}`}>
      <p className="text-sm font-medium mb-1">{alert?.message || ''}</p>
      <p className="text-xs text-gray-600">{alert?.time || ''}</p>
    </div>
  );
}