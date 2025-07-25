import React, { useState } from 'react';
import { Scan, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const BarcodeScanner = () => {
  const { state, addToCart } = useApp();
  const [barcode, setBarcode] = useState('');
  const [message, setMessage] = useState('');

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!barcode.trim()) {
      setMessage('Please enter a barcode');
      return;
    }

    const product = state.products.find(p => p.barcode === barcode.trim());
    
    if (product) {
      if (product.stock > 0) {
        addToCart(product);
        setMessage(`✅ ${product.name} added to cart`);
        setBarcode('');
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(`❌ ${product.name} is out of stock`);
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setMessage('❌ Product not found');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleBarcodeChange = (value: string) => {
    setBarcode(value);
    if (message) setMessage(''); // Clear message when typing
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-4">
      <div className="flex items-center space-x-2 mb-3">
        <Scan className="h-5 w-5 text-blue-600" />
        <h3 className="font-medium text-gray-900">Barcode Scanner</h3>
      </div>
      
      <form onSubmit={handleBarcodeSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={barcode}
              onChange={(e) => handleBarcodeChange(e.target.value)}
              placeholder="Scan or enter barcode..."
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Add
          </button>
        </div>
        
        {message && (
          <div className={`text-sm p-2 rounded ${
            message.includes('✅') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}
      </form>

      {/* Quick Reference */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600 mb-2 font-medium">Quick Reference - Sample Barcodes:</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
          <div>📱 123456789012 - iPhone 15 Pro</div>
          <div>🎧 123456789013 - Galaxy Buds</div>
          <div>💻 123456789014 - MacBook Air M2</div>
          <div>☕ 123456789015 - Coffee Mug</div>
          <div>📝 123456789016 - Notebook Set</div>
          <div>🖱️ 123456789017 - Wireless Mouse</div>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;