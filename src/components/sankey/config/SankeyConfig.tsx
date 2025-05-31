import React from 'react';
import type { SankeySettings } from '../types';
import { defaultSankeySettings, sankeyColorPalettes } from '../utils';

interface SankeyConfigProps {
  settings: SankeySettings;
  onSettingsChange: (settings: SankeySettings) => void;
}

const SankeyConfig: React.FC<SankeyConfigProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (key: keyof SankeySettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const resetToDefaults = () => {
    onSettingsChange(defaultSankeySettings);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Configurações do Sankey</h3>
        <button
          onClick={resetToDefaults}
          className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Restaurar Padrões
        </button>
      </div>

      {/* Configurações Gerais */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Geral</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Título</label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título do gráfico"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Largura</label>
            <input
              type="number"
              value={settings.width}
              onChange={(e) => handleChange('width', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="400"
              max="2000"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Altura</label>
            <input
              type="number"
              value={settings.height}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="300"
              max="1200"
            />
          </div>
        </div>
      </div>

      {/* Configurações dos Nós */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Nós</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Largura</label>
            <input
              type="number"
              value={settings.nodeWidth}
              onChange={(e) => handleChange('nodeWidth', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Altura Mínima</label>
            <input
              type="number"
              value={settings.nodeMinHeight}
              onChange={(e) => handleChange('nodeMinHeight', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="10"
              max="50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Opacidade</label>
            <input
              type="range"
              value={settings.nodeOpacity}
              onChange={(e) => handleChange('nodeOpacity', parseFloat(e.target.value))}
              className="w-full"
              min="0.1"
              max="1"
              step="0.1"
            />
            <span className="text-xs text-gray-500">{settings.nodeOpacity}</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Borda Arredondada</label>
            <input
              type="range"
              value={settings.nodeBorderRadius}
              onChange={(e) => handleChange('nodeBorderRadius', parseInt(e.target.value))}
              className="w-full"
              min="0"
              max="10"
              step="1"
            />
            <span className="text-xs text-gray-500">{settings.nodeBorderRadius}px</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showNodeLabels}
              onChange={(e) => handleChange('showNodeLabels', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Mostrar Rótulos</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.showNodeValues}
              onChange={(e) => handleChange('showNodeValues', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-600">Mostrar Valores</span>
          </label>
        </div>
      </div>

      {/* Configurações dos Links */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Conexões</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Opacidade</label>
            <input
              type="range"
              value={settings.linkOpacity}
              onChange={(e) => handleChange('linkOpacity', parseFloat(e.target.value))}
              className="w-full"
              min="0.1"
              max="1"
              step="0.1"
            />
            <span className="text-xs text-gray-500">{settings.linkOpacity}</span>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Curvatura</label>
            <input
              type="range"
              value={settings.linkCurvature}
              onChange={(e) => handleChange('linkCurvature', parseFloat(e.target.value))}
              className="w-full"
              min="0"
              max="1"
              step="0.1"
            />
            <span className="text-xs text-gray-500">{settings.linkCurvature}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Modo de Cor</label>
          <select
            value={settings.linkColorMode}
            onChange={(e) => handleChange('linkColorMode', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="source">Cor da Origem</option>
            <option value="target">Cor do Destino</option>
            <option value="gradient">Gradiente</option>
            <option value="custom">Personalizada</option>
          </select>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.linkGradient}
            onChange={(e) => handleChange('linkGradient', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">Usar Gradientes</span>
        </label>
      </div>

      {/* Layout */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Layout</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Iterações</label>
            <input
              type="number"
              value={settings.iterations}
              onChange={(e) => handleChange('iterations', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Espaçamento Mínimo</label>
            <input
              type="number"
              value={settings.minSpacing}
              onChange={(e) => handleChange('minSpacing', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Proporção de Espaçamento</label>
          <input
            type="range"
            value={settings.spacingRatio}
            onChange={(e) => handleChange('spacingRatio', parseFloat(e.target.value))}
            className="w-full"
            min="0.1"
            max="0.9"
            step="0.1"
          />
          <span className="text-xs text-gray-500">{Math.round(settings.spacingRatio * 100)}%</span>
        </div>
      </div>

      {/* Cores */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Cores</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Esquema de Cores</label>
          <select
            value={settings.colorScheme}
            onChange={(e) => handleChange('colorScheme', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="default">Padrão</option>
            <option value="categorical">Categórico</option>
            <option value="gradient">Gradiente</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Prévia das cores */}
        <div className="flex flex-wrap gap-1">
          {(settings.colorScheme === 'custom' ? settings.customColors : 
            sankeyColorPalettes[settings.colorScheme] || sankeyColorPalettes.default
          ).slice(0, 10).map((color, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded border border-gray-300"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Visual */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">Visual</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tamanho do Rótulo</label>
            <input
              type="number"
              value={settings.labelFontSize}
              onChange={(e) => handleChange('labelFontSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="8"
              max="20"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Duração da Animação</label>
            <input
              type="number"
              value={settings.animationDuration}
              onChange={(e) => handleChange('animationDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="1000"
              step="50"
            />
          </div>
        </div>

        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.showTooltips}
            onChange={(e) => handleChange('showTooltips', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-600">Mostrar Tooltips</span>
        </label>
      </div>
    </div>
  );
};

export default SankeyConfig;