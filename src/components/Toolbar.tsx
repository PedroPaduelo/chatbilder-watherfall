import React from 'react';
import { Download, Upload, Image, FileText, Save, BookOpen } from 'lucide-react';

export interface ToolbarProps {
  onImportCSV: () => void;
  onFileUpload: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
  onSaveView: () => void;
  onManageViews: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onImportCSV,
  onFileUpload,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportHTML,
  onSaveView,
  onManageViews
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Saved Views Section */}
      <div className="flex gap-2 border-r border-gray-200 pr-2">
        <button
          type="button"
          onClick={onSaveView}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 text-sm transition-colors"
          title="Salvar Visualização Atual"
        >
          <Save size={16} />
          Salvar
        </button>
        
        <button
          type="button"
          onClick={onManageViews}
          className="px-3 py-2 border border-blue-300 text-blue-700 rounded hover:bg-blue-50 flex items-center gap-2 text-sm transition-colors"
          title="Gerenciar Visualizações Salvas"
        >
          <BookOpen size={16} />
          Minhas Views
        </button>
      </div>

      {/* Import Section */}
      <div className="flex gap-2 border-r border-gray-200 pr-2">
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
      </div>
      
      {/* Export Section */}
      <div className="flex gap-2">
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
    </div>
  );
};

export default Toolbar;