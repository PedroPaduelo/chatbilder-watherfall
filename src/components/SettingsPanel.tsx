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
  Sliders
} from 'lucide-react';
import type { ChartSettings } from '../types';

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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-800">{title}</span>
          {tooltip && (
            <div className="group relative">
              <Info size={14} className="text-gray-400 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isExpanded && (
        <div className="p-4 space-y-3 bg-white">
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
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {tooltip && (
            <div className="group relative">
              <Info size={12} className="text-gray-400 cursor-help" />
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
      <div className="flex justify-between text-xs text-gray-400">
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
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {tooltip && (
          <div className="group/tooltip relative">
            <Info size={12} className="text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-1 hidden group-hover/tooltip:block bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
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
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}>
          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
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
      <span className="text-sm font-medium text-gray-700 capitalize">{label}</span>
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
        <span className="text-xs font-mono text-gray-500 min-w-[4rem]">{value}</span>
      </div>
    </div>
  );
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleChange = (field: string, value: any) => {
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

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Configurações do Gráfico</h3>
          </div>
          <button
            onClick={() => {
              if (confirm('Deseja restaurar todas as configurações para os valores padrão?')) {
                onSettingsChange({
                  barWidth: 60,
                  barSpacing: 20,
                  borderRadius: 4,
                  showConnectors: true,
                  showValues: true,
                  showCategories: true,
                  showSegmentLabels: true,
                  categoryLabelRotation: 0,
                  valuePrefix: '',
                  valueSuffix: '',
                  showGridlines: true,
                  colors: {
                    baseline: '#4B5563',
                    increase: '#10B981',
                    decrease: '#EF4444',
                    subtotal: '#3B82F6',
                    total: '#6366F1'
                  }
                });
              }
            }}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
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
            
            <RangeSlider
              label="Bordas Arredondadas"
              value={settings.borderRadius}
              min={0}
              max={20}
              unit="px"
              onChange={value => handleChange('borderRadius', value)}
              tooltip="Raio das bordas arredondadas das barras"
            />
          </SettingSection>

          {/* Elementos Visuais */}
          <SettingSection
            title="Elementos Visuais"
            icon={<Eye className="text-green-600" size={16} />}
            tooltip="Configure quais elementos mostrar no gráfico"
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
          </SettingSection>

          {/* Formatação de Valores */}
          <SettingSection
            title="Formatação de Valores"
            icon={<Type className="text-orange-600" size={16} />}
            tooltip="Configure como os valores são exibidos"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prefixo dos Valores
              </label>
              <input
                type="text"
                value={settings.valuePrefix}
                onChange={e => handleChange('valuePrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ex: R$, $, €"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sufixo dos Valores
              </label>
              <input
                type="text"
                value={settings.valueSuffix}
                onChange={e => handleChange('valueSuffix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Ex: %, M, K"
              />
            </div>
          </SettingSection>

          {/* Paleta de Cores */}
          <SettingSection
            title="Paleta de Cores"
            icon={<Palette className="text-pink-600" size={16} />}
            tooltip="Cores padrão para cada tipo de barra"
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
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;