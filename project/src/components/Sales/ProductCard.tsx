import React from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="relative h-32 bg-gray-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Stock Status Badge */}
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}
        {isLowStock && !isOutOfStock && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Low Stock
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category}</p>
        {product.barcode && (
          <p className="text-xs text-gray-400 mb-2 font-mono">#{product.barcode}</p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-colors ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;