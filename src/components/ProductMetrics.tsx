import React from 'react';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { CalculationResult } from '../types/inventory';

interface ProductMetricsProps {
  metrics: CalculationResult;
}

export default function ProductMetrics({ metrics }: ProductMetricsProps) {
  const isLowStock = metrics.reorderQuantity > 0;

  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (num < 1) return num.toFixed(1);
    return Math.round(num).toString();
  };

  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <div className="bg-teal-50 rounded-lg p-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-teal-600" />
          <span className="text-sm text-teal-900 font-medium">
            {formatNumber(metrics.averageDailySales)}
          </span>
        </div>
        <span className="text-xs text-teal-600">Daily Sales</span>
      </div>
      
      <div className={`${isLowStock ? 'bg-amber-50' : 'bg-green-50'} rounded-lg p-2`}>
        <div className="flex items-center space-x-2">
          {isLowStock ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          <span className={`text-sm font-medium ${isLowStock ? 'text-amber-900' : 'text-green-900'}`}>
            {formatNumber(metrics.reorderQuantity)}
          </span>
        </div>
        <span className={`text-xs ${isLowStock ? 'text-amber-600' : 'text-green-600'}`}>
          {isLowStock ? 'Reorder Needed' : 'Stock Level OK'}
        </span>
      </div>
      
      <div className="col-span-2 bg-gray-50 rounded-lg p-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Forecasted Demand</span>
          <span className="text-sm text-gray-900 font-medium">
            {formatNumber(metrics.forecastedDemand)}
          </span>
        </div>
      </div>
    </div>
  );
}