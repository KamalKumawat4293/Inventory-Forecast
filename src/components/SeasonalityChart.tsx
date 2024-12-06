import React from 'react';
import { CalculationResult } from '../types/inventory';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SeasonalityChartProps {
  results: CalculationResult;
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function SeasonalityChart({ results }: SeasonalityChartProps) {
  const data = results.seasonalityTrend.map(({ month, factor }) => ({
    name: months[month - 1],
    factor: Number((factor * 100).toFixed(1))
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Seasonality Analysis
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              domain={[0, 'auto']}
              label={{ 
                value: 'Seasonality Factor (%)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="factor" 
              stroke="#0d9488" 
              strokeWidth={2}
              dot={{ fill: '#0d9488' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}