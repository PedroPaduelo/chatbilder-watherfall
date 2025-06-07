import React, { useState } from 'react';
import { X, RotateCcw, Download, Upload, Lightbulb } from 'lucide-react';
import type { ChartType, ChartSettings } from '../../types';
import { ChartSettingsManager } from '../../services/chartSettingsService';
import SankeyChartConfig from '../charts/sankey/config/SankeyConfig';
import { defaultSankeySettings } from '../charts/sankey/utils';
import type { SankeySettings } from '../charts/sankey/types';

interface ChartSpecificSettingsProps {
  chartType: ChartType;
  settings: ChartSettings;
  onSettingsChange: (settings: Partial<ChartSettings>) => void;
  onClose: () => void;
}

const ChartSpecificSettings: React.FC<ChartSpecificSettingsProps> = ({
  chartType,
  settings,
  onSettingsChange,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<Partial<ChartSettings>>(settings);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendations = ChartSettingsManager.getRecommendedSettings(chartType);

  const handleSettingChange = (key: keyof ChartSettings, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    // Save to localStorage for this chart type
    ChartSettingsManager.saveSettingsForChartType(chartType, newSettings);
  };

  // Handler específico para configurações do Sankey
  const handleSankeySettingsChange = (sankeySettings: SankeySettings) => {
    const newSettings = { ...localSettings, sankeySettings };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    // Save to localStorage for this chart type
    ChartSettingsManager.saveSettingsForChartType(chartType, newSettings);
  };

  const handleColorChange = (colorType: string, value: string) => {
    const currentColors = localSettings.colors || {
      baseline: '#4B5563',
      increase: '#10B981',
      decrease: '#EF4444',
      subtotal: '#3B82F6',
      total: '#6366F1'
    };
    
    const newColors = { ...currentColors, [colorType]: value };
    const newSettings = { ...localSettings, colors: newColors };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
    
    ChartSettingsManager.saveSettingsForChartType(chartType, newSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings = ChartSettingsManager.resetToDefaults(chartType);
    // Para Sankey, garantir que as configurações específicas sejam incluídas
    if (chartType === 'sankey') {
      defaultSettings.sankeySettings = defaultSankeySettings;
    }
    setLocalSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  const exportSettings = () => {
    const settingsJson = ChartSettingsManager.exportAllSettings();
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const settingsJson = e.target?.result as string;
          if (ChartSettingsManager.importSettings(settingsJson)) {
            const newSettings = ChartSettingsManager.getCompleteSettings(chartType);
            setLocalSettings(newSettings);
            onSettingsChange(newSettings);
          }
        } catch (error) {
          console.error('Erro ao importar configurações:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const applyRecommendation = (key: keyof ChartSettings, value: any) => {
    handleSettingChange(key, value);
    setShowRecommendations(false);
  };

  const getChartTypeDisplayName = (type: ChartType): string => {
    const names = {
      waterfall: 'Waterfall Chart',
      'stacked-bar': 'Gráfico de Barras Empilhadas',
      line: 'Gráfico de Linha',
      area: 'Gráfico de Área',
      sankey: 'Diagrama Sankey'
    };
    return names[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Configurações - {getChartTypeDisplayName(chartType)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Configurações específicas e otimizadas para este tipo de gráfico
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
              title="Ver Recomendações"
            >
              <Lightbulb size={20} />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Recommendations Panel */}
        {showRecommendations && recommendations.length > 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={16} className="text-amber-600 dark:text-amber-400" />
              <h3 className="font-medium text-amber-900 dark:text-amber-100">
                Configurações Recomendadas
              </h3>
            </div>
            
            {recommendations.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-4 last:mb-0">
                <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.settings.map((setting, settingIndex) => (
                    <div 
                      key={settingIndex}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-700/50 rounded border border-amber-200 dark:border-amber-700"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {setting.label}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {setting.description}
                        </div>
                      </div>
                      <button
                        onClick={() => applyRecommendation(setting.key, setting.value)}
                        className="ml-2 px-2 py-1 bg-amber-600 text-white text-xs rounded hover:bg-amber-700 transition-colors"
                      >
                        Aplicar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Configurações Específicas do Sankey */}
          {chartType === 'sankey' ? (
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Configurações Específicas do Sankey
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configurações avançadas para personalizar a aparência e comportamento do diagrama Sankey
                </p>
              </div>
              
              <SankeyChartConfig
                settings={(localSettings.sankeySettings as SankeySettings) || defaultSankeySettings}
                onSettingsChange={handleSankeySettingsChange}
              />
            </div>
          ) : (
            <>
              {/* Layout Settings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Layout</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Largura da Barra/Linha
                    </label>
                    <input
                      type="number"
                      value={localSettings.barWidth || 60}
                      onChange={(e) => handleSettingChange('barWidth', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="10"
                      max="200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Espaçamento
                    </label>
                    <input
                      type="number"
                      value={localSettings.barSpacing || 20}
                      onChange={(e) => handleSettingChange('barSpacing', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rotação de Labels (graus)
                    </label>
                    <input
                      type="number"
                      value={localSettings.categoryLabelRotation || 0}
                      onChange={(e) => handleSettingChange('categoryLabelRotation', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      max="90"
                      step="15"
                    />
                  </div>
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Exibição</h3>
                <div className="space-y-3">
                  {chartType === 'waterfall' && (
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={localSettings.showConnectors || false}
                        onChange={(e) => handleSettingChange('showConnectors', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar conectores entre barras</span>
                    </label>
                  )}
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={localSettings.showValues !== false}
                      onChange={(e) => handleSettingChange('showValues', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar valores</span>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={localSettings.showCategories !== false}
                      onChange={(e) => handleSettingChange('showCategories', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar categorias</span>
                  </label>

                  {(chartType === 'stacked-bar' || chartType === 'area') && (
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={localSettings.showSegmentLabels !== false}
                        onChange={(e) => handleSettingChange('showSegmentLabels', e.target.checked)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar labels de segmento</span>
                    </label>
                  )}
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={localSettings.showGridlines !== false}
                      onChange={(e) => handleSettingChange('showGridlines', e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar grade</span>
                  </label>
                </div>
              </div>

              {/* Value Formatting */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Formatação de Valores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prefixo
                    </label>
                    <input
                      type="text"
                      value={localSettings.valuePrefix || ''}
                      onChange={(e) => handleSettingChange('valuePrefix', e.target.value)}
                      placeholder="ex: R$ "
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sufixo
                    </label>
                    <input
                      type="text"
                      value={localSettings.valueSuffix || ''}
                      onChange={(e) => handleSettingChange('valueSuffix', e.target.value)}
                      placeholder="ex: %"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Cores</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(localSettings.colors || {}).map(([colorType, color]) => (
                    <div key={colorType}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                        {colorType.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorChange(colorType, e.target.value)}
                          className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorChange(colorType, e.target.value)}
                          className="flex-1 px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              <RotateCcw size={16} />
              Restaurar Padrões
            </button>
            
            <div className="flex items-center gap-1">
              <button
                onClick={exportSettings}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
              >
                <Download size={16} />
                Exportar
              </button>
              
              <label className="flex items-center gap-2 px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition-colors cursor-pointer">
                <Upload size={16} />
                Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={importSettings}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChartSpecificSettings;