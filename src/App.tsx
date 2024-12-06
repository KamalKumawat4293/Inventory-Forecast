import React from 'react';
import Header from './components/Header';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import ResultsDisplay from './components/ResultsDisplay';
import ImportExportButtons from './components/ImportExportButtons';
import useInventoryStore from './store/inventoryStore';
import { calculateInventoryMetrics } from './utils/calculations';
import { Product } from './types/inventory';

function App() {
  const { 
    products, 
    selectedProduct, 
    results, 
    addProduct,
    updateProduct, 
    setSelectedProduct, 
    setResults 
  } = useInventoryStore();

  const handleSubmit = (product: Product) => {
    if (product.id) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    const calculatedResults = calculateInventoryMetrics(product);
    setResults(calculatedResults);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <Header />
        
        <div className="mb-8">
          <ImportExportButtons />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProductList
              products={products}
              selectedId={selectedProduct?.id}
              onSelectProduct={(product) => {
                setSelectedProduct(product);
                const calculatedResults = calculateInventoryMetrics(product);
                setResults(calculatedResults);
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <ProductForm 
                onSubmit={handleSubmit}
                initialData={selectedProduct}
              />
            </div>

            {results && (
              <div className="mt-8">
                <ResultsDisplay results={results} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;