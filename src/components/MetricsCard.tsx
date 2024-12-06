import React from 'react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  className?: string;
}

export default function MetricsCard({ title, value, subtitle, className = '' }: MetricsCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transform transition-all duration-200 hover:scale-102 hover:shadow-xl ${className}`}>
      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{title}</h3>
      <p className="mt-3 text-3xl font-bold text-gray-900">
        {typeof value === 'number' ? Math.round(value) : value}
      </p>
      <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}