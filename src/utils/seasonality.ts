import { SeasonalityPattern, Product } from '../types/inventory';

export const calculateMonthlySeasonality = (monthlyData: Product['monthlyData']): SeasonalityPattern[] => {
  const monthlyAverages = new Array(12).fill(0);
  const monthCounts = new Array(12).fill(0);
  
  // Calculate average sales for each month
  monthlyData.forEach(({ month, sales }) => {
    monthlyAverages[month - 1] += sales;
    monthCounts[month - 1]++;
  });
  
  const averages = monthlyAverages.map((sum, i) => 
    monthCounts[i] > 0 ? sum / monthCounts[i] : 0
  );
  
  // Calculate overall average
  const overallAverage = averages.reduce((sum, avg) => sum + avg, 0) / 
    averages.filter(avg => avg > 0).length;
  
  // Calculate seasonal factors
  return averages.map((avg, i) => ({
    month: i + 1,
    factor: avg > 0 ? avg / overallAverage : 1
  }));
};

export const getCurrentSeasonalityFactor = (
  patterns: SeasonalityPattern[],
  month: number = new Date().getMonth() + 1
): number => {
  const pattern = patterns.find(p => p.month === month);
  return pattern?.factor || 1;
};

export const getNextMonthForecast = (
  averageDailySales: number,
  patterns: SeasonalityPattern[],
  currentMonth: number = new Date().getMonth() + 1
): number => {
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
  const nextSeasonality = getCurrentSeasonalityFactor(patterns, nextMonth);
  return averageDailySales * nextSeasonality * 30; // Monthly forecast
};