'use client';

import { useState } from 'react';
import { 
  Plus, Filter, Search, Grid3x3, 
  List, DollarSign, Star, CheckCircle,
  AlertCircle, Edit, Trash2, Eye, Utensils
} from 'lucide-react';
import MenuItemModal from './MenuItemModal';
import CategoryModal from './CategoryModal';
import MenuStats from './MenuStats';
import MenuItemsGrid from './MenuItemsGrid';
import MenuCategories from './MenuCategories';

export default function MenuManagement({
  menuData = null,
  categories = [],
  menuStats = {},
  onRefresh,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  onToggleAvailability,
  onTogglePopular,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading = false,
  error = null,
  userRole = 'manager'
}) {
  const [activeTab, setActiveTab] = useState('items');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showMenuItemModal, setShowMenuItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Extract menu items from data
  const menuItems = menuData?.items || menuData || [];

  // Filter items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || 
      item.category_id === filterCategory || 
      item.category?.id === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle menu item actions
  const handleEditMenuItem = (item) => {
    setSelectedMenuItem(item);
    setShowMenuItemModal(true);
  };

  const handleDeleteMenuItem = async (item) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      await onDeleteMenuItem(item.id);
    }
  };

  const handleToggleAvailability = async (item) => {
    await onToggleAvailability(item.id);
  };

  const handleTogglePopular = async (item) => {
    await onTogglePopular(item.id);
  };

  // Handle category actions
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (category) => {
    if (confirm(`Delete category "${category.name}"? All items in this category will be moved to "Uncategorized".`)) {
      await onDeleteCategory(category.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Error Loading Menu</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={onRefresh}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your restaurant's menu items and categories
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl flex items-center gap-2 transition"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowMenuItemModal(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {menuStats && (
        <MenuStats stats={menuStats} />
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab('items')}
            className={`py-3 border-b-2 font-medium text-sm transition ${activeTab === 'items' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-3 border-b-2 font-medium text-sm transition ${activeTab === 'categories' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Categories ({categories.length})
          </button>
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'items' ? (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* View Mode and Filters */}
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="popular">Popular</option>
              </select>
            </div>
          </div>

          {/* Menu Items Display */}
          {filteredItems.length > 0 ? (
            <MenuItemsGrid
              items={filteredItems}
              viewMode={viewMode}
              onEdit={handleEditMenuItem}
              onDelete={handleDeleteMenuItem}
              onToggleAvailability={handleToggleAvailability}
              onTogglePopular={handleTogglePopular}
              userRole={userRole}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Menu Items Found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterCategory !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first menu item'}
              </p>
              <button
                onClick={() => {
                  setShowMenuItemModal(true);
                  setSearchQuery('');
                  setFilterCategory('all');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Menu Item
              </button>
            </div>
          )}
        </div>
      ) : (
        <MenuCategories
          categories={categories}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
          onAdd={() => setShowCategoryModal(true)}
          userRole={userRole}
        />
      )}

      {/* Modals */}
      <MenuItemModal
        isOpen={showMenuItemModal}
        onClose={() => {
          setShowMenuItemModal(false);
          setSelectedMenuItem(null);
        }}
        onSubmit={selectedMenuItem ? onUpdateMenuItem : onAddMenuItem}
        categories={categories}
        initialData={selectedMenuItem}
      />

      <CategoryModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={selectedCategory ? onUpdateCategory : onAddCategory}
        initialData={selectedCategory}
      />
    </div>
  );
}