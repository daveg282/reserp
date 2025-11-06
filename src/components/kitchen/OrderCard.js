// components/kitchen/OrderCard.js
export default function OrderCard({ order, onStatusUpdate }) {
  const getTimeElapsed = (timestamp) => {
    const diff = Math.floor((new Date() - timestamp) / 60000);
    return `${diff} min`;
  };

  return (
    <div className={`border rounded-xl p-4 ${
      order.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">Order #{order.id}</h3>
          <p className="text-gray-600">Table {order.table}</p>
        </div>
        <div className="text-right">
          <div className={`px-2 py-1 rounded text-xs font-medium ${
            order.priority === 'high' 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {order.priority === 'high' ? 'HIGH PRIORITY' : 'Normal'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {getTimeElapsed(order.timestamp)}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <span className="font-medium">{item.quantity}x</span>
              <span className="ml-2">{item.name}</span>
              {item.notes && (
                <span className="ml-2 text-sm text-orange-600">({item.notes})</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {order.status === 'pending' && (
          <button
            onClick={() => onStatusUpdate(order.id, 'preparing')}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Start Preparing
          </button>
        )}
        {order.status === 'preparing' && (
          <button
            onClick={() => onStatusUpdate(order.id, 'ready')}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Mark Ready
          </button>
        )}
        {order.status === 'ready' && (
          <button
            onClick={() => onStatusUpdate(order.id, 'completed')}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Complete Order
          </button>
        )}
      </div>
    </div>
  );
}