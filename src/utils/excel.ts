import { read, utils, write } from 'xlsx';
import { Product } from '../types/inventory';

export const downloadSampleTemplate = () => {
  // Create sample data
  const sampleData = [
    {
      'Product Name': 'Sample T-Shirt',
      'SKU': 'TS-001',
      'Category': 'Apparel',
      'Current Stock': 100,
      'Total Sales': 500,
      'Total Days': 30,
      'Lead Time (days)': 7,
      'Safety Stock': 50
    }
  ];

  // Create workbook and worksheet
  const workbook = utils.book_new();
  const worksheet = utils.json_to_sheet(sampleData);

  // Add column widths
  const colWidths = [
    { wch: 20 }, // Product Name
    { wch: 10 }, // SKU
    { wch: 15 }, // Category
    { wch: 15 }, // Current Stock
    { wch: 15 }, // Total Sales
    { wch: 12 }, // Total Days
    { wch: 15 }, // Lead Time
    { wch: 15 }  // Safety Stock
  ];
  worksheet['!cols'] = colWidths;

  // Add the worksheet to workbook
  utils.book_append_sheet(workbook, worksheet, 'Template');

  // Generate Excel file
  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'inventory_template.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importFromExcel = async (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        const workbook = read(e.target.result, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);

        if (!Array.isArray(jsonData) || jsonData.length === 0) {
          throw new Error('No data found in Excel file');
        }

        // Map Excel columns to Product interface
        const products: Product[] = jsonData.map((row: any) => ({
          id: crypto.randomUUID(),
          name: row['Product Name'] || '',
          sku: row['SKU'] || '',
          category: row['Category'] || '',
          currentStock: Number(row['Current Stock']) || 0,
          totalSales: Number(row['Total Sales']) || 0,
          totalDays: Number(row['Total Days']) || 0,
          leadTime: Number(row['Lead Time (days)']) || 0,
          safetyStock: Number(row['Safety Stock']) || 0
        }));

        // Validate products
        const invalidProducts = products.filter(p => 
          !p.name || !p.sku || !p.category || 
          isNaN(p.currentStock) || isNaN(p.totalSales) || 
          isNaN(p.totalDays) || isNaN(p.leadTime) || 
          isNaN(p.safetyStock)
        );

        if (invalidProducts.length > 0) {
          throw new Error('Invalid data found in Excel file. Please check the template format.');
        }

        resolve(products);
      } catch (error) {
        reject(error instanceof Error 
          ? error 
          : new Error('Failed to parse Excel file')
        );
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (products: Product[]) => {
  const exportData = products.map(product => ({
    'Product Name': product.name,
    'SKU': product.sku,
    'Category': product.category,
    'Current Stock': product.currentStock,
    'Total Sales': product.totalSales,
    'Total Days': product.totalDays,
    'Lead Time (days)': product.leadTime,
    'Safety Stock': product.safetyStock
  }));

  const worksheet = utils.json_to_sheet(exportData);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Inventory Data');

  // Add column widths
  const colWidths = [
    { wch: 20 }, // Product Name
    { wch: 10 }, // SKU
    { wch: 15 }, // Category
    { wch: 15 }, // Current Stock
    { wch: 15 }, // Total Sales
    { wch: 12 }, // Total Days
    { wch: 15 }, // Lead Time
    { wch: 15 }  // Safety Stock
  ];
  worksheet['!cols'] = colWidths;

  const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'buffer' });
  const blob = new Blob([excelBuffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory_data_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};