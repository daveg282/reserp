'use client';

export default function OrderCard({ order, statusConfig, markOrderReady, completeOrder }) {
  return (
    <div className={`${statusConfig.cardColor} rounded-xl p-4 border`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold text-gray-900">{order.orderNumber}</p>
          <p className="text-sm text-gray-600">{order.customerName}</p>
          <p className="text-xs text-gray-500">Pager #{order.pagerNumber}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.badgeColor}`}>
          {statusConfig.title}
        </span>
      </div>
      <div className="space-y-1 mb-3">
        {order.items.slice(0, 2).map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-700">{item.quantity}x {item.name}</span>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-xs text-gray-500">+{order.items.length - 2} more items</p>
        )}
      </div>
      
      {statusConfig.status === 'ready' ? (
        <div className="space-y-2">
          <button
            onClick={() => {
              console.log(`🛎️ Buzzing pager #${order.pagerNumber} again`);
              alert(`Pager #${order.pagerNumber} is buzzing again!`);
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Buzz Pager Again
          </button>
          <button
            onClick={() => completeOrder(order.id)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Mark as Completed
          </button>
        </div>
      ) : (
        <button
          onClick={() => markOrderReady(order.id)}
          className={`w-full ${statusConfig.buttonColor} text-white py-2 rounded-lg text-sm font-medium transition`}
        >
          Mark as Ready
        </button>
      )}
    </div>
  );
}