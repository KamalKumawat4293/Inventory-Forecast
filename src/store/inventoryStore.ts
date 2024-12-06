import { create } from 'zustand';
import { InventoryState, Product, CalculationResult } from '../types/inventory';

interface InventoryStore extends InventoryState {
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  setSelectedProduct: (product: Product | null) => void;
  setResults: (results: CalculationResult | null) => void;
}

const useInventoryStore = create<InventoryStore>((set) => ({
  products: [],
  selectedProduct: null,
  results: null,
  
  addProduct: (product: Product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: crypto.randomUUID() }],
    })),
    
  updateProduct: (product: Product) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === product.id ? product : p
      ),
    })),
    
  setSelectedProduct: (product: Product | null) =>
    set({ selectedProduct: product }),
    
  setResults: (results: CalculationResult | null) =>
    set({ results }),
}));

export default useInventoryStore;