import React from 'react';
import { Download, Upload, Settings, BarChart3 } from 'lucide-react';
import type { ChartType } from '../../types';

export interface ToolbarProps {
  chartType: ChartType;
  onImportCSV: () => void;
  onShowExportModal: () => void;
  onSaveView?: () => void;
  onManageViews?: () => void;
  onShowChartSettings: () => void;
  onShowChartTypeSelector: () => void;
  onSaveChart?: () => Promise<void>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  chartType,
  onImportCSV,
  onShowExportModal,
  onShowChartSettings,
  onShowChartTypeSelector
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
          onClick={onShowChartTypeSelector}
          className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          title="Selecionar Tipo de Gráfico"
        >
          <BarChart3 size={16} />
          Tipo
        </button>
        <button
          type="button"
          onClick={onShowChartSettings}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          title="Configurações Específicas do Gráfico"
        >
          <Settings size={16} />
          Config.
        </button>
      </div>
      
      {/* Export Section */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onShowExportModal}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 flex items-center gap-2 text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          title="Opções de Exportação"
        >
          <Download size={16} />
          Exportar
        </button>
      </div>
    </div>
  );
};

export default Toolbar;