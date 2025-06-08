import React from 'react';
import { GitBranch, Eye, Sliders, Palette } from 'lucide-react';
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

interface SankeyChartSettingsProps {
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

const SankeyChartSettings: React.FC<SankeyChartSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleChange = (field: string, value: unknown) => {
    if (field.startsWith('sankeySettings.')) {
      const sankeyField = field.replace('sankeySettings.', '');
      const currentSankeySettings = settings.sankeySettings || {
        nodeWidth: 20,
        nodeMinHeight: 10,
        nodeSpacing: 10,
        nodeBorderRadius: 0,
        nodeOpacity: 1,
        linkOpacity: 0.6,
        linkCurvature: 0.5,
        linkGradient: false,
        linkHoverOpacity: 0.8,
        iterations: 32,
        spacingRatio: 0.1,
        minSpacing: 5,
        compressionThreshold: 0.8,
        showNodeLabels: true,
        showNodeValues: true,
        showTooltips: true,
        animationDuration: 500,
        colorScheme: 'default' as const,
        customColors: [],
        linkColorMode: 'source' as const,
        labelFontSize: 12,
        labelFontWeight: 'normal' as const,
        labelColor: '#333',
        valueFontSize: 10,
        valueColor: '#666'
      };
      
      onSettingsChange({
        ...settings,
        sankeySettings: {
          ...currentSankeySettings,
          [sankeyField]: value
        }
      });
    } else {
      onSettingsChange({ ...settings, [field]: value });
    }
  };

  // Default values for Sankey settings
  const sankeySettings = settings.sankeySettings || {
    nodeWidth: 20,
    nodeMinHeight: 10,
    nodeSpacing: 10,
    nodeBorderRadius: 0,
    nodeOpacity: 1,
    linkOpacity: 0.6,
    linkCurvature: 0.5,
    linkGradient: false,
    linkHoverOpacity: 0.8,
    iterations: 32,
    spacingRatio: 0.1,
    minSpacing: 5,
    compressionThreshold: 0.8,
    showNodeLabels: true,
    showNodeValues: true,
    showTooltips: true,
    animationDuration: 500,
    colorScheme: 'default' as const,
    customColors: [],
    linkColorMode: 'source' as const,
    labelFontSize: 12,
    labelFontWeight: 'normal' as const,
    labelColor: '#333',
    valueFontSize: 10,
    valueColor: '#666'
  };

