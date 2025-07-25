import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/Sales/ProductCard';
import Cart from '../components/Sales/Cart';
import BarcodeScanner from '../components/Sales/BarcodeScanner';

const Sales = () => {
  const { state, addToCart } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(state.products.map(p => p.category))];

  const filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-4 border-b shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sales</h1>
          
          {/* Barcode Scanner */}
          <BarcodeScanner />
          
          {/* Search and Filters */}
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-80 border-l bg-gray-50">
        <Cart />
      </div>
    </div>
  );
};

export default Sales;