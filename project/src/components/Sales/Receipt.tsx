import React from 'react';
import { X, Printer as Print, Mail } from 'lucide-react';
import { Transaction } from '../../types';

interface ReceiptProps {
  transaction: Transaction;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ transaction, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    alert('Email sent! (Mock implementation)');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Receipt</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-4">
          {/* Store Info */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">RetailPOS Store</h2>
            <p className="text-sm text-gray-600">123 Main Street</p>
            <p className="text-sm text-gray-600">Phone: (555) 123-4567</p>
          </div>

          {/* Transaction Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Transaction ID:</span>
              <span>#{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{new Date(transaction.date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="capitalize">{transaction.paymentMethod}</span>
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Items:</h4>
            <div className="space-y-2">
              {transaction.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p>{item.product.name}</p>
                    <p className="text-gray-500">{item.quantity} x ${item.product.price}</p>
                  </div>
                  <span>${item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${transaction.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (GST):</span>
              <span>${transaction.totalTax.toFixed(2)}</span>
            </div>
            {transaction.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${transaction.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${transaction.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 border-t pt-4">
            <p>Thank you for your business!</p>
            <p>Have a great day!</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Print className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleEmail}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;