import React from 'react';
import { BarChart3, Eye, Palette } from 'lucide-react';
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

interface CheckboxToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

const CheckboxToggle: React.FC<CheckboxToggleProps> = ({ 
  label, 
  checked, 
  onChange, 
  tooltip 
}) => (
  <div className="flex items-center justify-between">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300" title={tooltip}>
      {label}
    </label>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="rounded border-gray-300"
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

interface WaterfallChartSettingsProps {
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

const WaterfallChartSettings: React.FC<WaterfallChartSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleChange = (field: string, value: unknown) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Barras */}
      <SettingSection
        title="Barras"
        icon={<BarChart3 className="text-blue-600" size={16} />}
        tooltip="Configure a aparência das barras"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <RangeSlider
            label="Largura das Barras"
            value={settings.barWidth}
            min={20}
            max={100}
            unit="px"
            onChange={value => handleChange('barWidth', value)}
            tooltip="Largura de cada barra do gráfico"
          />
          
          <RangeSlider
            label="Espaçamento entre Barras"
            value={settings.barSpacing}
            min={0}
            max={50}
            unit="px"
            onChange={value => handleChange('barSpacing', value)}
            tooltip="Distância entre as barras adjacentes"
          />
        </div>
      </SettingSection>

      {/* Elementos Visuais */}
      <SettingSection
        title="Elementos Visuais"
        icon={<Eye className="text-green-600" size={16} />}
        tooltip="Configure quais elementos mostrar"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <CheckboxToggle
            label="Conectores"
            checked={settings.showConnectors}
            onChange={checked => handleChange('showConnectors', checked)}
            tooltip="Linhas que conectam as barras mostrando o fluxo"
          />
          
          <CheckboxToggle
            label="Valores nas Barras"
            checked={settings.showValues}
            onChange={checked => handleChange('showValues', checked)}
            tooltip="Números dos valores nas barras"
          />
          
          <CheckboxToggle
            label="Nomes das Categorias"
            checked={settings.showCategories}
            onChange={checked => handleChange('showCategories', checked)}
            tooltip="Nomes das categorias abaixo das barras"
          />

          {settings.showCategories && (
            <RangeSlider
              label="Rotação das Categorias"
              value={settings.categoryLabelRotation}
              min={0}
              max={90}
              step={15}
              unit="°"
              onChange={value => handleChange('categoryLabelRotation', value)}
              tooltip="Ângulo de rotação dos rótulos das categorias"
            />
          )}
          
          <CheckboxToggle
            label="Labels dos Segmentos"
            checked={settings.showSegmentLabels}
            onChange={checked => handleChange('showSegmentLabels', checked)}
            tooltip="Rótulos dentro dos segmentos empilhados"
          />
          
          <CheckboxToggle
            label="Linhas de Grade"
            checked={settings.showGridlines}
            onChange={checked => handleChange('showGridlines', checked)}
            tooltip="Linhas horizontais de referência"
          />
          
          <CheckboxToggle
            label="Eixos X e Y"
            checked={settings.showAxes}
            onChange={checked => handleChange('showAxes', checked)}
            tooltip="Linhas dos eixos horizontal (X) e vertical (Y)"
          />
        </div>
      </SettingSection>

      {/* Cores por Tipo */}
      <SettingSection
        title="Cores por Tipo"
        icon={<Palette className="text-purple-600" size={16} />}
        tooltip="Configure as cores para cada tipo de valor"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <ColorPicker
            label="Valor Base"
            value={settings.colors.baseline}
            onChange={value => handleChange('colors.baseline', value)}
            tooltip="Cor para valores de linha de base"
          />
          
          <ColorPicker
            label="Aumento"
            value={settings.colors.increase}
            onChange={value => handleChange('colors.increase', value)}
            tooltip="Cor para valores positivos"
          />
          
          <ColorPicker
            label="Diminuição"
            value={settings.colors.decrease}
            onChange={value => handleChange('colors.decrease', value)}
            tooltip="Cor para valores negativos"
          />
          
          <ColorPicker
            label="Subtotal"
            value={settings.colors.subtotal}
            onChange={value => handleChange('colors.subtotal', value)}
            tooltip="Cor para valores de subtotal"
          />
          
          <ColorPicker
            label="Total"
            value={settings.colors.total}
            onChange={value => handleChange('colors.total', value)}
            tooltip="Cor para valores de total"
          />
        </div>
      </SettingSection>
    </div>
  );
};

export default WaterfallChartSettings;