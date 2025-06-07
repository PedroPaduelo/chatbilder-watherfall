import type React from 'react';
import { BarChart3, GitBranch, BarChart, TrendingUp, Activity, Eye, ChevronRight, Zap } from 'lucide-react';
import type { ChartType, ChartTypeConfig } from '../../types';

export const chartTypes: ChartTypeConfig[] = [
  {
    id: 'waterfall',
    name: 'Waterfall',
    description: 'Visualize cumulative effects of sequential positive/negative values',
    icon: 'BarChart3',
    supportedFeatures: {
      stackedSegments: true,
      connectors: true,
      values: true,
      categories: true,
      gridlines: true,
      axes: true,
      colors: true,
      annotations: true,
    },
  },
  {
    id: 'sankey',
    name: 'Sankey',
    description: 'Flow diagram showing the flow of data between nodes',
    icon: 'GitBranch',
    supportedFeatures: {
      stackedSegments: false,
      connectors: false,
      values: true,
      categories: false,
      gridlines: false,
      axes: false,
      colors: true,
      annotations: false,
    },
  },
  {
    id: 'stacked-bar',
    name: 'Stacked Bar',
    description: 'Bar chart with stacked segments',
    icon: 'BarChart',
    supportedFeatures: {
      stackedSegments: true,
      connectors: false,
      values: true,
      categories: true,
      gridlines: true,
      axes: true,
      colors: true,
      annotations: true,
    },
  },
  {
    id: 'line',
    name: 'Line Chart',
    description: 'Line chart for trends over time',
    icon: 'TrendingUp',
    supportedFeatures: {
      stackedSegments: false,
      connectors: false,
      values: true,
      categories: true,
      gridlines: true,
      axes: true,
      colors: true,
      annotations: true,
    },
  },
  {
    id: 'area',
    name: 'Area Chart',
    description: 'Area chart for filled trends',
    icon: 'Activity',
    supportedFeatures: {
      stackedSegments: true,
      connectors: false,
      values: true,
      categories: true,
      gridlines: true,
      axes: true,
      colors: true,
      annotations: true,
    },
  },
];

const iconMap = {
  BarChart3,
  GitBranch,
  BarChart,
  TrendingUp,
  Activity,
};

interface ChartTypeSelectorProps {
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  onLoadSampleData: (type: ChartType) => void;
  className?: string;
}

const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
  selectedType,
  onTypeChange,
  onLoadSampleData,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Tipo de Gráfico
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Escolha o tipo ideal para seus dados
        </p>
      </div>
      
      <div className="space-y-3">
        {chartTypes.map((chartType) => {
          const IconComponent = iconMap[chartType.icon as keyof typeof iconMap];
          const isSelected = selectedType === chartType.id;
          
          return (
            <div
              key={chartType.id}
              className={`
                relative rounded-lg border transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }
              `}
              onClick={() => onTypeChange(chartType.id)}
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isSelected
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}>
                    <IconComponent size={20} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`
                        font-medium text-sm
                        ${isSelected
                          ? 'text-blue-900 dark:text-blue-100'
                          : 'text-gray-900 dark:text-white'
                        }
                      `}>
                        {chartType.name}
                      </h4>
                      {isSelected && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className={`
                      text-xs leading-relaxed
                      ${isSelected
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {chartType.description}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLoadSampleData(chartType.id);
                      }}
                      className={`
                        flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors
                        ${isSelected
                          ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                      `}
                    >
                      <Eye size={12} />
                      Exemplo
                    </button>
                    
                    <ChevronRight size={16} className={`
                      ${isSelected ? 'text-blue-500' : 'text-gray-400'}
                    `} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Compact feature indicators for selected chart */}
      {chartTypes.find(type => type.id === selectedType) && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-gray-900 dark:text-white">
              Recursos Disponíveis
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(chartTypes.find(type => type.id === selectedType)!.supportedFeatures)
              .filter(([_, supported]) => supported)
              .map(([feature]) => (
                <span
                  key={feature}
                  className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded"
                >
                  {feature === 'stackedSegments' && 'Segmentos'}
                  {feature === 'connectors' && 'Conectores'}
                  {feature === 'values' && 'Valores'}
                  {feature === 'categories' && 'Categorias'}
                  {feature === 'gridlines' && 'Grade'}
                  {feature === 'axes' && 'Eixos'}
                  {feature === 'colors' && 'Cores'}
                  {feature === 'annotations' && 'Anotações'}
                </span>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartTypeSelector;