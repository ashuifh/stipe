import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product, Customer, User, Transaction, CartItem, StockLog, RefundTransaction } from '../types';
import { products as initialProducts, customers as initialCustomers, users, mockTransactions, stockLogs } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  products: Product[];
  customers: Customer[];
  transactions: Transaction[];
  refunds: RefundTransaction[];
  stockLogs: StockLog[];
  cart: CartItem[];
  discount: number;
  selectedCustomer: Customer | null;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_DISCOUNT'; payload: number }
  | { type: 'SET_CUSTOMER'; payload: Customer | null }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'ADD_STOCK_LOG'; payload: StockLog }
  | { type: 'UPDATE_STOCK'; payload: { productId: string; quantity: number } }
  | { type: 'PROCESS_REFUND'; payload: { transactionId: string; amount: number; reason: string; refundedBy: string } };

const initialState: AppState = {
  currentUser: null,
  products: initialProducts,
  customers: initialCustomers,
  transactions: mockTransactions,
  refunds: [],
  stockLogs: stockLogs,
  cart: [],
  discount: 0,
  selectedCustomer: null,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDiscount: (discount: number) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  completeTransaction: (paymentMethod: string) => Transaction | null;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartTotalWithTax: () => number;
  processRefund: (transactionId: string, amount: number, reason: string) => boolean;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      return { ...state, currentUser: null, cart: [], discount: 0, selectedCustomer: null };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        const subtotal = newQuantity * existingItem.product.price;
        const taxAmount = (subtotal * existingItem.product.taxRate) / 100;
        const totalWithTax = subtotal + taxAmount;
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.id
              ? { ...item, quantity: newQuantity, subtotal, taxAmount, totalWithTax }
              : item
          )
        };
      }
      const subtotal = action.payload.price;
      const taxAmount = (subtotal * action.payload.taxRate) / 100;
      const totalWithTax = subtotal + taxAmount;
      return {
        ...state,
        cart: [...state.cart, { 
          product: action.payload, 
          quantity: 1, 
          subtotal,
          taxAmount,
          totalWithTax
        }]
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      const updatedSubtotal = action.payload.quantity * state.cart.find(item => item.product.id === action.payload.productId)!.product.price;
      const updatedTaxAmount = (updatedSubtotal * state.cart.find(item => item.product.id === action.payload.productId)!.product.taxRate) / 100;
      const updatedTotalWithTax = updatedSubtotal + updatedTaxAmount;
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity, subtotal: updatedSubtotal, taxAmount: updatedTaxAmount, totalWithTax: updatedTotalWithTax }
            : item
        )
      };
    case 'CLEAR_CART':
      return { ...state, cart: [], discount: 0, selectedCustomer: null };
    case 'SET_DISCOUNT':
      return { ...state, discount: action.payload };
    case 'SET_CUSTOMER':
      return { ...state, selectedCustomer: action.payload };
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload],
        products: state.products.map(product => {
          const cartItem = state.cart.find(item => item.product.id === product.id);
          return cartItem ? { ...product, stock: product.stock - cartItem.quantity } : product;
        })
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        )
      };
    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    case 'ADD_CUSTOMER':
      return {
        ...state,
        customers: [...state.customers, action.payload]
      };
    case 'UPDATE_CUSTOMER':
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        )
      };
    case 'ADD_STOCK_LOG':
      return {
        ...state,
        stockLogs: [...state.stockLogs, action.payload]
      };
    case 'UPDATE_STOCK':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.productId
            ? { ...product, stock: action.payload.quantity }
            : product
        )
      };
    case 'PROCESS_REFUND':
      const transaction = state.transactions.find(t => t.id === action.payload.transactionId);
      if (!transaction) return state;
      
      const refundTransaction: RefundTransaction = {
        id: Date.now().toString(),
        originalTransactionId: action.payload.transactionId,
        date: new Date().toISOString(),
        amount: action.payload.amount,
        reason: action.payload.reason,
        refundedBy: action.payload.refundedBy,
        paymentMethod: transaction.paymentMethod
      };
      
      const isFullRefund = action.payload.amount >= transaction.total;
      const currentRefundAmount = transaction.refundAmount || 0;
      const newRefundAmount = currentRefundAmount + action.payload.amount;
      
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.transactionId
            ? {
                ...t,
                status: isFullRefund ? 'refunded' as const : 'partially_refunded' as const,
                refundAmount: newRefundAmount,
                refundDate: new Date().toISOString(),
                refundReason: action.payload.reason,
                refundedBy: action.payload.refundedBy
              }
            : t
        ),
        refunds: [...state.refunds, refundTransaction],
        products: state.products.map(product => {
          const refundedItem = transaction.items.find(item => item.product.id === product.id);
          return refundedItem && isFullRefund 
            ? { ...product, stock: product.stock + refundedItem.quantity }
            : product;
        })
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      dispatch({ type: 'LOGIN', payload: user });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const addToCart = (product: Product) => {
    if (product.stock > 0) {
      dispatch({ type: 'ADD_TO_CART', payload: product });
    }
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const setDiscount = (discount: number) => {
    dispatch({ type: 'SET_DISCOUNT', payload: discount });
  };

  const setSelectedCustomer = (customer: Customer | null) => {
    dispatch({ type: 'SET_CUSTOMER', payload: customer });
  };

  const getCartSubtotal = (): number => {
    return state.cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const getCartTax = (): number => {
    return state.cart.reduce((total, item) => total + item.taxAmount, 0);
  };

  const getCartTotalWithTax = (): number => {
    return state.cart.reduce((total, item) => total + item.totalWithTax, 0);
  };

  const getCartTotal = (): number => {
    const totalWithTax = getCartTotalWithTax();
    return Math.max(0, totalWithTax - state.discount);
  };

  const completeTransaction = (paymentMethod: string): Transaction | null => {
    if (state.cart.length === 0 || !state.currentUser) return null;

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...state.cart],
      subtotal: getCartSubtotal(),
      totalTax: getCartTax(),
      discount: state.discount,
      total: getCartTotal(),
      paymentMethod,
      customerId: state.selectedCustomer?.id,
      cashierId: state.currentUser.id,
      profit: state.cart.reduce((total, item) => total + ((item.product.price - item.product.costPrice) * item.quantity), 0)
    };

    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    dispatch({ type: 'CLEAR_CART' });
    
    return transaction;
  };

  const processRefund = (transactionId: string, amount: number, reason: string): boolean => {
    if (!state.currentUser) return false;
    
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction) return false;
    
    const currentRefundAmount = transaction.refundAmount || 0;
    if (currentRefundAmount + amount > transaction.total) return false;
    
    dispatch({
      type: 'PROCESS_REFUND',
      payload: {
        transactionId,
        amount,
        reason,
        refundedBy: state.currentUser.id
      }
    });
    
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setDiscount,
        setSelectedCustomer,
        completeTransaction,
        getCartTotal,
        getCartSubtotal,
        getCartTax,
        getCartTotalWithTax,
        processRefund,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}