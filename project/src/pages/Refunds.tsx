import React, { useState } from 'react';
import { Search, RefreshCw, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Transaction } from '../types';
import RefundModal from '../components/Refunds/RefundModal';

const Refunds = () => {
  const { state, processRefund } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const filteredTransactions = state.transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.customerId && state.customers.find(c => c.id === transaction.customerId)?.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRefund = (amount: number, reason: string) => {
    if (selectedTransaction) {
      const success = processRefund(selectedTransaction.id, amount, reason);
      if (success) {
        setShowRefundModal(false);
        setSelectedTransaction(null);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'refunded':
        return <RefreshCw className="h-4 w-4 text-red-500" />;
      case 'partially_refunded':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'refunded':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'partially_refunded':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const totalRefunds = state.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  const refundedTransactions = state.transactions.filter(t => t.status === 'refunded').length;
  const partialRefunds = state.transactions.filter(t => t.status === 'partially_refunded').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Refunds</h1>
          <p className="text-gray-600">Manage transaction refunds and returns</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Refunds</p>
              <p className="text-2xl font-bold text-red-600">${totalRefunds.toFixed(2)}</p>
            </div>
            <RefreshCw className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refunded Orders</p>
              <p className="text-2xl font-bold text-red-600">{refundedTransactions}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Partial Refunds</p>
              <p className="text-2xl font-bold text-amber-600">{partialRefunds}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Refund Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {state.transactions.length > 0 
                  ? ((refundedTransactions + partialRefunds) / state.transactions.length * 100).toFixed(1)
                  : 0
                }%
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by transaction ID or customer..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Transactions</option>
            <option value="completed">Completed</option>
            <option value="partially_refunded">Partially Refunded</option>
            <option value="refunded">Fully Refunded</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Refund Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const customer = transaction.customerId 
                  ? state.customers.find(c => c.id === transaction.customerId)
                  : null;
                const canRefund = transaction.status !== 'refunded' && 
                  (transaction.refundAmount || 0) < transaction.total;
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.status)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">#{transaction.id}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {customer ? customer.name : 'Walk-in Customer'}
                      </div>
                      {customer && (
                        <div className="text-sm text-gray-500">{customer.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${transaction.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {transaction.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(transaction.status)}>
                        {transaction.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {transaction.refundAmount ? (
                        <div>
                          <div className="text-sm font-medium text-red-600">
                            -${transaction.refundAmount.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.refundReason}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No refunds</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {canRefund ? (
                        <button
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowRefundModal(true);
                          }}
                          className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span>Refund</span>
                        </button>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No transactions found</p>
          </div>
        )}
      </div>

      {/* Refund Modal */}
      {showRefundModal && selectedTransaction && (
        <RefundModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedTransaction(null);
          }}
          onRefund={handleRefund}
        />
      )}
    </div>
  );
};

export default Refunds;