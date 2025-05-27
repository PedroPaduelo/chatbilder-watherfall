import { useState, useRef } from 'react';
import { Download, Upload, Image, FileText } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import WaterfallChart from './components/WaterfallChart';
import DataEditor from './components/DataEditor';
import SettingsPanel from './components/SettingsPanel';
import CSVImporter from './components/CSVImporter';
import type { DataRow, ChartSettings } from './types';
import { defaultSettings, initialData } from './utils/constants';

interface CSVRow {
  category?: string;
  Category?: string;
  value?: string | number;
  Value?: string | number;
  type?: string;
  Type?: string;
  color?: string;
  Color?: string;
  group?: string;
  Group?: string;
  isSubtotal?: boolean;
  Subtotal?: boolean;
  segments?: string;
}

const App = () => {
  const [data, setData] = useState<DataRow[]>(initialData);
  const [settings, setSettings] = useState<ChartSettings>(defaultSettings);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload handlers for Excel files (keeping existing functionality)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      // Open the new CSV importer modal
      setShowCSVImporter(true);
      return;
    }

    if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as CSVRow[];
        
        const parsedData = jsonData.map((row, index) => ({
          id: (index + 1).toString(),
          category: row.category || row.Category || `Row ${index + 1}`,
          value: Number.parseFloat(String(row.value || row.Value || 0)),
          type: (row.type || row.Type || 'increase') as DataRow['type'],
          color: row.color || row.Color,
          group: row.group || row.Group,
          isSubtotal: row.isSubtotal === true || row.Subtotal === true,
          segments: row.segments ? JSON.parse(row.segments) : undefined
        }));
        setData(parsedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Export handlers
  const exportAsPNG = async () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;
    
    // Clone the SVG to avoid modifying the original
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    
    // Get SVG string
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    
    // Create a canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img');
    
    // Set canvas dimensions
    canvas.width = 900;
    canvas.height = 500;
    
    // Convert SVG to data URL
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      // Convert canvas to PNG
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.download = 'waterfall-chart.png';
          link.href = URL.createObjectURL(blob);
          link.click();
        }
      });
    };
    
    img.src = url;
  };

  const exportAsSVG = () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const link = document.createElement('a');
    link.download = 'waterfall-chart.svg';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const exportAsJSON = () => {
    const exportData = {
      data,
      settings,
      version: '2.0'
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = 'waterfall-chart-data.json';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const exportAsHTML = () => {
    const svg = chartRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgString = new XMLSerializer().serializeToString(svg);
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Waterfall Chart with Stacked Bars</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: system-ui, -apple-system, sans-serif; 
      background-color: #f3f4f6;
    }
    .chart-container { 
      width: 100%; 
      max-width: 1200px; 
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 {
      margin-top: 0;
      color: #1f2937;
    }
    .info {
      margin: 1rem 0;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="chart-container">
    <h1>Waterfall Chart with Stacked Bars</h1>
    <div class="info">
      This waterfall chart supports stacked bars for baseline and total values. 
      Each segment represents a subcategory with its own value and color.
    </div>
    ${svgString}
  </div>
</body>
</html>`;
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = 'waterfall-chart.html';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Waterfall Chart Builder</h1>
          <p className="text-gray-600">Create professional waterfall charts with stacked bars support</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Display */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chart Preview</h2>
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowCSVImporter(true)}
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm"
                  title="Import CSV with Template"
                >
                  <Upload size={16} />
                  Import CSV
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 border rounded hover:bg-gray-50"
                  title="Upload Excel/CSV File"
                >
                  <Upload size={20} />
                </button>
                <button
                  type="button"
                  onClick={exportAsPNG}
                  className="p-2 border rounded hover:bg-gray-50"
                  title="Export as PNG"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  onClick={exportAsSVG}
                  className="p-2 border rounded hover:bg-gray-50"
                  title="Export as SVG"
                >
                  <FileText size={20} />
                </button>
                <button
                  type="button"
                  onClick={exportAsJSON}
                  className="p-2 border rounded hover:bg-gray-50"
                  title="Export as JSON"
                >
                  <Download size={20} />
                </button>
                <button
                  type="button"
                  onClick={exportAsHTML}
                  className="p-2 border rounded hover:bg-gray-50"
                  title="Export as HTML"
                >
                  <FileText size={20} />
                </button>
              </div>
            </div>
            <div ref={chartRef} className="border rounded-lg p-4 bg-gray-50 overflow-hidden">
              <WaterfallChart data={data} settings={settings} />
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        </div>

        {/* Data Editor */}
        <div className="mt-6">
          <DataEditor data={data} onDataChange={setData} />
        </div>

        {/* CSV Importer Modal */}
        {showCSVImporter && (
          <CSVImporter
            open={showCSVImporter}
            onClose={() => setShowCSVImporter(false)}
            onDataImported={setData}
          />
        )}
      </div>
    </div>
  );
};

export default App;