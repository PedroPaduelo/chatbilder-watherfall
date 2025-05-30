import React from 'react';
import { stackedBarSampleData } from '../utils/sampleData';
import { ExportService } from '../services/exportService';

const StackedBarChartImport: React.FC = () => {
  const handleDownloadCSV = () => {
    const csvData = stackedBarSampleData.map(row => ({
      category: row.category,
      value: row.value,
      type: row.type,
      color: row.color,
      segments: JSON.stringify(row.segments),
    }));
    ExportService.exportAsCSV(csvData, 'stacked-bar-sample.csv');
  };

  const handleDownloadJSON = () => {
    ExportService.exportAsJSON(stackedBarSampleData, {}, 'stacked-bar-sample.json');
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Import Stacked Bar Chart Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        Download sample data templates for Stacked Bar Chart.
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

export default StackedBarChartImport;