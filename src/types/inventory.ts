export interface Product {
  id?: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  totalSales: number;
  totalDays: number;
  leadTime: number;
  safetyStock: number;
}

export interface CalculationResult {
  averageDailySales: number;
  forecastedDemand: number;
  reorderQuantity: number;
  postReorderInventory: number;
  adjustedSafetyStock: number;
}

export interface InventoryState {
  products: Product[];
  selectedProduct: Product | null;
  results: CalculationResult | null;
}