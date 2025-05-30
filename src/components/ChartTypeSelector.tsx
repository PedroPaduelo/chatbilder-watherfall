import type React from 'react';
import { BarChart3, GitBranch, BarChart, TrendingUp, Activity, Eye } from 'lucide-react';
import type { ChartType, ChartTypeConfig } from '../types';
import { sampleDataDescriptions } from '../utils/sampleData';

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
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Tipo de Gráfico
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {chartTypes.map((chartType) => {
          const IconComponent = iconMap[chartType.icon as keyof typeof iconMap];
          const isSelected = selectedType === chartType.id;
          
          return (
            <div
              key={chartType.id}
              className={`
                relative rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }
              `}
            >
              <button
                onClick={() => onTypeChange(chartType.id)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`
                    p-2 rounded-lg
                    ${isSelected
                      ? 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}>
                    <IconComponent size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`
                      font-medium text-sm
                      ${isSelected
                        ? 'text-blue-900 dark:text-blue-100'
                        : 'text-gray-900 dark:text-white'
                      }
                    `}>
                      {chartType.name}
                    </h4>
                    <p className={`
                      text-xs mt-1 leading-tight
                      ${isSelected
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-400'
                      }
                    `}>
                      {chartType.description}
                    </p>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </button>

              {/* Botão Ver Exemplo */}
              <div className="px-4 pb-3">
                <button
                  onClick={() => onLoadSampleData(chartType.id)}
                  className={`
                    w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-md transition-colors
                    ${isSelected
                      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/60'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <Eye size={14} />
                  Ver Exemplo
                </button>
                
                {/* Descrição do exemplo */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-tight">
                  {sampleDataDescriptions[chartType.id as keyof typeof sampleDataDescriptions]}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Feature indicators */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Recursos disponíveis:
        </div>
        <div className="flex flex-wrap gap-1">
          {chartTypes
            .find(type => type.id === selectedType)
            ?.supportedFeatures &&
            Object.entries(chartTypes.find(type => type.id === selectedType)!.supportedFeatures)
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
                  {feature === 'gridlines' && 'Grid'}
                  {feature === 'axes' && 'Eixos'}
                  {feature === 'colors' && 'Cores'}
                  {feature === 'annotations' && 'Anotações'}
                </span>
              ))
          }
        </div>
      </div>
    </div>
  );
};

export default ChartTypeSelector;