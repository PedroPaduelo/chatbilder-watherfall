import React from 'react';
import { getSankeySampleData } from '../utils/sampleData';
import { ExportService } from '../services/exportService';

const SankeyChartImport: React.FC = () => {
  const sankeySampleData = getSankeySampleData();

  const handleDownloadJSON = () => {
    ExportService.exportAsJSON(sankeySampleData, {}, 'sankey-sample.json');
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
      </div>
    </div>
  );
};

export default SankeyChartImport;