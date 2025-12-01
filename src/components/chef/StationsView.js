import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Save, X, Search, Filter, Users, Clock, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function StationView({
  stations,
  orders,
  onAddStation,
  onUpdateStation,
  onDeleteStation,
  setStationFilter,
  setActiveView,
  kitchenStats
}) {
  const { t } = useTranslation('chef');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '🔥',
    color: 'bg-gradient-to-r from-orange-500 to-red-500',
    defaultPrepTime: 15,
    maxCapacity: 5
  });

  const stationIcons = ['🔥', '🥗', '🍕', '🍰', '🥤', '🍳', '🥘', '🍗'];
  const stationColors = [
    'bg-gradient-to-r from-orange-500 to-red-500',
    'bg-gradient-to-r from-green-500 to-emerald-500',
    'bg-gradient-to-r from-yellow-500 to-amber-500',
    'bg-gradient-to-r from-purple-500 to-pink-500',
    'bg-gradient-to-r from-blue-500 to-cyan-500',
    'bg-gradient-to-r from-red-500 to-pink-500',
    'bg-gradient-to-r from-indigo-500 to-purple-500',
    'bg-gradient-to-r from-teal-500 to-green-500'
  ];

  const getStationStats = (stationId) => {
    const stationOrders = orders.filter(order => 
      order.items?.some(item => item.station === stationId)
    );
    
    const activeOrders = stationOrders.filter(o => o.status !== 'completed');
    const completedToday = stationOrders.filter(o => {
      const today = new Date().toDateString();
      const orderDate = new Date(o.createdAt).toDateString();
      return o.status === 'completed' && today === orderDate;
    }).length;

    const avgPrepTime = activeOrders.length > 0 
      ? Math.round(activeOrders.reduce((sum, o) => sum + (o.prepTime || 0), 0) / activeOrders.length)
      : 0;

    return {
      active: activeOrders.length,
      completedToday,
      avgPrepTime,
      efficiency: activeOrders.length > 0 ? Math.min(95, 100 - (avgPrepTime - 15)) : 100
    };
  };

  const filteredStations = stations.filter(station => {
    if (filter === 'busy' && getStationStats(station.id).active < 3) return false;
    if (filter === 'available' && getStationStats(station.id).active > 0) return false;
    if (searchQuery) {
      return station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             station.description?.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const handleAddStation = () => {
    if (!formData.name.trim()) return;
    
    const newStation = {
      id: `station_${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onAddStation(newStation);
    setIsAdding(false);
    resetForm();
  };

  const handleUpdateStation = () => {
    if (!formData.name.trim()) return;
    
    onUpdateStation(editingId, formData);
    setEditingId(null);
    resetForm();
  };

  const handleDeleteStation = (stationId, stationName) => {
    if (window.confirm(`${t('stations.confirmDelete')} "${stationName}"?`)) {
      onDeleteStation(stationId);
    }
  };

  const handleEditStation = (station) => {
    setEditingId(station.id);
    setFormData({
      name: station.name,
      description: station.description || '',
      icon: station.icon || '🔥',
      color: station.color || stationColors[0],
      defaultPrepTime: station.defaultPrepTime || 15,
      maxCapacity: station.maxCapacity || 5
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '🔥',
      color: 'bg-gradient-to-r from-orange-500 to-red-500',
      defaultPrepTime: 15,
      maxCapacity: 5
    });
  };

  const getCapacityColor = (station) => {
    const stats = getStationStats(station.id);
    const percentage = (stats.active / station.maxCapacity) * 100;
    
    if (percentage >= 80) return 'text-red-600 bg-red-50';
    if (percentage >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-emerald-600 bg-emerald-50';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('stations.title')}</h1>
          <p className="text-gray-600 mt-1">{t('stations.subtitle')}</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('stations.addStation')}
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('stations.totalStations')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stations.length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('stations.activeStations')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stations.filter(s => getStationStats(s.id).active > 0).length}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('stations.avgEfficiency')}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stations.length > 0 
                  ? Math.round(stations.reduce((sum, s) => sum + getStationStats(s.id).efficiency, 0) / stations.length)
                  : 0}%
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder={t('stations.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border text-black border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('stations.all')}
          </button>
          <button
            onClick={() => setFilter('busy')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filter === 'busy' 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('stations.busy')}
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filter === 'available' 
                ? 'bg-orange-50 border-orange-200 text-orange-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t('stations.available')}
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? t('stations.editStation') : t('stations.addStation')}
            </h3>
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                resetForm();
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('stations.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder={t('stations.namePlaceholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('stations.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  rows="3"
                  placeholder={t('stations.descriptionPlaceholder')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('stations.defaultPrepTime')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={formData.defaultPrepTime}
                      onChange={(e) => setFormData({...formData, defaultPrepTime: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {t('stations.minutes')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('stations.maxCapacity')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({...formData, maxCapacity: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('stations.selectIcon')}
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {stationIcons.map((icon, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({...formData, icon})}
                      className={`p-4 rounded-xl border-2 text-2xl transition-all ${
                        formData.icon === icon 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  {t('stations.selectColor')}
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {stationColors.map((color, index) => (
                    <button
                      key={index}
                      onClick={() => setFormData({...formData, color})}
                      className={`h-12 rounded-lg border-2 transition-all ${
                        formData.color === color 
                          ? 'border-orange-500 ring-2 ring-orange-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      } ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={editingId ? handleUpdateStation : handleAddStation}
                  className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4 inline-block mr-2" />
                  {editingId ? t('stations.update') : t('stations.add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStations.map(station => {
          const stats = getStationStats(station.id);
          const capacityColor = getCapacityColor(station);
          
          return (
            <div key={station.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Station Header */}
              <div className={`h-2 ${station.color}`}></div>
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gray-50">
                      <span className="text-2xl">{station.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{station.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{station.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditStation(station)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title={t('stations.edit')}
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteStation(station.id, station.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('stations.delete')}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Station Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{t('stations.activeOrders')}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stats.active}</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">{t('stations.efficiency')}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{stats.efficiency}%</p>
                  </div>
                </div>

                {/* Capacity Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{t('stations.capacity')}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${capacityColor}`}>
                      {stats.active}/{station.maxCapacity}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        (stats.active / station.maxCapacity) * 100 >= 80 ? 'bg-red-500' :
                        (stats.active / station.maxCapacity) * 100 >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(stats.active / station.maxCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setStationFilter(station.id);
                      setActiveView('orders');
                    }}
                    className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {t('stations.viewOrders')}
                  </button>
                  <button
                    onClick={() => handleEditStation(station)}
                    className="flex-1 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    {t('stations.edit')}
                  </button>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{station.defaultPrepTime}m {t('stations.prepTime')}</span>
                  </div>
                  <span>
                    {new Date(station.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredStations.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t('stations.noStations')}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filter !== 'all' 
              ? t('stations.noResults')
              : t('stations.emptyDescription')}
          </p>
          <button
            onClick={() => {
              setIsAdding(true);
              setSearchQuery('');
              setFilter('all');
            }}
            className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 inline-block mr-2" />
            {t('stations.addFirstStation')}
          </button>
        </div>
      )}
    </div>
  );
}