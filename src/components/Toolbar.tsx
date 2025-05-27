import React from 'react';
import { Download, Upload, Image, FileText } from 'lucide-react';

export interface ToolbarProps {
  onImportCSV: () => void;
  onFileUpload: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onImportCSV,
  onFileUpload,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportHTML
}) => {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onImportCSV}
        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2 text-sm transition-colors"
        title="Import CSV with Template"
      >
        <Upload size={16} />
        Import CSV
      </button>
      
      <button
        type="button"
        onClick={onFileUpload}
        className="p-2 border rounded hover:bg-gray-50 transition-colors"
        title="Upload Excel/CSV File"
      >
        <Upload size={20} />
      </button>
      
      <button
        type="button"
        onClick={onExportPNG}
        className="p-2 border rounded hover:bg-gray-50 transition-colors"
        title="Export as PNG"
      >
        <Image size={20} />
      </button>
      
      <button
        type="button"
        onClick={onExportSVG}
        className="p-2 border rounded hover:bg-gray-50 transition-colors"
        title="Export as SVG"
      >
        <FileText size={20} />
      </button>
      
      <button
        type="button"
        onClick={onExportJSON}
        className="p-2 border rounded hover:bg-gray-50 transition-colors"
        title="Export as JSON"
      >
        <Download size={20} />
      </button>
      
      <button
        type="button"
        onClick={onExportHTML}
        className="p-2 border rounded hover:bg-gray-50 transition-colors"
        title="Export as HTML"
      >
        <FileText size={20} />
      </button>
    </div>
  );
};

export default Toolbar;