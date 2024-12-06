import React from 'react';
import { Package } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center mb-4">
        <Package className="h-12 w-12 text-teal-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Smart Inventory Optimizer
      </h1>
      <p className="text-lg text-gray-600">
        Advanced inventory optimization with dynamic safety stock calculation
      </p>
    </div>
  );
}