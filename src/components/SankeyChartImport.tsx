import React from 'react';
import { sankeySampleData } from '../utils/sampleData';
import { ExportService } from '../services/exportService';
import { defaultSettings } from '../utils/constants';

const SankeyChartImport: React.FC = () => {
  const handleDownloadCSV = () => {
    // Convert sankey data to CSV format
    const csvData = sankeySampleData.nodes.map((node: any, index: number) => ({
      id: node.id || `${index + 1}`,
      name: node.name,
      category: node.category || 'default',
      value: node.value || 0,
      type: 'node'
    }));
    ExportService.exportAsCSV(csvData, 'sankey-chart-sample.csv');
  };

  const handleDownloadJSON = () => {
    ExportService.exportAsJSON(sankeySampleData, defaultSettings, 'sankey-chart-sample.json');
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Import Sankey Chart Data</h3>
      <p className="text-sm text-gray-600 mb-4">
        Download sample data templates for Sankey Chart.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleDownloadJSON}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download JSON
        </button>
        <button
          onClick={handleDownloadCSV}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default SankeyChartImport;