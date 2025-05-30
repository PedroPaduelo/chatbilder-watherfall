import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import type { RechartsSegmentData, ChartSettings } from '../types';
import { formatValue } from '../utils/helpers';

interface RechartsStackedBarsProps {
  data: RechartsSegmentData[];
  segmentKeys: string[];
  segmentColors: Record<string, string>;
  settings: ChartSettings;
  selectedBarId?: string;
  onBarSelect?: (barId: string | undefined) => void;
  width?: number;
  height?: number;
}

// Custom tooltip for stacked bars
const StackedTooltip = ({ active, payload, label, settings }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, item: any) => sum + item.value, 0);
    
    return (
      <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="mb-1">
          Total: {formatValue(total, settings.valuePrefix, settings.valueSuffix)}
        </p>
        <div className="border-t border-gray-600 pt-1">
          {payload.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.color }}
              />
              <span>
                {item.dataKey}: {formatValue(item.value, settings.valuePrefix, settings.valueSuffix)}
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
    >
      {formatValue(value, settings.valuePrefix, settings.valueSuffix)}
    </text>
  );
};

const RechartsStackedBars: React.FC<RechartsStackedBarsProps> = ({
  data,
  segmentKeys,
  segmentColors,
  settings,
  width,
  height
}) => {
  const chartHeight = height || settings.chartDimensions.height;
  const chartWidth = width || settings.chartDimensions.width;

  if (data.length === 0 || segmentKeys.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer 
      width={settings.chartDimensions.autoResize ? "100%" : chartWidth} 
      height={chartHeight}
    >
      <BarChart
        data={data}
        margin={{
          top: 40,
          right: 40,
          left: 60,
          bottom: 80
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
        />
        
        <YAxis
          tickFormatter={(value) => formatValue(value, settings.valuePrefix, settings.valueSuffix)}
          tick={{
            fontSize: 12,
            fill: '#374151'
          }}
          axisLine={settings.showAxes}
        />
        
        <Tooltip
          content={(props) => (
            <StackedTooltip {...props} settings={settings} />
          )}
        />

        {/* Render each segment as a stacked bar */}
        {segmentKeys.map((key) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="segments"
            fill={segmentColors[key] || '#8884d8'}
            maxBarSize={settings.barWidth}
          >
            {settings.showSegmentLabels && (
              <LabelList
                content={(props) => <SegmentLabel {...props} settings={settings} />}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RechartsStackedBars;