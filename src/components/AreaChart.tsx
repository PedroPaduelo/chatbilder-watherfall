import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { DataRow, ChartSettings } from '../types';
import { formatValue } from '../utils/helpers';

interface AreaChartProps {
  data: DataRow[];
  settings: ChartSettings;
  width?: number;
  height?: number;
}

// Custom tooltip for area chart
const AreaTooltip = ({ active, payload, label, settings }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasSegments = data.segments && data.segments.length > 0;
    
    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg border border-gray-600">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-200">
          Valor Total: {formatValue(data.value, settings.valuePrefix, settings.valueSuffix)}
        </p>
        {data.type && (
          <p className="text-gray-300 text-xs capitalize mb-1">
            Tipo: {data.type}
          </p>
        )}
        
        {hasSegments && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <p className="text-xs text-gray-300 mb-1">Segmentos:</p>
            {data.segments.map((segment: any, index: number) => (
              <div key={index} className="flex items-center gap-2 text-xs mb-1">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0" 
                  style={{ backgroundColor: segment.cor }}
                />
                <span className="flex-1">{segment.categoria}</span>
                <span className="text-blue-200">
                  {formatValue(segment.valor, settings.valuePrefix, settings.valueSuffix)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
};

const AreaChart: React.FC<AreaChartProps> = ({
  data,
  settings,
  width,
  height
}) => {
  // Transform data for area chart
  const chartData = data.map((item, index) => ({
    ...item,
    name: item.category,
    index
  }));

  const chartHeight = height || settings.chartDimensions.height;
  const chartWidth = width || settings.chartDimensions.width;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-4xl text-gray-400 mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum Dado Disponível
          </h3>
          <p className="text-gray-500">
            Adicione dados para visualizar o gráfico de área
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
        <RechartsAreaChart
          data={chartData}
          margin={{
            top: 40,
            right: 40,
            left: 60,
            bottom: settings.categoryLabelRotation > 0 ? 120 : 80
          }}
        >
          <defs>
            <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={settings.accentColor || '#3B82F6'} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={settings.accentColor || '#3B82F6'} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          {settings.showGridlines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              opacity={0.5}
            />
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
            content={(props) => <AreaTooltip {...props} settings={settings} />}
            cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={settings.accentColor || '#3B82F6'}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorArea)"
            dot={{ r: 4, fill: settings.accentColor || '#3B82F6', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChart;