import type React from 'react';
import { useState } from 'react';
import { 
  Palette, 
  Type, 
  Eye, 
  ChevronDown, 
  ChevronRight,
  Settings,
  Info,
  Sliders,
  Maximize2,
  Edit3
} from 'lucide-react';
import type { ChartSettings } from '../types';
import { defaultSettings } from '../utils/constants';

interface SettingsPanelProps {
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  tooltip?: string;
}

const SettingSection: React.FC<SettingSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultExpanded = true,
  tooltip 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-800 dark:text-gray-200">{title}</span>
          {tooltip && (
            <div className="group relative">
              <Info size={14} className="text-gray-400 dark:text-gray-500 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {isExpanded ? <ChevronDown size={16} className="text-gray-600 dark:text-gray-400" /> : <ChevronRight size={16} className="text-gray-600 dark:text-gray-400" />}
      </button>
      {isExpanded && (
        <div className="p-4 space-y-3 bg-white dark:bg-gray-900">
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
  unit = '', 
  onChange,
  tooltip 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
          {tooltip && (
            <div className="group relative">
              <Info size={12} className="text-gray-400 dark:text-gray-500 cursor-help" />
              <div className="tooltip bottom-full left-0 mb-2">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <span className="value-badge">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="custom-slider focus-ring"
      />
      <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

interface CheckboxToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

const CheckboxToggle: React.FC<CheckboxToggleProps> = ({ label, checked, onChange, tooltip }) => {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        {tooltip && (
          <div className="group/tooltip relative">
            <Info size={12} className="text-gray-400 dark:text-gray-500 cursor-help" />
            <div className="absolute left-0 bottom-full mb-1 hidden group-hover/tooltip:block bg-gray-800 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-10 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
        }`}>
          <div className={`w-4 h-4 bg-white dark:bg-gray-200 rounded-full shadow-md transform transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          } mt-1`} />
        </div>
      </div>
    </label>
  );
};

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between group">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{label}</span>
      <div className="flex items-center gap-3">
        <div className="color-picker-container">
          <div 
            className="color-picker-preview cursor-pointer"
            style={{ backgroundColor: value }}
            onClick={() => document.getElementById(`color-${label}`)?.click()}
          />
          <input
            id={`color-${label}`}
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="absolute opacity-0 w-0 h-0"
          />
        </div>
        <span className="text-xs font-mono text-gray-500 dark:text-gray-400 min-w-[4rem]">{value}</span>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const parentKey = parent as keyof ChartSettings;
      const parentValue = settings[parentKey];
      
      // Type-safe spread operation
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

  const handleResetToDefaults = () => {
    onSettingsChange({
      ...defaultSettings,
      // Preserve chart dimensions if auto-resize is enabled
      chartDimensions: settings.chartDimensions.autoResize 
        ? settings.chartDimensions 
        : defaultSettings.chartDimensions
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-600 dark:text-blue-400" size={20} />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Configurações do Gráfico</h3>
          </div>
          <button
            onClick={handleResetToDefaults}
            className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1"
            title="Restaurar configurações padrão"
          >
            <Settings size={14} />
            Reset
          </button>
        </div>
        
        <div className="space-y-4">
          {/* Dimensões e Layout */}
          <SettingSection
            title="Dimensões e Layout"
            icon={<Sliders className="text-purple-600" size={16} />}
            tooltip="Configure o tamanho e espaçamento das barras"
            defaultExpanded={false}
          >
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
          </SettingSection>

          {/* Elementos Visuais */}
          <SettingSection
            title="Elementos Visuais"
            icon={<Eye className="text-green-600" size={16} />}
            tooltip="Configure quais elementos mostrar no gráfico"
            defaultExpanded={false}
          >
            <CheckboxToggle
              label="Conectores"
              checked={settings.showConnectors}
              onChange={checked => handleChange('showConnectors', checked)}
              tooltip="Linhas que conectam as barras mostrando o fluxo"
            />
            
            <CheckboxToggle
              label="Valores"
              checked={settings.showValues}
              onChange={checked => handleChange('showValues', checked)}
              tooltip="Números dos valores nas barras"
            />
            
            <CheckboxToggle
              label="Categorias"
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
          </SettingSection>

          {/* Formatação de Valores */}
          <SettingSection
            title="Formatação de Valores"
            icon={<Type className="text-orange-600" size={16} />}
            tooltip="Configure como os valores são exibidos"
            defaultExpanded={false}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prefixo dos Valores
              </label>
              <input
                type="text"
                value={settings.valuePrefix}
                onChange={e => handleChange('valuePrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Ex: R$, $, €"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sufixo dos Valores
              </label>
              <input
                type="text"
                value={settings.valueSuffix}
                onChange={e => handleChange('valueSuffix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="Ex: %, M, K"
              />
            </div>
          </SettingSection>

          {/* Paleta de Cores */}
          <SettingSection
            title="Paleta de Cores"
            icon={<Palette className="text-pink-600" size={16} />}
            tooltip="Cores padrão para cada tipo de barra"
            defaultExpanded={false}
          >
            {/* Color Presets */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Presets de Cores
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const modernColors = {
                      baseline: '#6366F1',
                      increase: '#10B981',
                      decrease: '#EF4444',
                      subtotal: '#8B5CF6',
                      total: '#3B82F6'
                    };
                    Object.entries(modernColors).forEach(([key, color]) => {
                      handleChange(`colors.${key}`, color);
                    });
                  }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-red-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-violet-500"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                  </div>
                  Moderno
                </button>
                
                <button
                  onClick={() => {
                    const oceanColors = {
                      baseline: '#0891B2',
                      increase: '#059669',
                      decrease: '#DC2626',
                      subtotal: '#7C3AED',
                      total: '#1D4ED8'
                    };
                    Object.entries(oceanColors).forEach(([key, color]) => {
                      handleChange(`colors.${key}`, color);
                    });
                  }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 rounded-sm bg-cyan-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-red-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-violet-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-blue-700"></div>
                  </div>
                  Oceano
                </button>
                
                <button
                  onClick={() => {
                    const warmColors = {
                      baseline: '#EA580C',
                      increase: '#16A34A',
                      decrease: '#DC2626',
                      subtotal: '#CA8A04',
                      total: '#9333EA'
                    };
                    Object.entries(warmColors).forEach(([key, color]) => {
                      handleChange(`colors.${key}`, color);
                    });
                  }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 rounded-sm bg-orange-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-green-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-red-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-yellow-600"></div>
                    <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
                  </div>
                  Quente
                </button>
                
                <button
                  onClick={() => {
                    const professionalColors = {
                      baseline: '#374151',
                      increase: '#047857',
                      decrease: '#B91C1C',
                      subtotal: '#1F2937',
                      total: '#111827'
                    };
                    Object.entries(professionalColors).forEach(([key, color]) => {
                      handleChange(`colors.${key}`, color);
                    });
                  }}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                >
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 rounded-sm bg-gray-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-emerald-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-red-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-gray-800"></div>
                    <div className="w-3 h-3 rounded-sm bg-gray-900"></div>
                  </div>
                  Profissional
                </button>
              </div>
            </div>

            {/* Individual Color Pickers */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {Object.entries(settings.colors).map(([key, value]) => (
                <ColorPicker
                  key={key}
                  label={key === 'baseline' ? 'Inicial' : 
                        key === 'increase' ? 'Aumento' : 
                        key === 'decrease' ? 'Diminuição' : 
                        key === 'subtotal' ? 'Subtotal' : 'Total'}
                  value={value}
                  onChange={newValue => handleChange(`colors.${key}`, newValue)}
                />
              ))}
            </div>
          </SettingSection>

          {/* Aparência dos Rótulos */}
          <SettingSection
            title="Aparência dos Rótulos"
            icon={<Edit3 className="text-indigo-600" size={16} />}
            tooltip="Personalize o tamanho, cor e peso das fontes dos rótulos"
            defaultExpanded={false}
          >
            {/* Category Labels */}
            <div className="space-y-3 pb-3 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800">Rótulos das Categorias</h4>
              
              <RangeSlider
                label="Tamanho da Fonte"
                value={settings.labelSettings?.categoryFontSize || 12}
                min={8}
                max={24}
                unit="px"
                onChange={value => handleChange('labelSettings.categoryFontSize', value)}
                tooltip="Tamanho da fonte dos nomes das categorias"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor da Fonte
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.labelSettings?.categoryFontColor || '#374151'}
                    onChange={e => handleChange('labelSettings.categoryFontColor', e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-500">
                    {settings.labelSettings?.categoryFontColor || '#374151'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Peso da Fonte
                </label>
                <select
                  value={settings.labelSettings?.categoryFontWeight || 'normal'}
                  onChange={e => handleChange('labelSettings.categoryFontWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Negrito</option>
                  <option value="bolder">Extra Negrito</option>
                </select>
              </div>
            </div>

            {/* Value Labels */}
            <div className="space-y-3 py-3 border-b border-gray-100">
              <h4 className="text-sm font-semibold text-gray-800">Rótulos dos Valores</h4>
              
              <RangeSlider
                label="Tamanho da Fonte"
                value={settings.labelSettings?.valueFontSize || 14}
                min={8}
                max={24}
                unit="px"
                onChange={value => handleChange('labelSettings.valueFontSize', value)}
                tooltip="Tamanho da fonte dos valores nas barras"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor da Fonte
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.labelSettings?.valueFontColor || '#111827'}
                    onChange={e => handleChange('labelSettings.valueFontColor', e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-500">
                    {settings.labelSettings?.valueFontColor || '#111827'}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Peso da Fonte
                </label>
                <select
                  value={settings.labelSettings?.valueFontWeight || 'bold'}
                  onChange={e => handleChange('labelSettings.valueFontWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Negrito</option>
                  <option value="bolder">Extra Negrito</option>
                </select>
              </div>
            </div>

            {/* Segment Labels */}
            <div className="space-y-3 pt-3">
              <h4 className="text-sm font-semibold text-gray-800">Rótulos dos Segmentos</h4>
              
              <RangeSlider
                label="Tamanho da Fonte"
                value={settings.labelSettings?.segmentLabelFontSize || 10}
                min={6}
                max={18}
                unit="px"
                onChange={value => handleChange('labelSettings.segmentLabelFontSize', value)}
                tooltip="Tamanho da fonte dos rótulos dentro dos segmentos"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cor da Fonte
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.labelSettings?.segmentLabelFontColor || '#FFFFFF'}
                    onChange={e => handleChange('labelSettings.segmentLabelFontColor', e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-500">
                    {settings.labelSettings?.segmentLabelFontColor || '#FFFFFF'}
                  </span>
                </div>
              </div>
            </div>
          </SettingSection>

          {/* Dimensões do Gráfico */}
          <SettingSection
            title="Dimensões do Gráfico"
            icon={<Maximize2 className="text-cyan-600" size={16} />}
            tooltip="Configure o tamanho do gráfico e proporções"
            defaultExpanded={false}
          >
            <CheckboxToggle
              label="Redimensionamento Automático"
              checked={settings.chartDimensions?.autoResize || true}
              onChange={checked => handleChange('chartDimensions.autoResize', checked)}
              tooltip="Ajusta automaticamente o tamanho do gráfico ao container"
            />

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
                  tooltip="Largura do gráfico em pixels"
                />
                
                <RangeSlider
                  label="Altura"
                  value={settings.chartDimensions?.height || 500}
                  min={300}
                  max={1000}
                  step={25}
                  unit="px"
                  onChange={value => handleChange('chartDimensions.height', value)}
                  tooltip="Altura do gráfico em pixels"
                />
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proporção
              </label>
              <select
                value={settings.chartDimensions?.aspectRatio || 'auto'}
                onChange={e => handleChange('chartDimensions.aspectRatio', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="auto">Automático</option>
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Clássico)</option>
                <option value="1:1">1:1 (Quadrado)</option>
                <option value="custom">Personalizado</option>
              </select>
            </div>

            {settings.chartDimensions?.aspectRatio !== 'auto' && settings.chartDimensions?.aspectRatio !== 'custom' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Proporção {settings.chartDimensions.aspectRatio}:</strong><br/>
                  A altura será ajustada automaticamente para manter a proporção selecionada.
                </p>
              </div>
            )}
          </SettingSection>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;