import React, { useState } from 'react';
import { X, AlertTriangle, DollarSign } from 'lucide-react';
import { Transaction } from '../../types';
import { useApp } from '../../context/AppContext';

interface RefundModalProps {
  transaction: Transaction;
  onClose: () => void;
  onRefund: (amount: number, reason: string) => void;
}

const RefundModal: React.FC<RefundModalProps> = ({ transaction, onClose, onRefund }) => {
  const [refundAmount, setRefundAmount] = useState('');
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const currentRefundAmount = transaction.refundAmount || 0;
  const maxRefundAmount = transaction.total - currentRefundAmount;
  const isFullRefund = parseFloat(refundAmount) >= maxRefundAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(refundAmount);
    if (amount <= 0 || amount > maxRefundAmount || !reason.trim()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRefund(amount, reason.trim());
    setIsProcessing(false);
  };

  const presetReasons = [
    'Defective product',
    'Wrong item received',
    'Customer changed mind',
    'Damaged during shipping',
    'Not as described',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Process Refund</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Transaction Info */}
        <div className="p-6 border-b bg-gray-50">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">#{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Original Amount:</span>
              <span className="font-medium">${transaction.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Already Refunded:</span>
              <span className="font-medium text-red-600">${currentRefundAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Available for Refund:</span>
              <span className="font-bold text-green-600">${maxRefundAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Refund Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Refund Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={maxRefundAmount}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={() => setRefundAmount(maxRefundAmount.toString())}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Full Refund
              </button>
              <span className="text-xs text-gray-500">
                Max: ${maxRefundAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              required
            >
              <option value="">Select a reason</option>
              {presetReasons.map((presetReason) => (
                <option key={presetReason} value={presetReason}>
                  {presetReason}
                </option>
              ))}
            </select>
            {reason === 'Other' && (
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please specify the reason..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
            )}
          </div>

          {/* Warning for Full Refund */}
          {isFullRefund && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">Full Refund Notice</p>
                <p className="text-amber-700">
                  This will mark the transaction as fully refunded and restore inventory.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isProcessing || !refundAmount || !reason}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : `Refund $${refundAmount || '0.00'}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundModal;