export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice: number;
  stock: number;
  category: string;
  barcode?: string;
  image?: string;
  taxRate: number; // GST rate in percentage
  hsnCode?: string; // HSN code for GST
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  taxAmount: number;
  totalWithTax: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  purchaseHistory: Transaction[];
}

export interface Transaction {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  totalTax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  customerId?: string;
  cashierId: string;
  profit: number;
  status: 'completed' | 'refunded' | 'partially_refunded';
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
  refundedBy?: string;
}

export interface RefundTransaction {
  id: string;
  originalTransactionId: string;
  date: string;
  amount: number;
  reason: string;
  refundedBy: string;
  paymentMethod: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'cashier';
  name: string;
}

export interface StockLog {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  notes: string;
}