  return (
    <div className="space-y-4">
      {/* Configuração dos Nós */}
      <SettingSection
        title="Nós"
        icon={<GitBranch className="text-blue-600" size={16} />}
        tooltip="Configure a aparência dos nós"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <RangeSlider
            label="Largura dos Nós"
            value={sankeySettings.nodeWidth || 20}
            min={10}
            max={50}
            unit="px"
            onChange={value => handleChange('sankeySettings.nodeWidth', value)}
            tooltip="Largura dos retângulos que representam os nós"
          />
          
          <RangeSlider
            label="Altura Mínima dos Nós"
            value={sankeySettings.nodeMinHeight || 10}
            min={5}
            max={30}
            unit="px"
            onChange={value => handleChange('sankeySettings.nodeMinHeight', value)}
            tooltip="Altura mínima dos nós no diagrama"
          />
          
          <RangeSlider
            label="Espaçamento entre Nós"
            value={sankeySettings.nodeSpacing || 10}
            min={5}
            max={50}
            unit="px"
            onChange={value => handleChange('sankeySettings.nodeSpacing', value)}
            tooltip="Espaçamento vertical entre os nós"
          />
          
          <RangeSlider
            label="Opacidade dos Nós"
            value={sankeySettings.nodeOpacity || 1}
            min={0.1}
            max={1}
            step={0.1}
            onChange={value => handleChange('sankeySettings.nodeOpacity', value)}
            tooltip="Transparência dos nós"
          />
        </div>
      </SettingSection>

      {/* Configuração dos Links */}
      <SettingSection
        title="Conexões (Links)"
        icon={<Sliders className="text-green-600" size={16} />}
        tooltip="Configure a aparência das conexões"
        defaultExpanded={true}
      >
        <div className="space-y-3">
          <RangeSlider
            label="Opacidade dos Links"
            value={sankeySettings.linkOpacity || 0.6}
            min={0.1}
            max={1}
            step={0.1}
            onChange={value => handleChange('sankeySettings.linkOpacity', value)}
            tooltip="Transparência das conexões entre nós"
          />
          
          <RangeSlider
            label="Curvatura dos Links"
            value={sankeySettings.linkCurvature || 0.5}
            min={0}
            max={1}
            step={0.1}
            onChange={value => handleChange('sankeySettings.linkCurvature', value)}
            tooltip="Curvatura das conexões (0 = reto, 1 = muito curvo)"
          />
          
          <RangeSlider
            label="Opacidade ao Passar o Mouse"
            value={sankeySettings.linkHoverOpacity || 0.8}
            min={0.1}
            max={1}
            step={0.1}
            onChange={value => handleChange('sankeySettings.linkHoverOpacity', value)}
            tooltip="Opacidade dos links quando o mouse passa sobre eles"
          />
          
          <CheckboxToggle
            label="Gradiente nos Links"
            checked={sankeySettings.linkGradient || false}
            onChange={checked => handleChange('sankeySettings.linkGradient', checked)}
            tooltip="Aplicar gradiente de cor nos links"
          />
        </div>
      </SettingSection>

      {/* Layout e Algoritmo */}
      <SettingSection
        title="Layout"
        icon={<Eye className="text-purple-600" size={16} />}
        tooltip="Configure o algoritmo de layout"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <RangeSlider
            label="Iterações do Algoritmo"
            value={sankeySettings.iterations || 32}
            min={8}
            max={64}
            step={8}
            onChange={value => handleChange('sankeySettings.iterations', value)}
            tooltip="Número de iterações para otimizar o layout"
          />
          
          <RangeSlider
            label="Razão de Espaçamento"
            value={sankeySettings.spacingRatio || 0.1}
            min={0.05}
            max={0.3}
            step={0.05}
            onChange={value => handleChange('sankeySettings.spacingRatio', value)}
            tooltip="Proporção do espaçamento no layout"
          />
          
          <RangeSlider
            label="Espaçamento Mínimo"
            value={sankeySettings.minSpacing || 5}
            min={1}
            max={20}
            unit="px"
            onChange={value => handleChange('sankeySettings.minSpacing', value)}
            tooltip="Espaçamento mínimo entre elementos"
          />
        </div>
      </SettingSection>

      {/* Rótulos e Valores */}
      <SettingSection
        title="Rótulos e Valores"
        icon={<Eye className="text-orange-600" size={16} />}
        tooltip="Configure a exibição de textos"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <CheckboxToggle
            label="Mostrar Nomes dos Nós"
            checked={sankeySettings.showNodeLabels !== false}
            onChange={checked => handleChange('sankeySettings.showNodeLabels', checked)}
            tooltip="Exibir os nomes dos nós"
          />
          
          <CheckboxToggle
            label="Mostrar Valores dos Nós"
            checked={sankeySettings.showNodeValues !== false}
            onChange={checked => handleChange('sankeySettings.showNodeValues', checked)}
            tooltip="Exibir os valores numéricos dos nós"
          />
          
          <CheckboxToggle
            label="Mostrar Tooltips"
            checked={sankeySettings.showTooltips !== false}
            onChange={checked => handleChange('sankeySettings.showTooltips', checked)}
            tooltip="Exibir informações ao passar o mouse"
          />
          
          <RangeSlider
            label="Tamanho da Fonte dos Rótulos"
            value={sankeySettings.labelFontSize || 12}
            min={8}
            max={20}
            unit="px"
            onChange={value => handleChange('sankeySettings.labelFontSize', value)}
            tooltip="Tamanho da fonte dos rótulos dos nós"
          />
          
          <RangeSlider
            label="Tamanho da Fonte dos Valores"
            value={sankeySettings.valueFontSize || 10}
            min={8}
            max={16}
            unit="px"
            onChange={value => handleChange('sankeySettings.valueFontSize', value)}
            tooltip="Tamanho da fonte dos valores"
          />
        </div>
      </SettingSection>

      {/* Cores e Esquemas */}
      <SettingSection
        title="Esquema de Cores"
        icon={<Palette className="text-red-600" size={16} />}
        tooltip="Configure as cores do diagrama"
        defaultExpanded={false}
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Esquema de Cores
            </label>
            <select
              value={sankeySettings.colorScheme || 'default'}
              onChange={e => handleChange('sankeySettings.colorScheme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="default">Padrão</option>
              <option value="categorical">Categórico</option>
              <option value="gradient">Gradiente</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cor dos Links
            </label>
            <select
              value={sankeySettings.linkColorMode || 'source'}
              onChange={e => handleChange('sankeySettings.linkColorMode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="source">Cor do Nó de Origem</option>
              <option value="target">Cor do Nó de Destino</option>
              <option value="gradient">Gradiente</option>
              <option value="custom">Personalizada</option>
            </select>
          </div>
        </div>
      </SettingSection>
    </div>
  );
};

export default SankeyChartSettings;