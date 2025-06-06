import React from 'react';
import { Download, Upload, Image, FileText, Save, Settings } from 'lucide-react';
import type { ChartType } from '../types';

export interface ToolbarProps {
  chartType: ChartType;
  onImportCSV: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
  onSaveView?: () => void;
  onManageViews?: () => void;
  onShowChartSettings: () => void;
  onSaveChart?: () => Promise<void>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  chartType,
  onImportCSV,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportHTML,
  onShowChartSettings,
  onSaveChart
}) => {
  const getImportButtonText = (type: ChartType): string => {
    const typeNames = {
      waterfall: 'Waterfall',
      'stacked-bar': 'Stacked Bar',
      line: 'Line Chart',
      area: 'Area Chart',
      sankey: 'Sankey'
    };
    return `Importar ${typeNames[type] || 'Dados'}`;
  };

  const getImportButtonFormat = (type: ChartType): string => {
    return type === 'sankey' ? 'JSON' : 'CSV/JSON';
  };

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Save Section */}
      <div className="flex gap-2 border-r border-gray-200 dark:border-gray-600 pr-3">
        {onSaveChart && (
          <button
            type="button"
            onClick={onSaveChart}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            title="Salvar Gráfico Atual"
          >
            <Save size={16} />
            Salvar
          </button>
        )}
      </div>

      {/* Import Section */}
      <div className="flex gap-2 border-r border-gray-200 dark:border-gray-600 pr-3">
        <button
          type="button"
          onClick={onImportCSV}
          className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          title={`${getImportButtonText(chartType)} com Template e Validação`}
        >
          <Upload size={16} />
          <div className="flex flex-col items-start">
            <span>{getImportButtonText(chartType)}</span>
            <span className="text-xs opacity-80">{getImportButtonFormat(chartType)}</span>
          </div>
        </button>
      </div>

      {/* Chart Settings Section */}
      <div className="flex gap-2 border-r border-gray-200 dark:border-gray-600 pr-3">
        <button
          type="button"
          onClick={onShowChartSettings}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          title="Configurações Específicas do Gráfico"
        >
          <Settings size={16} />
          Config. {chartType ? chartType.charAt(0).toUpperCase() + chartType.slice(1) : 'Gráfico'}
        </button>
      </div>
      
      {/* Export Section */}
      <div className="flex gap-2">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider self-center mr-2">
          Exportar
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onExportPNG}
            className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 hover:shadow-md group"
            title="Export as PNG"
          >
            <Image size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            type="button"
            onClick={onExportSVG}
            className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 hover:shadow-md group"
            title="Export as SVG"
          >
            <FileText size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            type="button"
            onClick={onExportJSON}
            className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 hover:shadow-md group"
            title="Export as JSON"
          >
            <Download size={18} className="group-hover:scale-110 transition-transform" />
          </button>
          
          <button
            type="button"
            onClick={onExportHTML}
            className="p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:scale-105 hover:shadow-md group"
            title="Export as HTML"
          >
            <FileText size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;