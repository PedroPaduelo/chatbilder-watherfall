import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Percent,
  Calculator,
  Activity,
  Database
} from 'lucide-react';
import { useChartMetrics } from '../hooks/useChartMetrics';
import { formatValue } from '../utils/helpers';
import { WaterfallChart } from './waterfall';
import type { DataRow, ChartSettings } from '../types';

interface MetricsDashboardProps {
  data: DataRow[];
  settings: ChartSettings;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend,
  description 
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          trend.isPositive 
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
        }`}>
          {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend.value).toFixed(1)}%
        </div>
      )}
    </div>
    
    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {title}
    </h3>
    
    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
      {value}
    </p>
    
    {description && (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {description}
      </p>
    )}
  </div>
);

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ 
  data, 
  settings, 
  className = '' 
}) => {
  const metrics = useChartMetrics(data);

  const formatMetricValue = (value: number) => {
    return formatValue(value, settings.valuePrefix, settings.valueSuffix);
  };

  const metricsConfig = [
    {
      title: 'Valor Total',
      value: formatMetricValue(metrics.total),
      icon: Calculator,
      color: 'bg-blue-600',
      description: `Soma de todos os valores`
    },
    {
      title: 'Variação Líquida',
      value: formatMetricValue(metrics.netChange),
      icon: Activity,
      color: metrics.netChange >= 0 ? 'bg-green-600' : 'bg-red-600',
      trend: {
        value: metrics.changePercentage,
        isPositive: metrics.netChange >= 0
      },
      description: `${metrics.changePercentage.toFixed(1)}% de variação`
    },
    {
      title: 'Total de Aumentos',
      value: formatMetricValue(metrics.totalIncrease),
      icon: TrendingUp,
      color: 'bg-green-600',
      description: `${data.filter(d => d.type === 'increase').length} categorias`
    },
    {
      title: 'Total de Diminuições',
      value: formatMetricValue(metrics.totalDecrease),
      icon: TrendingDown,
      color: 'bg-red-600',
      description: `${data.filter(d => d.type === 'decrease').length} categorias`
    },
    {
      title: 'Categorias',
      value: metrics.categoriesCount,
      icon: Database,
      color: 'bg-purple-600',
      description: `${metrics.stackedBarsCount} com segmentos`
    },
    {
      title: 'Valor Médio',
      value: formatMetricValue(metrics.averageValue),
      icon: BarChart3,
      color: 'bg-indigo-600',
      description: `Mediana: ${formatMetricValue(metrics.median)}`
    }
  ];

  if (data.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 text-center ${className}`}>
        <BarChart3 size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Nenhum dado disponível
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione dados para ver as métricas do gráfico
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Métricas do Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metricsConfig.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>

      {/* Key Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Target size={16} className="text-orange-600" />
          Principais Insights
        </h3>
        
        <div className="space-y-2 text-sm">
          {metrics.largestIncrease && (
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <TrendingUp size={14} />
              <span>
                Maior aumento: <strong>{metrics.largestIncrease.category}</strong> 
                ({formatMetricValue(metrics.largestIncrease.value)})
              </span>
            </div>
          )}
          
          {metrics.largestDecrease && (
            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <TrendingDown size={14} />
              <span>
                Maior diminuição: <strong>{metrics.largestDecrease.category}</strong> 
                ({formatMetricValue(metrics.largestDecrease.value)})
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Percent size={14} />
            <span>
              {metrics.positiveCount} valores positivos, {metrics.negativeCount} negativos
            </span>
          </div>
          
          {metrics.stackedBarsCount > 0 && (
            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <BarChart3 size={14} />
              <span>
                {metrics.stackedBarsCount} categorias com segmentos empilhados
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Waterfall Chart */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-orange-600 dark:text-orange-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Visualização do Gráfico
          </h3>
        </div>
        
        <WaterfallChart 
          data={data} 
          settings={settings}
        />
      </div>
    </div>
  );
};

export default MetricsDashboard;