import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';
import { useWaterfallData } from '../hooks/useWaterfallData';
import { WaterfallBar } from './WaterfallBar';
import { WaterfallTooltip } from './WaterfallTooltip';
import { WaterfallLabel } from './WaterfallLabel';
import { WaterfallConnectors } from './WaterfallConnectors';
import type { WaterfallChartProps } from '../types';
import { formatWaterfallValue } from '../utils';

export const RechartsWaterfall: React.FC<WaterfallChartProps> = ({
  data,
  settings,
  onBarSelect
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { waterfallData } = useWaterfallData(data);
  
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

  return (
    <div className="w-full h-full">
      <ResponsiveContainer 
        width={settings.chartDimensions?.autoResize ? "100%" : settings.chartDimensions?.width} 
        height={settings.chartDimensions?.height || 400}
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
            tickFormatter={(value) => formatWaterfallValue(value, settings.valuePrefix, settings.valueSuffix)}
            tick={{
              fontSize: 12,
              fill: '#374151'
            }}
            axisLine={settings.showAxes}
            tickLine={settings.showAxes}
            domain={['dataMin', 'dataMax + 0.1']}
          />
          
          <Tooltip
            content={(props) => <WaterfallTooltip {...props} settings={settings} />}
            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
          />

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
            shape={(props: any) => <WaterfallBar {...props} settings={settings} />}
            onClick={handleBarClick}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || settings.colors[entry.type as keyof typeof settings.colors] || '#3B82F6'}
                fillOpacity={hoveredIndex === index ? 0.8 : 1}
              />
            ))}
            
            {settings.showValues && (
              <LabelList
                content={(props: any) => <WaterfallLabel {...props} settings={settings} />}
              />
            )}
          </Bar>

          {/* Connector lines */}
          <WaterfallConnectors data={chartData} settings={settings} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};