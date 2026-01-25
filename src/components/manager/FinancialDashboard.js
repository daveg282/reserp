'use client';

import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Download,
  Calendar,
  Filter,
  Users,
  CreditCard,
  Smartphone,
  Wallet,
  Percent,
  XCircle,
  BarChart3,
  Receipt,
  Calculator,
  WalletCards,
  Activity,
  Target,
  UserCheck
} from 'lucide-react';

export default function FinancialDashboard({ 
  financialData,
  vatData,
  profitLossData,
  isLoading,
  error,
  onRefresh,
  onExport,
  onDateRangeChange,
  period = 'month',
  startDate,
  endDate,
  // Which view to show (from sidebar)
  viewType = 'summary' // 'summary', 'profit-loss', or 'vat'
}) {
  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0.00 ETB';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return numAmount.toLocaleString('en-ET', { 
      style: 'currency', 
      currency: 'ETB',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Calculate profit metrics from profitLossData
  const calculateNetProfit = () => {
    if (!profitLossData?.net_profit) return null;
    
    return {
      amount: profitLossData.net_profit.amount || 0,
      margin: profitLossData.net_profit.margin || 0,
      is_profitable: profitLossData.net_profit.is_profitable || false
    };
  };

  const netProfit = calculateNetProfit();

  // Get title based on viewType
  const getTitle = () => {
    switch(viewType) {
      case 'profit-loss': return 'Profit & Loss Statement';
      case 'vat': return 'VAT Report';
      case 'summary':
      default: return 'Financial Summary';
    }
  };

  // Get description based on viewType
  const getDescription = () => {
    switch(viewType) {
      case 'profit-loss': return 'Detailed profit and loss analysis';
      case 'vat': return 'VAT compliance and reporting';
      case 'summary':
      default: return 'Comprehensive financial overview';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 text-black">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {getDescription()}
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition disabled:opacity-50 text-sm sm:text-base"
          >
            <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={onExport}
            disabled={isLoading}
            className="flex items-center justify-center space-x-1 sm:space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold transition disabled:opacity-50 text-sm sm:text-base"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          <select
            value={period}
            onChange={(e) => onDateRangeChange && onDateRangeChange(e.target.value, startDate, endDate)}
            className="border border-gray-300 text-black rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base w-full md:w-auto"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
        
        {period === 'custom' && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={startDate || ''}
                onChange={(e) => {
                  if (onDateRangeChange) {
                    onDateRangeChange('custom', e.target.value, endDate);
                  }
                }}
                className="border border-gray-300 text-black rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">to</span>
              <input
                type="date"
                value={endDate || ''}
                onChange={(e) => {
                  if (onDateRangeChange) {
                    onDateRangeChange('custom', startDate, e.target.value);
                  }
                }}
                className="border border-gray-300 text-black rounded-xl px-3 sm:px-4 py-2 sm:py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex justify-between items-center">
            <p className="text-red-700 text-sm sm:text-base">{error}</p>
            <button
              onClick={() => {}}
              className="text-red-500 hover:text-red-700"
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
          <span className="ml-3 text-gray-600">Loading financial reports...</span>
        </div>
      )}

      {/* Main Content - NO TABS, just render based on viewType */}
      {!isLoading && (
        <div className="space-y-6">
          {viewType === 'summary' && (
            <SummaryView 
              financialData={financialData}
              profitLossData={profitLossData}
              netProfit={netProfit}
              formatCurrency={formatCurrency}
            />
          )}
          
          {viewType === 'profit-loss' && (
            <ProfitLossView 
              profitLossData={profitLossData}
              netProfit={netProfit}
              formatCurrency={formatCurrency}
            />
          )}
          
          {viewType === 'vat' && (
            <VATView 
              vatData={vatData}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      )}
    </div>
  );
}

// Sub-components for each view
function SummaryView({ financialData, profitLossData, netProfit, formatCurrency }) {
  if (!financialData && !profitLossData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No financial data available</p>
      </div>
    );
  }

  // Use financialData if available, otherwise fallback to profitLossData
  const displayData = financialData || {};
  const revenueData = profitLossData?.revenue || {};

  return (
    <>
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 text-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-blue-700 font-medium">Total Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-900 mt-1">
                {formatCurrency(displayData.total_revenue || revenueData.total_revenue || 0)}
              </p>
              <p className="text-xs text-blue-600 mt-1 flex items-center">
                <Users className="w-3 h-3 mr-1" />
                {displayData.transaction_count || revenueData.transaction_count || 0} transactions
              </p>
            </div>
            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
        </div>
        
        {/* VAT Collected */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-green-700 font-medium">VAT Collected</p>
              <p className="text-xl sm:text-2xl font-bold text-green-900 mt-1">
                {formatCurrency(displayData.vat_collected || revenueData.vat_collected || 0)}
              </p>
              <p className="text-xs text-green-600 mt-1 flex items-center">
                <Percent className="w-3 h-3 mr-1" />
                15% VAT Rate
              </p>
            </div>
            <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          </div>
        </div>
        
        {/* Net Profit */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-purple-700 font-medium">Net Profit</p>
              <p className={`text-xl sm:text-2xl font-bold mt-1 ${
                netProfit?.is_profitable ? 'text-green-900' : 'text-red-900'
              }`}>
                {formatCurrency(netProfit?.amount || 0)}
              </p>
              <p className={`text-xs mt-1 flex items-center ${
                netProfit?.is_profitable ? 'text-green-600' : 'text-red-600'
              }`}>
                {netProfit?.is_profitable ? (
                  <>
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {netProfit?.margin?.toFixed(2)}% margin
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {netProfit?.margin?.toFixed(2)}% margin
                  </>
                )}
              </p>
            </div>
            {netProfit?.is_profitable ? (
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            ) : (
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
            )}
          </div>
        </div>
        
        {/* Average Order */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-orange-700 font-medium">Avg Order Value</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-900 mt-1">
                {formatCurrency(displayData.avg_transaction_value || revenueData.avg_transaction_value || 0)}
              </p>
              <p className="text-xs text-orange-600 mt-1 flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Revenue per transaction
              </p>
            </div>
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Cash</p>
                <p className="text-xl font-bold text-green-700">
                  {formatCurrency(displayData.payment_methods?.cash || 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Card</p>
                <p className="text-xl font-bold text-blue-700">
                  {formatCurrency(displayData.payment_methods?.card || 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center mb-3">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile</p>
                <p className="text-xl font-bold text-purple-700">
                  {formatCurrency(displayData.payment_methods?.mobile || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
        <div className="bg-white rounded-xl border p-4 sm:p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tips & Discounts</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <WalletCards className="w-4 h-4 text-green-600 mr-3" />
                <span>Tips Collected</span>
              </div>
              <span className="font-bold text-green-700">
                {formatCurrency(displayData.tips_collected || revenueData.tips_collected || 0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <Percent className="w-4 h-4 text-red-600 mr-3" />
                <span>Discounts Given</span>
              </div>
              <span className="font-bold text-red-700">
                {formatCurrency(displayData.discounts_given || revenueData.discounts_given || 0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Calculator className="w-4 h-4 text-blue-600 mr-3" />
                <span>Total Collected</span>
              </div>
              <span className="font-bold text-blue-700">
                {formatCurrency(displayData.total_collected || 
                  ((displayData.total_revenue || revenueData.total_revenue || 0) + 
                   (displayData.tips_collected || revenueData.tips_collected || 0)))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 sm:p-6 text-black">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Indicators</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-black">
              <div className="flex items-center">
                <Target className="w-4 h-4 text-gray-600 mr-3" />
                <span className='text-black'>Gross Profit Margin</span>
              </div>
              <span className="font-bold">
                {profitLossData?.gross_profit?.margin?.toFixed(2) || '0.00'}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="w-4 h-4 text-gray-600 mr-3" />
                <span>Net Profit Margin</span>
              </div>
              <span className={`font-bold ${
                netProfit?.is_profitable ? 'text-green-600' : 'text-red-600'
              }`}>
                {netProfit?.margin?.toFixed(2) || '0.00'}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <UserCheck className="w-4 h-4 text-gray-600 mr-3" />
                <span>Revenue per Customer</span>
              </div>
              <span className="font-bold">
                {(displayData.transaction_count || revenueData.transaction_count || 0) > 0 
                  ? formatCurrency(
                      (displayData.total_revenue || revenueData.total_revenue || 0) / 
                      (displayData.transaction_count || revenueData.transaction_count || 1)
                    )
                  : '0.00 ETB'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProfitLossView({ profitLossData, netProfit, formatCurrency }) {
  if (!profitLossData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No profit and loss data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Detailed Profit & Loss Statement</h3>
        <div className="space-y-4">
          {/* Revenue Section */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Revenue</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">Gross Revenue</p>
                <p className="text-lg font-bold text-blue-900">
                  {formatCurrency(profitLossData.revenue?.total_revenue || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">Net Revenue (after VAT)</p>
                <p className="text-lg font-bold text-green-900">
                  {formatCurrency(profitLossData.revenue?.net_revenue || 0)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">VAT Collected</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(profitLossData.revenue?.vat_collected || 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">Tips Collected</p>
                <p className="text-lg font-bold text-yellow-900">
                  {formatCurrency(profitLossData.revenue?.tips_collected || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Profit Section */}
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-gray-700">Profit Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className={`p-4 rounded-lg ${
                profitLossData.gross_profit?.amount > 0 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm">Gross Profit</p>
                <p className={`text-xl font-bold ${
                  profitLossData.gross_profit?.amount > 0 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatCurrency(profitLossData.gross_profit?.amount || 0)}
                </p>
                <p className="text-sm mt-1">
                  Margin: {profitLossData.gross_profit?.margin?.toFixed(2) || '0.00'}%
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${
                netProfit?.is_profitable 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm">Net Profit</p>
                <p className={`text-xl font-bold ${
                  netProfit?.is_profitable ? 'text-green-900' : 'text-red-900'
                }`}>
                  {formatCurrency(netProfit?.amount || 0)}
                </p>
                <p className="text-sm mt-1">
                  Margin: {netProfit?.margin?.toFixed(2) || '0.00'}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VATView({ vatData, formatCurrency }) {
  if (!vatData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No VAT data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-4 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">VAT Report (15% Rate)</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">Total Transactions</p>
              <p className="text-2xl font-bold text-green-900">
                {vatData.summary?.total_transactions || 0}
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">Taxable Amount</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(vatData.summary?.total_taxable_amount || 0)}
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700">VAT Collected</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(vatData.summary?.total_vat_collected || 0)}
              </p>
            </div>
          </div>

          {/* VAT Calculation Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">VAT Calculation Formula</h4>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Formula:</strong> VAT = Subtotal × 15%
              </p>
              <p className="text-sm text-gray-600">
                <strong>Example:</strong> For 100 ETB subtotal, VAT = 100 × 0.15 = 15 ETB
              </p>
              <p className="text-sm text-gray-600">
                <strong>Total Including VAT:</strong> Subtotal + 15% VAT
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}