import React, { useState } from 'react';
import { 
  Palette, 
  BarChart3, 
  Eye, 
  Type,
  ChevronDown,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import type { ChartSettings } from '../../../types';

interface WaterfallConfigProps {
  settings: ChartSettings;
  onSettingsChange: (newSettings: ChartSettings) => void;
}

interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
  isExpanded: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon: Icon, isExpanded, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
  >
    <div className="flex items-center gap-2">
      <Icon size={18} />
      <span className="font-medium text-blue-900 dark:text-blue-100">{title}</span>
    </div>
    {isExpanded ? 
      <ChevronDown size={16} className="text-blue-600 dark:text-blue-400" /> : 
      <ChevronRight size={16} className="text-blue-600 dark:text-blue-400" />
    }
  </button>
);

export const WaterfallConfig: React.FC<WaterfallConfigProps> = ({ 
  settings, 
  onSettingsChange 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    appearance: true,
    display: false,
    labels: false,
    colors: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSettingChange = (field: keyof ChartSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleColorChange = (type: string, color: string) => {
    onSettingsChange({
      ...settings,
      colors: {
        ...settings.colors,
        [type]: color
      }
    });
  };

  const resetToDefaults = () => {
    const defaultSettings: Partial<ChartSettings> = {
      barWidth: 60,
      barSpacing: 20,
      showConnectors: true,
      showValues: true,
      showCategories: true,
      categoryLabelRotation: 0,
      showGridlines: true,
      showAxes: true,
      valuePrefix: 'R$ ',
      valueSuffix: '',
    };
    onSettingsChange({ ...settings, ...defaultSettings });
  };

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    type = 'number', 
    min, 
    max, 
    tooltip 
  }: {
    label: string;
    value: any;
    onChange: (value: any) => void;
    type?: string;
    min?: number;
    max?: number;
    tooltip?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400" title={tooltip}>
            ℹ️
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
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
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {tooltip && (
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400" title={tooltip}>
            ℹ️
          </span>
        )}
      </label>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          value ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
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
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
        <div>
          <h2 className="text-xl font-bold">Configurações do Waterfall</h2>
          <p className="text-blue-100 text-sm">Personalize a aparência e comportamento do gráfico</p>
        </div>
        <button
          onClick={resetToDefaults}
          className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <RotateCcw size={16} />
          Resetar
        </button>
      </div>

      {/* Appearance Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader 
          title="Aparência" 
          icon={BarChart3} 
          isExpanded={expandedSections.appearance}
          onToggle={() => toggleSection('appearance')}
        />
        {expandedSections.appearance && (
          <div className="p-4 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Largura das Barras"
              value={settings.barWidth}
              onChange={(value) => handleSettingChange('barWidth', value)}
              min={20}
              max={120}
              tooltip="Largura das barras em pixels"
            />
            <InputField
              label="Espaçamento das Barras"
              value={settings.barSpacing}
              onChange={(value) => handleSettingChange('barSpacing', value)}
              min={0}
              max={50}
              tooltip="Espaçamento entre as barras em pixels"
            />
            <InputField
              label="Prefixo dos Valores"
              value={settings.valuePrefix}
              onChange={(value) => handleSettingChange('valuePrefix', value)}
              type="text"
              tooltip="Texto que aparece antes dos valores (ex: R$, $, €)"
            />
            <InputField
              label="Sufixo dos Valores"
              value={settings.valueSuffix}
              onChange={(value) => handleSettingChange('valueSuffix', value)}
              type="text"
              tooltip="Texto que aparece depois dos valores (ex: %, M, K)"
            />
          </div>
        )}
      </div>

      {/* Display Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader 
          title="Exibição" 
          icon={Eye} 
          isExpanded={expandedSections.display}
          onToggle={() => toggleSection('display')}
        />
        {expandedSections.display && (
          <div className="p-4 space-y-4">
            <ToggleField
              label="Mostrar Conectores"
              value={settings.showConnectors}
              onChange={(value) => handleSettingChange('showConnectors', value)}
              tooltip="Linhas tracejadas conectando as barras"
            />
            <ToggleField
              label="Mostrar Valores"
              value={settings.showValues}
              onChange={(value) => handleSettingChange('showValues', value)}
              tooltip="Valores numéricos sobre as barras"
            />
            <ToggleField
              label="Mostrar Grid"
              value={settings.showGridlines}
              onChange={(value) => handleSettingChange('showGridlines', value)}
              tooltip="Linhas de grade no fundo do gráfico"
            />
            <ToggleField
              label="Mostrar Eixos"
              value={settings.showAxes}
              onChange={(value) => handleSettingChange('showAxes', value)}
              tooltip="Linhas dos eixos X e Y"
            />
          </div>
        )}
      </div>

      {/* Labels Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader 
          title="Rótulos" 
          icon={Type} 
          isExpanded={expandedSections.labels}
          onToggle={() => toggleSection('labels')}
        />
        {expandedSections.labels && (
          <div className="p-4 space-y-4">
            <InputField
              label="Rotação das Categorias"
              value={settings.categoryLabelRotation}
              onChange={(value) => handleSettingChange('categoryLabelRotation', value)}
              min={0}
              max={90}
              tooltip="Ângulo de rotação dos rótulos das categorias"
            />
          </div>
        )}
      </div>

      {/* Colors Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <SectionHeader 
          title="Cores" 
          icon={Palette} 
          isExpanded={expandedSections.colors}
          onToggle={() => toggleSection('colors')}
        />
        {expandedSections.colors && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries({
                baseline: 'Baseline',
                increase: 'Aumento',
                decrease: 'Diminuição',
                subtotal: 'Subtotal',
                total: 'Total'
              }).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.colors[key as keyof typeof settings.colors] || '#3B82F6'}
                      onChange={(e) => handleColorChange(key, e.target.value)}
                      className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {settings.colors[key as keyof typeof settings.colors] || '#3B82F6'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};