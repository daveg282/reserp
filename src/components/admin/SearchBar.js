import { Search, X } from 'lucide-react';

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  showSearch,
  setShowSearch
}) {
  // Mobile Search (Full Width)
  if (showSearch) {
    return (
      <div className="lg:hidden relative w-full max-w-xs">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
          aria-label="Search"
        />
        <button 
          onClick={() => setShowSearch(false)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Close search"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Desktop Search + Mobile Toggle
  return (
    <>
      {/* Desktop Search */}
      <div className="hidden lg:block relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-black pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 xl:w-64"
          aria-label="Search"
        />
      </div>
      
      {/* Mobile Search Toggle */}
      <button 
        onClick={() => setShowSearch(true)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
        aria-label="Open search"
      >
        <Search className="w-5 h-5 text-gray-600" />
      </button>
    </>
  );
}