import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Palette, Settings, Eye, Type, Layout } from 'lucide-react';
import type { SankeySettings } from '../types';
import { defaultSankeySettings } from '../utils/constants';

interface SankeyChartConfigProps {
  settings: SankeySettings;
  onSettingsChange: (newSettings: SankeySettings) => void;
}

const SankeyChartConfig: React.FC<SankeyChartConfigProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    nodes: true,
    links: false,
    layout: false,
    visual: false,
    colors: false,
    typography: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSettingChange = <K extends keyof SankeySettings>(
    key: K,
    value: SankeySettings[K]
  ) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...settings.customColors];
    newColors[index] = color;
    handleSettingChange('customColors', newColors);
  };

  const resetToDefaults = () => {
    onSettingsChange(defaultSankeySettings);
  };

  const SectionHeader = ({ 
    title, 
    icon: Icon, 
    sectionKey 
  }: { 
    title: string; 
    icon: any; 
    sectionKey: keyof typeof expandedSections; 
  }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-gray-600" />
        <span className="font-medium text-gray-800">{title}</span>
      </div>
      {expandedSections[sectionKey] ? 
        <ChevronUp size={16} className="text-gray-500" /> : 
        <ChevronDown size={16} className="text-gray-500" />
      }
    </button>
  );

  const InputField = ({ 
    label, 
    type = 'number', 
    value, 
    onChange, 
    min, 
    max, 
    step = 1,
    tooltip 
  }: {
    label: string;
    type?: string;
    value: any;
    onChange: (value: any) => void;
    min?: number;
    max?: number;
    step?: number;
    tooltip?: string;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-500" title={tooltip}>ⓘ</span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      />
    </div>
  );

  const SelectField = ({ 
    label, 
    value, 
    onChange, 
    options,
    tooltip 
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    tooltip?: string;
  }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-500" title={tooltip}>ⓘ</span>
        )}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const ToggleField = ({ 
    label, 
    value, 
    onChange,
    tooltip 
  }: {
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
    tooltip?: string;
  }) => (
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-500" title={tooltip}>ⓘ</span>
        )}
      </label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-purple-600' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
            value ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg">
        <div>
          <h2 className="text-xl font-bold">Configurações do Sankey</h2>
          <p className="text-purple-100 text-sm">Personalize a aparência e comportamento do diagrama</p>
        </div>
        <button
          onClick={resetToDefaults}
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors"
        >
          Resetar
        </button>
      </div>

      {/* Node Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Configurações dos Nós" icon={Layout} sectionKey="nodes" />
        {expandedSections.nodes && (
          <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Largura dos Nós"
              value={settings.nodeWidth}
              onChange={(value) => handleSettingChange('nodeWidth', value)}
              min={5}
              max={50}
              tooltip="Largura dos retângulos que representam os nós"
            />
            <InputField
              label="Altura Mínima"
              value={settings.nodeMinHeight}
              onChange={(value) => handleSettingChange('nodeMinHeight', value)}
              min={10}
              max={100}
              tooltip="Altura mínima dos nós em pixels"
            />
            <InputField
              label="Espaçamento entre Nós"
              value={settings.nodeSpacing}
              onChange={(value) => handleSettingChange('nodeSpacing', value)}
              min={10}
              max={100}
              tooltip="Espaço vertical entre os nós"
            />
            <InputField
              label="Borda Arredondada"
              value={settings.nodeBorderRadius}
              onChange={(value) => handleSettingChange('nodeBorderRadius', value)}
              min={0}
              max={10}
              tooltip="Raio das bordas arredondadas dos nós"
            />
            <InputField
              label="Opacidade dos Nós"
              value={settings.nodeOpacity}
              onChange={(value) => handleSettingChange('nodeOpacity', value)}
              min={0.1}
              max={1}
              step={0.1}
              tooltip="Transparência dos nós (0.1 = muito transparente, 1.0 = opaco)"
            />
          </div>
        )}
      </div>

      {/* Link Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Configurações das Conexões" icon={Settings} sectionKey="links" />
        {expandedSections.links && (
          <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Opacidade das Conexões"
              value={settings.linkOpacity}
              onChange={(value) => handleSettingChange('linkOpacity', value)}
              min={0.1}
              max={1}
              step={0.1}
              tooltip="Transparência das conexões entre nós"
            />
            <InputField
              label="Curvatura das Conexões"
              value={settings.linkCurvature}
              onChange={(value) => handleSettingChange('linkCurvature', value)}
              min={0}
              max={1}
              step={0.1}
              tooltip="Intensidade da curvatura das linhas (0 = reto, 1 = muito curvo)"
            />
            <InputField
              label="Opacidade no Hover"
              value={settings.linkHoverOpacity}
              onChange={(value) => handleSettingChange('linkHoverOpacity', value)}
              min={0.1}
              max={1}
              step={0.1}
              tooltip="Opacidade das conexões quando o mouse passa sobre elas"
            />
            <div className="col-span-1 md:col-span-2">
              <ToggleField
                label="Gradiente nas Conexões"
                value={settings.linkGradient}
                onChange={(value) => handleSettingChange('linkGradient', value)}
                tooltip="Usar gradiente de cores nas conexões entre nós"
              />
            </div>
          </div>
        )}
      </div>

      {/* Layout Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Layout e Posicionamento" icon={Layout} sectionKey="layout" />
        {expandedSections.layout && (
          <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Iterações de Otimização"
              value={settings.iterations}
              onChange={(value) => handleSettingChange('iterations', value)}
              min={1}
              max={20}
              tooltip="Número de iterações para otimizar o posicionamento dos nós"
            />
            <InputField
              label="Proporção de Espaçamento"
              value={settings.spacingRatio}
              onChange={(value) => handleSettingChange('spacingRatio', value)}
              min={0.1}
              max={1}
              step={0.1}
              tooltip="Proporção do espaço vertical dedicado ao espaçamento entre nós"
            />
            <InputField
              label="Espaçamento Mínimo"
              value={settings.minSpacing}
              onChange={(value) => handleSettingChange('minSpacing', value)}
              min={10}
              max={100}
              tooltip="Espaçamento mínimo garantido entre nós adjacentes"
            />
            <InputField
              label="Limite de Compressão"
              value={settings.compressionThreshold}
              onChange={(value) => handleSettingChange('compressionThreshold', value)}
              min={0.5}
              max={1}
              step={0.1}
              tooltip="Limite para compressão automática do layout"
            />
          </div>
        )}
      </div>

      {/* Visual Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Configurações Visuais" icon={Eye} sectionKey="visual" />
        {expandedSections.visual && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleField
                label="Mostrar Rótulos dos Nós"
                value={settings.showNodeLabels}
                onChange={(value) => handleSettingChange('showNodeLabels', value)}
                tooltip="Exibir o nome dos nós ao lado deles"
              />
              <ToggleField
                label="Mostrar Valores dos Nós"
                value={settings.showNodeValues}
                onChange={(value) => handleSettingChange('showNodeValues', value)}
                tooltip="Exibir o valor numérico dentro dos nós"
              />
              <ToggleField
                label="Ativar Tooltips"
                value={settings.showTooltips}
                onChange={(value) => handleSettingChange('showTooltips', value)}
                tooltip="Mostrar informações detalhadas ao passar o mouse"
              />
            </div>
            <InputField
              label="Duração da Animação (ms)"
              value={settings.animationDuration}
              onChange={(value) => handleSettingChange('animationDuration', value)}
              min={0}
              max={1000}
              step={50}
              tooltip="Duração das animações em milissegundos"
            />
          </div>
        )}
      </div>

      {/* Color Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Configurações de Cores" icon={Palette} sectionKey="colors" />
        {expandedSections.colors && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Esquema de Cores"
                value={settings.colorScheme}
                onChange={(value) => handleSettingChange('colorScheme', value as any)}
                options={[
                  { value: 'default', label: 'Padrão' },
                  { value: 'categorical', label: 'Categórico' },
                  { value: 'gradient', label: 'Gradiente' },
                  { value: 'custom', label: 'Personalizado' }
                ]}
                tooltip="Esquema de cores para os nós"
              />
              <SelectField
                label="Modo de Cor das Conexões"
                value={settings.linkColorMode}
                onChange={(value) => handleSettingChange('linkColorMode', value as any)}
                options={[
                  { value: 'source', label: 'Cor do Nó Origem' },
                  { value: 'target', label: 'Cor do Nó Destino' },
                  { value: 'gradient', label: 'Gradiente' },
                  { value: 'custom', label: 'Personalizada' }
                ]}
                tooltip="Como colorir as conexões entre nós"
              />
            </div>
            
            {settings.colorScheme === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cores Personalizadas
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {settings.customColors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                      />
                      <span className="text-xs text-gray-500">Cor {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Typography Settings */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <SectionHeader title="Configurações de Texto" icon={Type} sectionKey="typography" />
        {expandedSections.typography && (
          <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tamanho dos Rótulos"
              value={settings.labelFontSize}
              onChange={(value) => handleSettingChange('labelFontSize', value)}
              min={8}
              max={24}
              tooltip="Tamanho da fonte dos rótulos dos nós"
            />
            <SelectField
              label="Peso dos Rótulos"
              value={settings.labelFontWeight}
              onChange={(value) => handleSettingChange('labelFontWeight', value as any)}
              options={[
                { value: 'normal', label: 'Normal' },
                { value: 'bold', label: 'Negrito' },
                { value: 'bolder', label: 'Extra Negrito' }
              ]}
              tooltip="Peso da fonte dos rótulos"
            />
            <InputField
              label="Cor dos Rótulos"
              type="color"
              value={settings.labelColor}
              onChange={(value) => handleSettingChange('labelColor', value)}
              tooltip="Cor dos rótulos dos nós"
            />
            <InputField
              label="Tamanho dos Valores"
              value={settings.valueFontSize}
              onChange={(value) => handleSettingChange('valueFontSize', value)}
              min={6}
              max={20}
              tooltip="Tamanho da fonte dos valores dentro dos nós"
            />
            <InputField
              label="Cor dos Valores"
              type="color"
              value={settings.valueColor}
              onChange={(value) => handleSettingChange('valueColor', value)}
              tooltip="Cor dos valores dentro dos nós"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SankeyChartConfig;