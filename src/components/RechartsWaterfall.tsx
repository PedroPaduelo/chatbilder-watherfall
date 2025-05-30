import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  ReferenceLine
} from 'recharts';
import type { DataRow, ChartSettings } from '../types';
import { useRechartsData } from '../hooks/useRechartsData';
import { formatValue } from '../utils/helpers';

interface RechartsWaterfallProps {
  data: DataRow[];
  settings: ChartSettings;
  selectedBarId?: string;
  onBarSelect?: (barId: string | undefined) => void;
}

// Custom waterfall bar component
const CustomWaterfallBar = (props: any) => {
  const { payload, x, y, width, height, settings } = props;
  
  if (!payload || height === 0) return null;
  
  const isNegative = payload.value < 0;
  const color = payload.color || settings.colors[payload.type];
  
  // Handle stacked segments
  if (payload.segments && payload.segments.length > 0) {
    let segmentY = y;
    return (
      <g>
        {payload.segments.map((segment: any, index: number) => {
          const segmentHeight = (segment.valor / payload.value) * Math.abs(height);
          const rect = (
            <rect
              key={`segment-${index}`}
              x={x}
              y={segmentY}
              width={width}
              height={segmentHeight}
              fill={segment.cor}
              rx={index === 0 ? settings.borderRadius : 0}
              ry={index === 0 ? settings.borderRadius : 0}
            />
          );
          segmentY += segmentHeight;
          return rect;
        })}
      </g>
    );
  }
  
  // Regular bar
  return (
    <rect
      x={x}
      y={isNegative ? y : y}
      width={width}
      height={Math.abs(height)}
      fill={color}
      rx={settings.borderRadius}
      ry={settings.borderRadius}
    />
  );
};

// Enhanced tooltip
const CustomTooltip = ({ active, payload, label, settings }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasSegments = data.segments && data.segments.length > 0;
    
    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg border border-gray-600">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-blue-200">
          Valor: {formatValue(data.value, settings.valuePrefix, settings.valueSuffix)}
        </p>
        {data.type !== 'baseline' && data.type !== 'total' && (
          <p className="text-gray-300 text-xs">
            Acumulado: {formatValue(data.end, settings.valuePrefix, settings.valueSuffix)}
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

// Custom label component
const CustomLabel = (props: any) => {
  const { x, y, width, height, value, settings } = props;
  
  if (!settings.showValues) return null;
  
  const isNegative = value < 0;
  const labelY = isNegative ? y + Math.abs(height) + 15 : y - 5;
  
  return (
    <text
      x={x + width / 2}
      y={labelY}
      fill={settings.labelSettings?.valueFontColor || '#374151'}
      textAnchor="middle"
      fontSize={settings.labelSettings?.valueFontSize || 14}
      fontWeight={settings.labelSettings?.valueFontWeight || 'bold'}
    >
      {formatValue(value, settings.valuePrefix, settings.valueSuffix)}
    </text>
  );
};

// Connector lines component
const ConnectorLines = ({ data, settings }: any) => {
  if (!settings.showConnectors) return null;
  
  const lines = [];
  for (let i = 0; i < data.length - 1; i++) {
    const current = data[i];
    const next = data[i + 1];
    
    if (current.type !== 'total' && !current.isSubtotal && 
        next.type !== 'baseline' && next.type !== 'total') {
      lines.push(
        <ReferenceLine
          key={`connector-${i}`}
          segment={[
            { x: i + 0.4, y: current.end },
            { x: i + 0.6, y: current.end }
          ]}
          stroke="#9CA3AF"
          strokeDasharray="3 3"
          opacity={0.7}
        />
      );
    }
  }
  
  return <>{lines}</>;
};

const RechartsWaterfall: React.FC<RechartsWaterfallProps> = ({
  data,
  settings,
  selectedBarId,
  onBarSelect
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { waterfallData } = useRechartsData(data);
  
  // Transform data for waterfall visualization
  const chartData = waterfallData.map((item, index) => {
    if (item.type === 'baseline' || item.type === 'total') {
      return {
        ...item,
        baseValue: 0,
        value: item.value,
        displayValue: item.value,
        index
      };
    } else {
      const isNegative = item.value < 0;
      return {
        ...item,
        baseValue: isNegative ? item.end : item.start,
        value: Math.abs(item.value),
        displayValue: item.value,
        index,
        isNegative
      };
    }
  });

  const handleMouseEnter = (_: any, index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleBarClick = (data: any) => {
    if (onBarSelect) {
      onBarSelect(data.payload.id);
    }
  };
console.log({ chartData, settings, data });
  return (
    <div className="w-full h-full">
      <ResponsiveContainer 
        width={settings.chartDimensions.autoResize ? "100%" : settings.chartDimensions.width} 
        height={settings.chartDimensions.height}
      >
        <ComposedChart
          data={chartData}
          margin={{
            top: 40,
            right: 40,
            left: 60,
            bottom: settings.categoryLabelRotation > 0 ? 120 : 80
          }}
          barCategoryGap={`${settings.barSpacing}%`}
          onMouseMove={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {settings.showGridlines && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              opacity={0.5}
              horizontalFill={['#f8f9fa', 'transparent']}
              fillOpacity={0.3}
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
            domain={['dataMin', 'dataMax + 0.1']}
          />
          
          <Tooltip
            content={(props) => <CustomTooltip {...props} settings={settings} />}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />

          {/* Add zero reference line */}
          {/* <ReferenceLine y={0} stroke="#374151" strokeWidth={1} /> */}

          {/* Invisible base bars for positioning */}
          <Bar
            dataKey="baseValue"
            fill="transparent"
            stackId="waterfall"
          />

          {/* Actual waterfall bars */}
          <Bar
            
            dataKey="value"
            stackId="waterfall"
            maxBarSize={settings.barWidth}
            shape={(props: any) => <CustomWaterfallBar {...props} settings={settings} />}
            onClick={handleBarClick}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || settings.colors[entry.type]}
                fillOpacity={hoveredIndex === index ? 0.8 : 1}
              />
            ))}
            
            {settings.showValues && (
              <LabelList
                content={(props: any) => <CustomLabel {...props} settings={settings} />}
              />
            )}
          </Bar>

          {/* Connector lines */}
          <ConnectorLines data={chartData} settings={settings} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsWaterfall;