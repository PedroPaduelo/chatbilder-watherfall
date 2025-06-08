import React, { useState } from 'react';
import { Settings, RefreshCw } from 'lucide-react';
import type { ChartSettings, ChartType } from '../../types';
import { defaultSettings } from '../../utils/constants';
import UniversalChartSettings from './settings/UniversalChartSettings';
import SankeyChartSettings from './settings/SankeyChartSettings';
import WaterfallChartSettings from './settings/WaterfallChartSettings';
import LineChartSettings from './settings/LineChartSettings';

interface NewSettingsPanelProps {
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
  chartType: ChartType;
}

const NewSettingsPanel: React.FC<NewSettingsPanelProps> = ({
  settings,
  onSettingsChange,
  chartType
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'specific'>('general');

  const handleResetToDefaults = () => {
    onSettingsChange({
      ...defaultSettings,
      // Preserve chart dimensions if auto-resize is enabled
      chartDimensions: settings.chartDimensions.autoResize 
        ? settings.chartDimensions 
        : defaultSettings.chartDimensions
    });
  };

  const getChartTypeName = (type: ChartType): string => {
    const names = {
      waterfall: 'Waterfall',
      sankey: 'Sankey',
      'stacked-bar': 'Stacked Bar',
      line: 'Line Chart',
      area: 'Area Chart'
    };
    return names[type] || type;
  };

  const renderSpecificSettings = () => {
    switch (chartType) {
      case 'sankey':
        return (
          <SankeyChartSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case 'waterfall':
        return (
          <WaterfallChartSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case 'line':
        return (
          <LineChartSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case 'area':
        return (
          <LineChartSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      case 'stacked-bar':
        return (
          <WaterfallChartSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            <p>Configurações específicas não disponíveis para este tipo de gráfico.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-600 dark:text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Configurações - {getChartTypeName(chartType)}
            </h3>
          </div>
          <button
            onClick={handleResetToDefaults}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            title="Restaurar configurações padrão"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('general')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'general'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            Geral
          </button>
          <button
            onClick={() => setActiveTab('specific')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'specific'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {getChartTypeName(chartType)}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4">
          {activeTab === 'general' ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-blue-500 rounded"></div>
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                  Configurações Universais
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Estas configurações se aplicam a todos os tipos de gráfico.
              </p>
              <UniversalChartSettings
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-purple-500 rounded"></div>
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200">
                  Configurações Específicas
                </h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Estas configurações são específicas para gráficos do tipo {getChartTypeName(chartType)}.
              </p>
              {renderSpecificSettings()}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          <div>
            <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Dicas de Configuração
            </h5>
            <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Use a aba <strong>Geral</strong> para ajustar dimensões, cores e formatação</li>
              <li>• Use a aba <strong>{getChartTypeName(chartType)}</strong> para configurações específicas deste tipo</li>
              <li>• Clique em <strong>Reset</strong> para voltar às configurações padrão</li>
              <li>• As alterações são aplicadas em tempo real no gráfico</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSettingsPanel;