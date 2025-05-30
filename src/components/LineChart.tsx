import React, { useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot
} from 'recharts';
import type { DataRow, ChartSettings } from '../types';
import { formatValue } from '../utils/helpers';

interface LineChartProps {
  data: DataRow[];
  settings: ChartSettings;
  width?: number;
  height?: number;
}

// Custom dot component for line points
const CustomDot = (props: any) => {
  const { cx, cy, payload, settings, isHovered } = props;
  
  if (!settings.showValues && !isHovered) return null;
  
  return (
    <Dot
      cx={cx}
      cy={cy}
      r={isHovered ? 6 : 4}
      fill={payload.color || settings.colors[payload.type]}
      stroke="#fff"
      strokeWidth={2}
      style={{ cursor: 'pointer' }}
    />
  );
};

// Custom tooltip for line chart
const LineTooltip = ({ active, payload, label, settings }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg border border-gray-600">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-200">
          Valor: {formatValue(data.value, settings.valuePrefix, settings.valueSuffix)}
        </p>
        {data.type && (
          <p className="text-gray-300 text-xs capitalize">
            Tipo: {data.type}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  settings,
  width,
  height
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Transform data for line chart
  const chartData = data.map((item, index) => ({
    ...item,
    name: item.category,
    index
  }));

  const handleMouseEnter = (_: any, index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const chartHeight = height || settings.chartDimensions.height;
  const chartWidth = width || settings.chartDimensions.width;

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-4xl text-gray-400 mb-4">📈</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum Dado Disponível
          </h3>
          <p className="text-gray-500">
            Adicione dados para visualizar o gráfico de linha
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
        <RechartsLineChart
          data={chartData}
          margin={{
            top: 40,
            right: 40,
            left: 60,
            bottom: settings.categoryLabelRotation > 0 ? 120 : 80
          }}
          onMouseMove={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
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
            content={(props) => <LineTooltip {...props} settings={settings} />}
            cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '5 5' }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke={settings.accentColor || '#3B82F6'}
            strokeWidth={3}
            dot={(props) => <CustomDot {...props} settings={settings} isHovered={hoveredIndex === props.index} />}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;