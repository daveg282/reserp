'use client';
import { Clock } from 'lucide-react';

export default function MenuItemCard({ item, addToCart }) {
  return (
    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-200 p-4 lg:p-6 hover:shadow-lg transition">
      <div className="flex gap-3 lg:gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
            <span className="text-xl lg:text-2xl">{item.image}</span>
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-base lg:text-lg truncate">{item.name}</h4>
              <p className="text-gray-600 text-xs lg:text-sm mb-2 line-clamp-2">{item.description}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="font-bold text-gray-900 text-sm lg:text-base">ETB {item.price}</p>
              <p className="text-xs text-gray-500 flex items-center justify-end">
                <Clock className="w-3 h-3 mr-1" />
                {item.preparationTime}m
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs lg:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {item.category}
            </span>
            <button
              onClick={() => addToCart(item)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-medium transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}