import React from 'react';
import { Product } from '../types/inventory';
import { calculateInventoryMetrics } from '../utils/calculations';
import useInventoryStore from '../store/inventoryStore';

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  initialData?: Product | null;
}

export default function ProductForm({ onSubmit, initialData }: ProductFormProps) {
  const setResults = useInventoryStore(state => state.setResults);
  const [formData, setFormData] = React.useState<Product>({
    name: initialData?.name || '',
    sku: initialData?.sku || '',
    category: initialData?.category || '',
    currentStock: initialData?.currentStock || 0,
    totalSales: initialData?.totalSales || 0,
    totalDays: initialData?.totalDays || 0,
    leadTime: initialData?.leadTime || 0,
    safetyStock: initialData?.safetyStock || 0
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        sku: '',
        category: '',
        currentStock: 0,
        totalSales: 0,
        totalDays: 0,
        leadTime: 0,
        safetyStock: 0
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCalculate = () => {
    const results = calculateInventoryMetrics(formData);
    setResults(results);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'sku' || name === 'category' ? value : Number(value)
    }));
  };

  const isFormValid = () => {
    return formData.name && 
           formData.sku && 
           formData.category && 
           formData.currentStock >= 0 &&
           formData.totalSales >= 0 &&
           formData.totalDays > 0 &&
           formData.leadTime >= 0 &&
           formData.safetyStock >= 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU/ID
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="currentStock" className="block text-sm font-medium text-gray-700">
              Current Stock Level
            </label>
            <input
              type="number"
              id="currentStock"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="totalSales" className="block text-sm font-medium text-gray-700">
              Historical Sales Volume
            </label>
            <input
              type="number"
              id="totalSales"
              name="totalSales"
              value={formData.totalSales}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="totalDays" className="block text-sm font-medium text-gray-700">
              Historical Period (days)
            </label>
            <input
              type="number"
              id="totalDays"
              name="totalDays"
              value={formData.totalDays}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
          <div>
            <label htmlFor="leadTime" className="block text-sm font-medium text-gray-700">
              Supplier Lead Time (days)
            </label>
            <input
              type="number"
              id="leadTime"
              name="leadTime"
              value={formData.leadTime}
              onChange={handleChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="safetyStock" className="block text-sm font-medium text-gray-700">
            Minimum Safety Stock Level
          </label>
          <input
            type="number"
            id="safetyStock"
            name="safetyStock"
            value={formData.safetyStock}
            onChange={handleChange}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCalculate}
          disabled={!isFormValid()}
          className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200 
            ${isFormValid() 
              ? 'bg-teal-100 text-teal-700 hover:bg-teal-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
        >
          Calculate Forecast
        </button>
        <button
          type="submit"
          disabled={!isFormValid()}
          className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors duration-200
            ${isFormValid()
              ? 'bg-teal-600 text-white hover:bg-teal-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {initialData ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}