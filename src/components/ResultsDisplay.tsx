import React from 'react';
import { CalculationResult } from '../types/inventory';
import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import MetricsCard from './MetricsCard';

interface ResultsDisplayProps {
  results: CalculationResult;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const {
    averageDailySales,
    forecastedDemand,
    reorderQuantity,
    postReorderInventory,
    adjustedSafetyStock
  } = results;

  const isLowStock = reorderQuantity > 0;
  
  const formatNumber = (num: number) => {
    if (num === 0) return '0';
    if (num < 1) return num.toFixed(1);
    return Math.round(num).toString();
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Daily Sales Forecast"
          value={formatNumber(averageDailySales)}
          subtitle="Units per day"
          className="border-l-4 border-teal-500"
        />
        <MetricsCard
          title="Safety Stock Level"
          value={formatNumber(adjustedSafetyStock)}
          subtitle="Minimum buffer stock"
          className="border-l-4 border-indigo-500"
        />
        <MetricsCard
          title="Lead Time Demand"
          value={formatNumber(forecastedDemand)}
          subtitle="Expected demand during lead time"
          className="border-l-4 border-purple-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Inventory Action Plan
          </h3>
          <TrendingUp className="h-6 w-6 text-teal-600" />
        </div>

        <div className={`p-6 rounded-xl ${isLowStock ? 'bg-amber-50' : 'bg-teal-50'} mb-8`}>
          {isLowStock ? (
            <div className="flex items-start space-x-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 mt-1" />
              <div>
                <p className="font-semibold text-amber-900 text-lg mb-1">Stock Alert</p>
                <p className="text-amber-800">
                  Recommended order quantity: <span className="font-bold">{formatNumber(reorderQuantity)}</span> units
                </p>
                <p className="text-sm text-amber-700 mt-2">
                  Place order soon to maintain optimal inventory levels
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-teal-500 mt-1" />
              <div>
                <p className="font-semibold text-teal-900 text-lg mb-1">Healthy Stock Level</p>
                <p className="text-teal-800">
                  Current inventory is sufficient to meet demand
                </p>
                <p className="text-sm text-teal-700 mt-2">
                  Next review recommended in 7 days
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Current Stock Level
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {formatNumber(postReorderInventory - reorderQuantity)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Available inventory
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              Post-Reorder Level
            </p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {formatNumber(postReorderInventory)}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              After recommended reorder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}