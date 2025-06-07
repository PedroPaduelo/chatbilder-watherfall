import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  Legend
} from 'recharts';
import type { DataRow, ChartSettings } from '../../../../types';
import { formatValue } from '../../../../utils/helpers';
import { useRechartsData } from '../../../../hooks/useRechartsData';

interface StackedBarChartProps {
  data: DataRow[];
  settings: ChartSettings;
  width?: number;
  height?: number;
}

// Custom tooltip for stacked bars
const StackedBarTooltip = ({ active, payload, label, settings }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
    
    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg border border-gray-600">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-200 mb-2">
          Total: {formatValue(total, settings.valuePrefix, settings.valueSuffix)}
        </p>
        <div className="border-t border-gray-600 pt-2">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs mb-1">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span className="flex-1">{item.dataKey}</span>
              <span className="text-blue-200">
                {formatValue(item.value, settings.valuePrefix, settings.valueSuffix)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom label for segment values
const SegmentLabel = (props: any) => {
  const { x, y, width, height, value, settings } = props;
  
  if (!settings.showSegmentLabels || height < 20) return null;
  
  return (
    <text
      x={x + width / 2}
      y={y + height / 2}
      fill={settings.labelSettings?.segmentLabelFontColor || '#FFFFFF'}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={settings.labelSettings?.segmentLabelFontSize || 10}
      fontWeight={settings.labelSettings?.segmentLabelFontWeight || 'normal'}
    >
      {formatValue(value, settings.valuePrefix, settings.valueSuffix)}
    </text>
  );
};

const StackedBarChart: React.FC<StackedBarChartProps> = ({
  data,
  settings,
  width,
  height
}) => {
  const [selectedBarId, setSelectedBarId] = useState<string | undefined>();
  const { segmentData, segmentKeys, segmentColors } = useRechartsData(data);

  const chartHeight = height || settings.chartDimensions.height;
  const chartWidth = width || settings.chartDimensions.width;

  // Handle click on bars
  const handleBarClick = (data: any) => {
    setSelectedBarId(data.id);
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-4xl text-gray-400 mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum Dado Disponível
          </h3>
          <p className="text-gray-500">
            Adicione dados para visualizar o gráfico de barras empilhadas
          </p>
        </div>
      </div>
    );
  }

  if (segmentData.length === 0 || segmentKeys.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-yellow-50 rounded-lg border-2 border-dashed border-yellow-300">
        <div className="text-center p-8">
          <div className="text-4xl text-yellow-400 mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-yellow-600 mb-2">
            Nenhum Segmento Encontrado
          </h3>
          <p className="text-yellow-500">
            Adicione segmentos aos dados para criar barras empilhadas
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer 
        width={settings.chartDimensions.autoResize ? "100%" : chartWidth} 
        height={chartHeight}
      >
        <BarChart
          data={segmentData}
          margin={{
            top: 40,
            right: 40,
            left: 60,
            bottom: settings.categoryLabelRotation > 0 ? 120 : 80
          }}
          barCategoryGap={settings.barSpacing}
        >
          {settings.showGridlines && (
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          )}
          
          <XAxis
            dataKey="name"
            tick={{
              fontSize: settings.labelSettings?.categoryFontSize || 12,
              fill: settings.labelSettings?.categoryFontColor || '#374151',
              fontWeight: settings.labelSettings?.categoryFontWeight || 'normal'
            }}
            angle={-settings.categoryLabelRotation}
            textAnchor={settings.categoryLabelRotation > 0 ? 'end' : 'middle'}
            height={settings.categoryLabelRotation > 0 ? 100 : 60}
            interval={0}
            axisLine={settings.showAxes}
            tickLine={settings.showAxes}
          />
          
          <YAxis
            tickFormatter={(value) => formatValue(value, settings.valuePrefix, settings.valueSuffix)}
            tick={{
              fontSize: 12,
              fill: '#374151'
            }}
            axisLine={settings.showAxes}
            tickLine={settings.showAxes}
          />
          
          <Tooltip
            content={(props) => <StackedBarTooltip {...props} settings={settings} />}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />

          {/* Legend for segments */}
          {segmentKeys.length > 1 && (
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="rect"
            />
          )}

          {/* Render each segment as a stacked bar */}
          {segmentKeys.map((key) => (
            <Bar
              key={key}
              dataKey={key}
              stackId="segments"
              fill={segmentColors[key] || '#8884d8'}
              maxBarSize={settings.barWidth}
              onClick={handleBarClick}
              style={{ cursor: 'pointer' }}
            >
              {settings.showSegmentLabels && (
                <LabelList
                  content={(props) => <SegmentLabel {...props} settings={settings} />}
                />
              )}
              
              {/* Highlight selected bar */}
              {segmentData.map((entry, entryIndex) => (
                <Cell
                  key={`cell-${entryIndex}`}
                  fillOpacity={selectedBarId === entry.id ? 0.8 : 1}
                />
              ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>

      {/* Selection indicator */}
      {selectedBarId && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Barra Selecionada</h4>
          <p className="text-blue-700 dark:text-blue-300">
            {segmentData.find(d => d.id === selectedBarId)?.name || 'Categoria não encontrada'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StackedBarChart;