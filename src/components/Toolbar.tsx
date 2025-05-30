import React from 'react';
import { Download, Upload, Image, FileText, Save, BookOpen, Settings } from 'lucide-react';
import type { ChartType } from '../types';

export interface ToolbarProps {
  chartType: ChartType;
  onImportCSV: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
  onSaveView: () => void;
  onManageViews: () => void;
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
  onSaveView,
  onManageViews,
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
    <div className="flex flex-wrap gap-2">
      {/* Saved Views Section */}
      <div className="flex gap-2 border-r border-gray-200 dark:border-gray-600 pr-2">
        <button
          type="button"
          onClick={onSaveView}
          className="px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2 text-sm transition-colors"
          title="Salvar Visualização Atual"
        >
          <Save size={16} />
          Salvar
        </button>
        
        {onSaveChart && (
          <button
            type="button"
            onClick={onSaveChart}
            className="px-3 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded hover:bg-indigo-700 dark:hover:bg-indigo-800 flex items-center gap-2 text-sm transition-colors"
            title="Salvar Gráfico Atual"
          >
            <Save size={16} />
            Salvar Gráfico
          </button>
        )}
        
        <button
          type="button"
          onClick={onManageViews}
          className="px-3 py-2 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-2 text-sm transition-colors"
          title="Gerenciar Visualizações Salvas"
        >
          <BookOpen size={16} />
          Minhas Views
        </button>
      </div>

      {/* Import Section */}
      <div className="flex gap-2 border-r border-gray-200 dark:border-gray-600 pr-2">
        <button
          type="button"
          onClick={onImportCSV}
          className="px-3 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 flex items-center gap-2 text-sm transition-colors"
          title={`${getImportButtonText(chartType)} com Template e Validação`}
        >
          <Upload size={16} />
          <div className="flex flex-col items-start">
            <span>{getImportButtonText(chartType)}</span>
            <span className="text-xs opacity-75">{getImportButtonFormat(chartType)}</span>
          </div>
        </button>
      </div>

      {/* Chart Settings Section */}
      <div className="flex gap-2 border-r border-gray-200 dark:border-gray-600 pr-2">
        <button
          type="button"
          onClick={onShowChartSettings}
          className="px-3 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded hover:bg-purple-700 dark:hover:bg-purple-800 flex items-center gap-2 text-sm transition-colors"
          title="Configurações Específicas do Gráfico"
        >
          <Settings size={16} />
          Config. {chartType ? chartType.charAt(0).toUpperCase() + chartType.slice(1) : 'Gráfico'}
        </button>
      </div>
      
      {/* Export Section */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onExportPNG}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Export as PNG"
        >
          <Image size={20} />
        </button>
        
        <button
          type="button"
          onClick={onExportSVG}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Export as SVG"
        >
          <FileText size={20} />
        </button>
        
        <button
          type="button"
          onClick={onExportJSON}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Export as JSON"
        >
          <Download size={20} />
        </button>
        
        <button
          type="button"
          onClick={onExportHTML}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
          title="Export as HTML"
        >
          <FileText size={20} />
        </button>
      </div>
    </div>
  );
};

export default Toolbar;