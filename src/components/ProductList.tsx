import React from 'react';
import { Product } from '../types/inventory';
import { Package } from 'lucide-react';
import { calculateInventoryMetrics } from '../utils/calculations';
import ProductMetrics from './ProductMetrics';

interface ProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedId?: string;
}

export default function ProductList({ products, onSelectProduct, selectedId }: ProductListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-teal-50 border-b border-teal-100">
        <h3 className="text-lg font-semibold text-teal-900">Inventory Items</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {products.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No products added yet. Add your first product to get started.
          </div>
        ) : (
          products.map((product) => {
            const metrics = calculateInventoryMetrics(product);
            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  product.id === selectedId ? 'bg-teal-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Package className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Stock: {product.currentStock}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </div>
                    <ProductMetrics metrics={metrics} />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}