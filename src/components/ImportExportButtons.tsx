import React, { useRef, useState } from 'react';
import { Download, Upload, FileDown } from 'lucide-react';
import { exportToExcel, importFromExcel, downloadSampleTemplate } from '../utils/excel';
import useInventoryStore from '../store/inventoryStore';
import { Product } from '../types/inventory';

export default function ImportExportButtons() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { products, addProduct } = useInventoryStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const importedProducts = await importFromExcel(file);
      importedProducts.forEach(product => addProduct(product));
      setError(`Successfully imported ${importedProducts.length} products!`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import data');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleExport = () => {
    if (products.length === 0) {
      setError('No data to export. Please add some products first.');
      return;
    }
    try {
      exportToExcel(products);
      setError('Data exported successfully!');
    } catch (err) {
      setError('Failed to export data. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".xlsx"
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors
            ${isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}
        >
          <Upload className="w-4 h-4 mr-2" />
          {isLoading ? 'Importing...' : 'Import Excel'}
        </button>
        
        <button
          onClick={handleExport}
          disabled={isLoading || products.length === 0}
          className={`flex items-center px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors
            ${products.length === 0 || isLoading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-teal-100 text-teal-700 hover:bg-teal-200'}`}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Excel
        </button>

        <button
          onClick={downloadSampleTemplate}
          className="flex items-center px-4 py-2 text-sm font-medium text-teal-600 hover:text-teal-800 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Download Template
        </button>
      </div>

      {error && (
        <div className={`text-sm px-4 py-2 rounded-md ${
          error.includes('Success')
            ? 'bg-green-50 text-green-800'
            : 'bg-red-50 text-red-800'
        }`}>
          {error}
        </div>
      )}
    </div>
  );
}