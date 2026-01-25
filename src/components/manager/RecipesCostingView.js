'use client';
import { useState } from 'react';
import {
  ChefHat, DollarSign, TrendingUp, TrendingDown, Percent,
  Calculator, PieChart, Target, AlertCircle, BarChart3,
  Search, Filter, Download, Plus, Edit, Trash2, Eye,
  RefreshCw, ChevronDown, Package, Users, Clock,
  CheckCircle, XCircle, Star, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

export default function RecipesCostingView({
  menuItems = [],
  costingAnalysis = {},
  profitabilityData = {},
  onRefresh,
  onEditRecipe,
  onUpdateCosting,
  onGenerateReport,
  onCalculateOptimalPrices,
  isLoading = false,
  error = null,
  userRole = 'manager'
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [profitabilityFilter, setProfitabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);

  // Calculate categories from menu items
  const categories = ['all', ...new Set(menuItems.map(item => item.category).filter(Boolean))];

  // Filter and sort menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    const matchesProfitability = profitabilityFilter === 'all' || 
      (profitabilityFilter === 'high' && item.profitMargin >= 70) ||
      (profitabilityFilter === 'medium' && item.profitMargin >= 40 && item.profitMargin < 70) ||
      (profitabilityFilter === 'low' && item.profitMargin < 40);

    return matchesSearch && matchesCategory && matchesProfitability;
  }).sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc'
        ? a.name?.localeCompare(b.name)
        : b.name?.localeCompare(a.name);
    }
    if (sortBy === 'profitMargin') {
      return sortOrder === 'asc'
        ? a.profitMargin - b.profitMargin
        : b.profitMargin - a.profitMargin;
    }
    if (sortBy === 'popularity') {
      return sortOrder === 'asc'
        ? a.popularity - b.popularity
        : b.popularity - a.popularity;
    }
    return 0;
  });

  // Calculate summary stats
  const totalItems = menuItems.length;
  const avgCost = menuItems.length > 0
    ? menuItems.reduce((sum, item) => sum + item.cost, 0) / menuItems.length
    : 0;
  const avgPrice = menuItems.length > 0
    ? menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length
    : 0;
  const avgMargin = menuItems.length > 0
    ? menuItems.reduce((sum, item) => sum + item.profitMargin, 0) / menuItems.length
    : 0;

  const getProfitabilityBadge = (margin) => {
    if (margin >= 70) return { label: 'High', color: 'green', bg: 'bg-green-100', text: 'text-green-700' };
    if (margin >= 40) return { label: 'Medium', color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { label: 'Low', color: 'red', bg: 'bg-red-100', text: 'text-red-700' };
  };

  const getPopularityBadge = (popularity) => {
    if (popularity >= 80) return { label: 'Very Popular', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-700' };
    if (popularity >= 60) return { label: 'Popular', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-700' };
    if (popularity >= 40) return { label: 'Average', color: 'green', bg: 'bg-green-100', text: 'text-green-700' };
    return { label: 'Low', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredMenuItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredMenuItems.map(item => item.id));
    }
  };

  const formatCurrency = (amount) => {
    return `ETB ${amount?.toFixed(2) || '0.00'}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Recipes & Costing</h3>
          <p className="text-gray-600 mt-1">Analyze recipe costs, optimize pricing, and maximize profitability</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onCalculateOptimalPrices && onCalculateOptimalPrices()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition"
          >
            <Calculator className="w-4 h-4" />
            <span>Optimize Prices</span>
          </button>
          <button
            onClick={() => onGenerateReport && onGenerateReport()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Cost Report</span>
          </button>
          <button
            onClick={() => onRefresh && onRefresh()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-purple-50">
              <ChefHat className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-emerald-600">
              +{Math.floor(totalItems * 0.05)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{totalItems}</p>
          <p className="text-sm text-gray-600">Total Recipes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-blue-50">
              <Percent className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${
              avgMargin >= 60 ? 'text-emerald-600' : avgMargin >= 40 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {avgMargin.toFixed(1)}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{avgMargin.toFixed(1)}%</p>
          <p className="text-sm text-gray-600">Avg. Margin</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-green-50">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-emerald-600">
              {(avgPrice - avgCost).toFixed(2)}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{formatCurrency(avgPrice - avgCost)}</p>
          <p className="text-sm text-gray-600">Avg. Profit per Item</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-orange-50">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-emerald-600">
              {costingAnalysis?.totalMonthlyProfit ? `ETB ${(costingAnalysis.totalMonthlyProfit / 1000).toFixed(1)}K` : '—'}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {costingAnalysis?.foodCostPercentage ? `${costingAnalysis.foodCostPercentage}%` : '—'}
          </p>
          <p className="text-sm text-gray-600">Food Cost %</p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes by name or ingredients..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.slice(1).map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={profitabilityFilter}
              onChange={(e) => setProfitabilityFilter(e.target.value)}
            >
              <option value="all">All Profitability</option>
              <option value="high">High Margin (≥70%)</option>
              <option value="medium">Medium Margin (40-69%)</option>
              <option value="low">Low Margin (&lt;40%)</option>
            </select>

            <select
              className="border border-gray-300 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="profitMargin">Sort by Profit Margin</option>
              <option value="popularity">Sort by Popularity</option>
              <option value="price">Sort by Price</option>
              <option value="cost">Sort by Cost</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2.5 border border-gray-300 rounded-xl hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <p className="text-blue-700 font-medium">
              {selectedItems.length} recipe{selectedItems.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => alert(`Bulk update ${selectedItems.length} recipes`)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Update Costing
              </button>
              <button
                onClick={() => alert(`Bulk price adjustment for ${selectedItems.length} recipes`)}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
              >
                Adjust Prices
              </button>
              <button
                onClick={() => setSelectedItems([])}
                className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recipes Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredMenuItems.length && filteredMenuItems.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Recipe</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Cost</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Price</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Profit</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Margin</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Popularity</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center">
                    <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredMenuItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
                    {searchQuery || selectedCategory !== 'all' || profitabilityFilter !== 'all'
                      ? 'No recipes match your filters'
                      : 'No recipes found'}
                  </td>
                </tr>
              ) : (
                filteredMenuItems.map((item) => {
                  const profit = item.price - item.cost;
                  const margin = item.profitMargin || ((profit / item.price) * 100);
                  const profitabilityBadge = getProfitabilityBadge(margin);
                  const popularityBadge = getPopularityBadge(item.popularity || 50);

                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <ChefHat className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                          {item.category || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 font-medium">{formatCurrency(item.cost)}</p>
                        <p className="text-xs text-gray-500">{item.ingredientCount || '?'} ingredients</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-900 font-bold">{formatCurrency(item.price)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <span className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(profit)}
                          </span>
                          {profit >= 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${profitabilityBadge.bg} ${profitabilityBadge.text}`}>
                            {margin.toFixed(1)}%
                          </span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                margin >= 70 ? 'bg-green-500' :
                                margin >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              } rounded-full`}
                              style={{ width: `${Math.min(margin, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${popularityBadge.bg} ${popularityBadge.text}`}>
                            {(item.popularity || 50).toFixed(0)}%
                          </span>
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onEditRecipe && onEditRecipe(item.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Recipe"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onUpdateCosting && onUpdateCosting(item.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Update Costing"
                          >
                            <Calculator className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {/* View details */}}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profitability Analysis */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-gray-900">Profitability Analysis</h4>
            <select className="border border-gray-300 rounded-xl px-3 py-2 text-sm">
              <option>This Month</option>
              <option>Last Month</option>
              <option>Quarterly</option>
            </select>
          </div>
          <div className="space-y-4">
            {profitabilityData.topPerforming?.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category} • {item.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{item.margin.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">ETB {item.profit?.toFixed(2)} profit each</p>
                </div>
              </div>
            ))}
            {profitabilityData.lowPerforming?.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-red-600">Low margin: {item.margin.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={() => onUpdateCosting && onUpdateCosting(item.id)}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                  >
                    Adjust
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Cost Categories</h4>
          <div className="space-y-4">
            {costingAnalysis.categories?.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="text-sm font-bold text-gray-900">{formatCurrency(category.cost)}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{category.percentage.toFixed(1)}% of total cost</span>
                  <span>{category.items} items</span>
                </div>
              </div>
            )) || (
              <div className="space-y-2">
                {[
                  { name: 'Protein', cost: 15420, percentage: 42, items: 15 },
                  { name: 'Vegetables', cost: 8920, percentage: 24, items: 28 },
                  { name: 'Dairy', cost: 6540, percentage: 18, items: 12 },
                  { name: 'Grains', cost: 3850, percentage: 11, items: 18 },
                  { name: 'Spices', cost: 2110, percentage: 5, items: 35 },
                ].map((category, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{category.name}</span>
                      <span className="text-sm font-bold text-gray-900">{formatCurrency(category.cost)}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{category.percentage}% of total cost</span>
                      <span>{category.items} items</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Total Food Cost</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(costingAnalysis.totalFoodCost || 36840)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Cost Optimization Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">High-Cost Ingredients</p>
                <p className="text-sm text-gray-600 mt-1">
                  Consider alternative suppliers for truffles, caviar, and wagyu beef which account for 35% of total food cost.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <Calculator className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Portion Control</p>
                <p className="text-sm text-gray-600 mt-1">
                  Reduce steak portions by 10% to maintain quality while lowering costs by ETB 2,400/month.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <Target className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Price Optimization</p>
                <p className="text-sm text-gray-600 mt-1">
                  Increase prices on 5 low-margin items by 5-8% to improve overall profitability by ETB 3,200/month.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <PieChart className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Waste Reduction</p>
                <p className="text-sm text-gray-600 mt-1">
                  Current waste rate is 8.5%. Target reduction to 6% could save ETB 1,800/month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}