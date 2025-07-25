import { Product, Customer, User, Transaction, StockLog } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 999.99,
    costPrice: 750.00,
    stock: 15,
    category: 'Electronics',
    barcode: '123456789012',
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=200',
    taxRate: 18,
    hsnCode: '8517'
  },
  {
    id: '2',
    name: 'Samsung Galaxy Buds',
    price: 149.99,
    costPrice: 100.00,
    stock: 8,
    category: 'Electronics',
    barcode: '123456789013',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200',
    taxRate: 18,
    hsnCode: '8518'
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    price: 1199.99,
    costPrice: 950.00,
    stock: 8,
    category: 'Electronics',
    barcode: '123456789014',
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200',
    taxRate: 18,
    hsnCode: '8471'
  },
  {
    id: '4',
    name: 'Coffee Mug',
    price: 12.99,
    costPrice: 6.00,
    stock: 25,
    category: 'Home & Garden',
    barcode: '123456789015',
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=200',
    taxRate: 12,
    hsnCode: '6912'
  },
  {
    id: '5',
    name: 'Notebook Set',
    price: 8.99,
    costPrice: 4.50,
    stock: 2,
    category: 'Stationery',
    barcode: '123456789016',
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200',
    taxRate: 12,
    hsnCode: '4820'
  },
  {
    id: '6',
    name: 'Wireless Mouse',
    price: 29.99,
    costPrice: 18.00,
    stock: 12,
    category: 'Electronics',
    barcode: '123456789017',
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=200',
    taxRate: 18,
    hsnCode: '8471'
  }
];

export const customers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+1-555-0123',
    email: 'john.doe@email.com',
    loyaltyPoints: 150,
    purchaseHistory: []
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '+1-555-0124',
    email: 'jane.smith@email.com',
    loyaltyPoints: 89,
    purchaseHistory: []
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phone: '+1-555-0125',
    email: 'mike.j@email.com',
    loyaltyPoints: 245,
    purchaseHistory: []
  }
];

export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    username: 'cashier',
    password: 'cashier123',
    role: 'cashier',
    name: 'Cashier User'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-01-15T10:30:00Z',
    items: [
      {
        product: products[0],
        quantity: 1,
        subtotal: 999.99,
        taxAmount: 179.99,
        totalWithTax: 1179.98
      }
    ],
    subtotal: 999.99,
    totalTax: 179.99,
    discount: 0,
    total: 1179.98,
    paymentMethod: 'card',
    customerId: '1',
    cashierId: '2',
    profit: 249.99,
    status: 'completed'
  },
  {
    id: '2',
    date: '2025-01-15T14:15:00Z',
    items: [
      {
        product: products[3],
        quantity: 2,
        subtotal: 25.98,
        taxAmount: 3.12,
        totalWithTax: 29.10
      },
      {
        product: products[4],
        quantity: 1,
        subtotal: 8.99,
        taxAmount: 1.08,
        totalWithTax: 10.07
      }
    ],
    subtotal: 34.97,
    totalTax: 4.20,
    discount: 2.00,
    total: 37.17,
    paymentMethod: 'cash',
    customerId: '2',
    cashierId: '2',
    profit: 21.47,
    status: 'completed'
  },
  {
    id: '3',
    date: '2025-01-14T16:45:00Z',
    items: [
      {
        product: products[1],
        quantity: 1,
        subtotal: 149.99,
        taxAmount: 26.99,
        totalWithTax: 176.98
      }
    ],
    subtotal: 149.99,
    totalTax: 26.99,
    discount: 0,
    total: 176.98,
    paymentMethod: 'card',
    customerId: '3',
    cashierId: '1',
    profit: 49.99,
    status: 'refunded',
    refundAmount: 176.98,
    refundDate: '2025-01-15T09:30:00Z',
    refundReason: 'Defective product',
    refundedBy: '1'
  }
];

export const stockLogs: StockLog[] = [
  {
    id: '1',
    productId: '1',
    type: 'in',
    quantity: 20,
    date: '2025-01-14T09:00:00Z',
    notes: 'New stock delivery'
  },
  {
    id: '2',
    productId: '2',
    type: 'out',
    quantity: 5,
    date: '2025-01-15T11:30:00Z',
    notes: 'Sales transaction'
  }
];