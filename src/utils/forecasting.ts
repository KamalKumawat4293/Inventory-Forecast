import { Product } from '../types/inventory';

// Enhanced forecasting using exponential smoothing
export const calculateSeasonalityFactor = (historicalData: number[]): number => {
  if (historicalData.length < 2) return 1;
  
  const average = historicalData.reduce((a, b) => a + b, 0) / historicalData.length;
  const variance = historicalData.reduce((a, b) => a + Math.pow(b - average, 2), 0) / historicalData.length;
  
  // Coefficient of variation as seasonality indicator
  return 1 + (Math.sqrt(variance) / average);
};

export const calculateSafetyFactor = (serviceLevel: number = 0.95): number => {
  // Z-score for normal distribution
  const zScores: Record<number, number> = {
    0.90: 1.28,
    0.95: 1.645,
    0.98: 2.054,
    0.99: 2.326
  };
  return zScores[serviceLevel] || 1.645;
};