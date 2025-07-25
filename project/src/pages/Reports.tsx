import React, { useState } from 'react';
import { Calendar, DollarSign, ShoppingBag, Users, TrendingUp, Receipt, PieChart, BarChart3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Reports = () => {
  const { state } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return state.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      switch (selectedPeriod) {
        case 'today':
          return transactionDate >= today;
        case 'month':
          return transactionDate >= thisMonth;
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalTax = filteredTransactions.reduce((sum, t) => sum + t.totalTax, 0);
  const totalProfit = filteredTransactions.reduce((sum, t) => sum + t.profit, 0);
  const totalCost = filteredTransactions.reduce((sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + (item.product.costPrice * item.quantity), 0), 0);
  const totalOrders = filteredTransactions.length;
  const totalRefunds = state.refunds?.reduce((sum, r) => sum + r.amount, 0) || 0;
  const refundedTransactions = filteredTransactions.filter(t => t.status === 'refunded' || t.status === 'partially_refunded').length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const uniqueCustomers = new Set(filteredTransactions.filter(t => t.customerId).map(t => t.customerId)).size;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  const topProducts = state.products
    .map(product => {
      const soldQuantity = filteredTransactions.reduce((sum, transaction) => {
        const item = transaction.items.find(item => item.product.id === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0);
      const revenue = filteredTransactions.reduce((sum, transaction) => {
        const item = transaction.items.find(item => item.product.id === product.id);
        return sum + (item ? item.subtotal : 0);
      }, 0);
      
      return { ...product, soldQuantity, revenue };
    })
    .filter(product => product.soldQuantity > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const recentTransactions = [...filteredTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Sales analytics and insights</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="today">Today</option>
          <option value="month">This Month</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Profit</p>
              <p className="text-2xl font-bold text-blue-600">${totalProfit.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tax (GST)</p>
              <p className="text-2xl font-bold text-purple-600">${totalTax.toFixed(2)}</p>
            </div>
            <Receipt className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-orange-600">{profitMargin.toFixed(1)}%</p>
            </div>
            <PieChart className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Additional Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-indigo-600">{totalOrders}</p>
            </div>
            <ShoppingBag className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-cyan-600">${averageOrderValue.toFixed(2)}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-cyan-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refunded Orders</p>
              <p className="text-2xl font-bold text-pink-600">{refundedTransactions}</p>
            </div>
            <Users className="h-8 w-8 text-pink-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Refunds</p>
              <p className="text-2xl font-bold text-red-600">${totalRefunds.toFixed(2)}</p>
            </div>
            <Receipt className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST/Tax Report */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">GST/Tax Report</h2>
          </div>
          <div className="p-6">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {/* Tax Rate Breakdown */}
                {[12, 18].map(rate => {
                  const rateTransactions = filteredTransactions.filter(t => 
                    t.items.some(item => item.product.taxRate === rate)
                  );
                  const rateTax = rateTransactions.reduce((sum, t) => 
                    sum + t.items.filter(item => item.product.taxRate === rate)
                      .reduce((itemSum, item) => itemSum + item.taxAmount, 0), 0
                  );
                  const rateSubtotal = rateTransactions.reduce((sum, t) => 
                    sum + t.items.filter(item => item.product.taxRate === rate)
                      .reduce((itemSum, item) => itemSum + item.subtotal, 0), 0
                  );
                  
                  if (rateTax > 0) {
                    return (
                      <div key={rate} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900">GST @ {rate}%</h4>
                          <span className="text-sm text-gray-500">{rateTransactions.length} transactions</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Taxable Amount</p>
                            <p className="font-medium">${rateSubtotal.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Tax Amount</p>
                            <p className="font-medium text-purple-600">${rateTax.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total Tax Collected</span>
                    <span className="text-lg font-bold text-purple-600">${totalTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No tax data available</p>
            )}
          </div>
        </div>

        {/* Profit & Loss Report */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Profit & Loss</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-3">Revenue</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-700">Gross Sales</span>
                    <span className="font-medium">${(totalRevenue + totalTax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Less: Tax</span>
                    <span className="font-medium">-${totalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-green-800">Net Sales</span>
                    <span className="font-bold">${totalRevenue.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 mb-3">Costs</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Cost of Goods Sold</span>
                    <span className="font-medium">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-3">Profit Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Gross Profit</span>
                    <span className="font-medium">${totalProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Profit Margin</span>
                    <span className="font-medium">{profitMargin.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium text-blue-800">Net Profit</span>
                    <span className="font-bold">${totalProfit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
          </div>
          <div className="p-6">
            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.soldQuantity} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No sales data available</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <div className="p-6">
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">#{transaction.id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {transaction.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${transaction.total.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{transaction.items.length} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No transactions available</p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['cash', 'card', 'upi', 'wallet'].map(method => {
              const methodTransactions = filteredTransactions.filter(t => t.paymentMethod === method);
              const methodRevenue = methodTransactions.reduce((sum, t) => sum + t.total, 0);
              const percentage = totalRevenue > 0 ? (methodRevenue / totalRevenue) * 100 : 0;
              
              return (
                <div key={method} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize mb-2">{method}</p>
                  <p className="text-xl font-bold text-gray-900">${methodRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>
        </div>
        
        {/* Category Performance */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Category Performance</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['Electronics', 'Home & Garden', 'Stationery'].map(category => {
                const categoryItems = filteredTransactions.flatMap(t => 
                  t.items.filter(item => item.product.category === category)
                );
                const categoryRevenue = categoryItems.reduce((sum, item) => sum + item.totalWithTax, 0);
                const categoryProfit = categoryItems.reduce((sum, item) => 
                  sum + ((item.product.price - item.product.costPrice) * item.quantity), 0
                );
                const categoryMargin = categoryRevenue > 0 ? (categoryProfit / categoryRevenue) * 100 : 0;
                
                if (categoryRevenue > 0) {
                  return (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-medium">${categoryRevenue.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Profit</p>
                          <p className="font-medium text-green-600">${categoryProfit.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Margin</p>
                          <p className="font-medium text-blue-600">{categoryMargin.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;