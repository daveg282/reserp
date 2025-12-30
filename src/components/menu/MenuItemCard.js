'use client';

export default function MenuItemCard({ item, onAddToCart }) {
  return (
    <div className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-500 border border-gray-100">
      <div className="flex gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-2xl">{item.image || '🍽️'}</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-serif text-xl text-gray-900 mb-1">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            </div>
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-900 block">ETB {item.price}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                item.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {item.available ? 'Available' : 'Sold Out'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">{item.category}</span>
            <button
              onClick={() => onAddToCart(item)}
              disabled={!item.available}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                item.available
                  ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {item.available ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}