import { Product, CalculationResult } from '../types/inventory';
import { calculateSafetyFactor } from './forecasting';

export const calculateInventoryMetrics = (product: Product): CalculationResult => {
  // Calculate average daily sales (rounded to 2 decimal places)
  const averageDailySales = Number((product.totalSales / product.totalDays).toFixed(2));
  
  // Calculate safety stock with minimum threshold
  const safetyFactor = calculateSafetyFactor();
  const calculatedSafetyStock = Math.ceil(safetyFactor * averageDailySales * Math.sqrt(product.leadTime));
  const adjustedSafetyStock = Math.max(product.safetyStock, calculatedSafetyStock);
  
  // Calculate demand during lead time
  const leadTimeDemand = Math.ceil(averageDailySales * product.leadTime);
  
  // Calculate total forecasted demand (lead time demand + safety stock)
  const forecastedDemand = leadTimeDemand + adjustedSafetyStock;
  
  // Calculate reorder quantity (if current stock is below forecasted demand)
  const reorderPoint = forecastedDemand;
  const reorderQuantity = Math.max(0, reorderPoint - product.currentStock);
  
  // Calculate post-reorder inventory
  const postReorderInventory = product.currentStock + reorderQuantity;

  return {
    averageDailySales,
    forecastedDemand,
    reorderQuantity,
    postReorderInventory,
    adjustedSafetyStock
  };
};