import React from 'react';
import { Maximize2, Palette, Type } from 'lucide-react';
import type { ChartSettings } from '../../../types';

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  tooltip?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const SettingSection: React.FC<SettingSectionProps> = ({ 
  title, 
  icon, 
  tooltip, 
  children, 
  defaultExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors rounded-t-lg"
        title={tooltip}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-900 dark:text-white text-sm">{title}</span>
        </div>
        <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-200 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  tooltip?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  tooltip
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300" title={tooltip}>
        {label}
      </label>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {value}{unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
    />
  </div>
);

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tooltip?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, tooltip }) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" title={tooltip}>
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
      />
      <span className="text-xs font-mono text-gray-500">{value}</span>
    </div>
  </div>
);

interface UniversalChartSettingsProps {
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

const UniversalChartSettings: React.FC<UniversalChartSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentKey = parent as keyof ChartSettings;
      const parentValue = settings[parentKey];
      
      if (typeof parentValue === 'object' && parentValue !== null) {
        onSettingsChange({
          ...settings,
          [parent]: {
            ...parentValue,
            [child]: value
          }
        });
      }
    } else {
      onSettingsChange({ ...settings, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Dimensões do Gráfico */}
      <SettingSection
        title="Dimensões"
        icon={<Maximize2 className="text-blue-600" size={16} />}
        tooltip="Configure o tamanho do gráfico"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Redimensionamento Automático
            </label>
            <input
              type="checkbox"
              checked={settings.chartDimensions?.autoResize || true}
              onChange={(e) => handleChange('chartDimensions.autoResize', e.target.checked)}
              className="rounded border-gray-300"
            />
          </div>

          {!settings.chartDimensions?.autoResize && (
            <>
              <RangeSlider
                label="Largura"
                value={settings.chartDimensions?.width || 900}
                min={400}
                max={1600}
                step={50}
                unit="px"
                onChange={value => handleChange('chartDimensions.width', value)}
              />
              
              <RangeSlider
                label="Altura"
                value={settings.chartDimensions?.height || 500}
                min={300}
                max={1000}
                step={25}
                unit="px"
                onChange={value => handleChange('chartDimensions.height', value)}
              />
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proporção
            </label>
            <select
              value={settings.chartDimensions?.aspectRatio || 'auto'}
              onChange={e => handleChange('chartDimensions.aspectRatio', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Automático</option>
              <option value="16:9">16:9 (Widescreen)</option>
              <option value="4:3">4:3 (Clássico)</option>
              <option value="1:1">1:1 (Quadrado)</option>
            </select>
          </div>
        </div>
      </SettingSection>

      {/* Cores Principais */}
      <SettingSection
        title="Cores Principais"
        icon={<Palette className="text-purple-600" size={16} />}
        tooltip="Configure as cores principais do gráfico"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <ColorPicker
            label="Cor Principal"
            value={settings.primaryColor}
            onChange={value => handleChange('primaryColor', value)}
            tooltip="Cor principal para elementos do gráfico"
          />
          
          <ColorPicker
            label="Cor de Destaque"
            value={settings.accentColor}
            onChange={value => handleChange('accentColor', value)}
            tooltip="Cor de destaque para elementos ativos"
          />
          
          <ColorPicker
            label="Cor de Fundo"
            value={settings.backgroundColor}
            onChange={value => handleChange('backgroundColor', value)}
            tooltip="Cor de fundo do gráfico"
          />
        </div>
      </SettingSection>

      {/* Formatação de Texto */}
      <SettingSection
        title="Formatação de Texto"
        icon={<Type className="text-green-600" size={16} />}
        tooltip="Configure a aparência dos textos"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Prefixo dos Valores
            </label>
            <input
              type="text"
              value={settings.valuePrefix}
              onChange={(e) => handleChange('valuePrefix', e.target.value)}
              placeholder="R$ "
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sufixo dos Valores
            </label>
            <input
              type="text"
              value={settings.valueSuffix}
              onChange={(e) => handleChange('valueSuffix', e.target.value)}
              placeholder=" mil"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </SettingSection>
    </div>
  );
};

export default UniversalChartSettings;