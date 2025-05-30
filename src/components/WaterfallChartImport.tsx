import React from 'react';
import { waterfallSampleData } from '../utils/sampleData';
import { ExportService } from '../services/exportService';
import { defaultSettings } from '../utils/constants';

const WaterfallChartImport: React.FC = () => {
  const handleDownloadCSV = () => {
    const csvData = waterfallSampleData.map((row, index) => ({
      id: row.id || `${index + 1}`,
      category: row.category,
      value: row.value,
      type: row.type,
      color: row.color,
    }));
    ExportService.exportAsCSV(csvData, 'waterfall-sample.csv');
  };

  const handleDownloadJSON = () => {
    ExportService.exportAsJSON(waterfallSampleData, defaultSettings, 'waterfall-sample.json');
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Import Waterfall Chart Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        Download sample data templates for Waterfall Chart.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download CSV
        </button>
        <button
          onClick={handleDownloadJSON}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download JSON
        </button>
      </div>
    </div>
  );
};

export default WaterfallChartImport;