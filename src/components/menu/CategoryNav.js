'use client';

export default function CategoryNav({ categories, activeCategory, onCategoryChange }) {
  return (
    <div className="sticky top-20 z-40 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1 overflow-x-auto py-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm ${
                activeCategory === category
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}