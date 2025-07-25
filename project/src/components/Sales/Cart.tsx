import React, { useState } from 'react';
import { Trash2, Plus, Minus, User, Percent, CreditCard, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer } from '../../types';
import Receipt from './Receipt';

const Cart = () => {
  const {
    state,
    removeFromCart,
    updateQuantity,
    clearCart,
    setDiscount,
    setSelectedCustomer,
    completeTransaction,
    getCartSubtotal,
    getCartTotal,
    getCartTax,
    getCartTotalWithTax,
  } = useApp();

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [discountInput, setDiscountInput] = useState(state.discount.toString());
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  const handleDiscountChange = (value: string) => {
    setDiscountInput(value);
    const discount = parseFloat(value) || 0;
    setDiscount(discount);
  };

  const handlePayment = (method: string) => {
    const transaction = completeTransaction(method);
    if (transaction) {
      setLastTransaction(transaction);
      setShowReceipt(true);
    }
  };

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: null },
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'wallet', label: 'Wallet', icon: null },
  ];

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-auto p-4">
        {state.cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No items in cart</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.cart.map((item) => (
              <div key={item.product.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{item.product.name}</h4>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="bg-white border rounded p-1 hover:bg-gray-50"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="bg-white border rounded p-1 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium">${item.subtotal.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary */}
      {state.cart.length > 0 && (
        <div className="border-t p-4 space-y-4">
          {/* Customer Selection */}
          <div>
            <button
              onClick={() => setShowCustomerModal(true)}
              className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm">
                  {state.selectedCustomer ? state.selectedCustomer.name : 'Select Customer (Optional)'}
                </span>
              </div>
              {state.selectedCustomer && (
                <span className="text-xs text-blue-600">
                  {state.selectedCustomer.loyaltyPoints} pts
                </span>
              )}
            </button>
          </div>

          {/* Discount */}
          <div>
            <div className="flex items-center space-x-2">
              <Percent className="h-4 w-4 text-gray-500" />
              <input
                type="number"
                value={discountInput}
                onChange={(e) => handleDiscountChange(e.target.value)}
                placeholder="Discount ($)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${getCartSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (GST):</span>
              <span>${getCartTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total with Tax:</span>
              <span>${getCartTotalWithTax().toFixed(2)}</span>
            </div>
            {state.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-${state.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Payment Method:</p>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handlePayment(method.id)}
                    className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="text-sm font-medium">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      )}

      {/* Customer Selection Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-96 overflow-auto">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Select Customer</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCustomer(null);
                    setShowCustomerModal(false);
                  }}
                  className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                >
                  <span className="text-gray-500">No Customer</span>
                </button>
                {state.customers.map((customer) => (
                  <button
                    key={customer.id}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerModal(false);
                    }}
                    className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.phone}</p>
                      <p className="text-xs text-blue-600">{customer.loyaltyPoints} loyalty points</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t">
              <button
                onClick={() => setShowCustomerModal(false)}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <Receipt
          transaction={lastTransaction}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
};

export default Cart;