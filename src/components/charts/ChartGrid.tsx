import React from 'react';
import type { ChartSettings, ChartDimensions } from '../../types';
import { formatValue } from '../../utils/helpers';
import { UI_CONSTANTS } from '../../utils/constants';

interface ChartGridProps {
  settings: ChartSettings;
  dimensions: ChartDimensions;
  chartWidth: number;
  chartHeight: number;
}

const ChartGrid: React.FC<ChartGridProps> = ({
  settings,
  dimensions,
  chartWidth,
  chartHeight
}) => {
  if (!settings.showGridlines) return null;

  return (
    <g opacity={0.1}>
      {UI_CONSTANTS.CHART.GRID_VALUES.map((val) => (
        <line
          key={`grid-${val}`}
          x1={dimensions.margin.left}
          x2={chartWidth - dimensions.margin.right}
          y1={dimensions.margin.top + (1 - val) * (chartHeight - dimensions.margin.top - dimensions.margin.bottom)}
          y2={dimensions.margin.top + (1 - val) * (chartHeight - dimensions.margin.top - dimensions.margin.bottom)}
          stroke={UI_CONSTANTS.COLORS.GRID_LINE}
          strokeWidth={1}
        />
      ))}
      
      {/* Y axis labels */}
      {UI_CONSTANTS.CHART.GRID_VALUES.map((val) => (
        <text
          key={`y-label-${val}`}
          x={dimensions.margin.left - 10}
          y={dimensions.margin.top + (1 - val) * (chartHeight - dimensions.margin.top - dimensions.margin.bottom)}
          textAnchor="end"
          fontSize="12"
          fill={UI_CONSTANTS.COLORS.AXIS}
          alignmentBaseline="middle"
        >
          {formatValue(val, settings.valuePrefix, settings.valueSuffix)}
        </text>
      ))}
    </g>
  );
};

export default ChartGrid;