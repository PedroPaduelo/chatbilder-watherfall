import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { ChartType, ChartData, ChartSettings, ChartDimensions, DataRow } from '../types';
import { WaterfallChart } from './waterfall';
import SankeyChart from './SankeyChart';
import StackedBarChart from './StackedBarChart';
import LineChart from './LineChart';
import AreaChart from './AreaChart';
import ConfigModal from './ConfigModal';

interface UniversalChartRendererProps {
  chartType: ChartType;
  data: ChartData;
  settings: ChartSettings;
  dimensions: ChartDimensions;
  onDataChange?: (data: DataRow[]) => void;
  onSettingsChange?: (settings: ChartSettings) => void;
  isConfigModalOpen?: boolean;
  onConfigModalClose?: () => void;
}

const UniversalChartRenderer: React.FC<UniversalChartRendererProps> = ({
  chartType,
  data,
  settings,
  dimensions,
  onDataChange,
  onSettingsChange,
  isConfigModalOpen = false,
  onConfigModalClose,
}) => {
  // Estado para controlar a abertura do modal de configurações
  const [configModalOpen, setConfigModalOpen] = useState(isConfigModalOpen);
  
  // Atualiza o estado local quando a prop externa muda
  useEffect(() => {
    if (isConfigModalOpen !== undefined) {
      setConfigModalOpen(isConfigModalOpen);
    }
  }, [isConfigModalOpen]);

  // Função para lidar com mudanças nas configurações
  const handleSettingsChange = (newSettings: ChartSettings) => {
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // Get the appropriate data for the current chart type
  const chartData = useMemo(() => {
    switch (chartType) {
      case 'waterfall':
        return data.waterfall || [];
      case 'sankey':
        return data.sankey || { nodes: [], links: [] };
      case 'stacked-bar':
        return data.stackedBar || data.waterfall || [];
      case 'line':
        return data.line || data.waterfall || [];
      case 'area':
        return data.area || data.waterfall || [];
      default:
        return data.waterfall || [];
    }
  }, [data, chartType]);

  // Render the appropriate chart component
  const renderChart = () => {
    const commonProps = {
      settings,
      width: dimensions.width,
      height: dimensions.height,
      onDataChange,
    };

    switch (chartType) {
      case 'waterfall':
        return (
          <WaterfallChart
            {...commonProps}
            data={chartData as any}
          />
        );
      
      case 'sankey':
        return (
          <SankeyChart
            {...commonProps}
            data={chartData as any}
          />
        );
      
      case 'stacked-bar':
        return (
          <StackedBarChart
            {...commonProps}
            data={chartData as any}
          />
        );
      
      case 'line':
        return (
          <LineChart
            {...commonProps}
            data={chartData as any}
          />
        );
      
      case 'area':
        return (
          <AreaChart
            {...commonProps}
            data={chartData as any}
          />
        );
      
      default:
        return (
          <div className="flex items-center justify-center h-full bg-red-50 rounded-lg border border-red-200">
            <div className="text-center p-8">
              <div className="text-4xl text-red-400 mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Tipo de Gráfico Não Suportado
              </h3>
              <p className="text-red-500">
                O tipo "{chartType}" não é reconhecido
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Modal de configurações */}
      <ConfigModal
        isOpen={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false);
          if (onConfigModalClose) onConfigModalClose();
        }}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      
      {/* Renderização do gráfico */}
      {renderChart()}
    </div>
  );
};

export default UniversalChartRenderer;