'use client';

export default function PopularItemCard({ item, onAddToCart }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 h-48 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
            {item.image || '🍽️'}
          </span>
        </div>
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
            <span className="text-white font-semibold">Currently Unavailable</span>
          </div>
        )}
      </div>
      <div className="text-center">
        <h3 className="font-serif text-xl text-gray-900 mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">ETB {item.price}</span>
          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.available}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              item.available
                ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.available ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </div>
  );
}