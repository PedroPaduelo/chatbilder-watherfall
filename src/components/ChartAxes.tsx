import type React from 'react';
import type { ChartSettings, ChartDimensions } from '../types';
import { UI_CONSTANTS } from '../utils/constants';

interface ChartAxesProps {
  settings: ChartSettings;
  dimensions: ChartDimensions;
  chartWidth: number;
  chartHeight: number;
}

const ChartAxes: React.FC<ChartAxesProps> = ({
  settings,
  dimensions,
  chartWidth,
  chartHeight
}) => {
  if (!settings.showAxes) return null;

  return (
    <g>
      {/* X axis */}
      <line
        x1={dimensions.margin.left}
        x2={chartWidth - dimensions.margin.right}
        y1={chartHeight - dimensions.margin.bottom}
        y2={chartHeight - dimensions.margin.bottom}
        stroke={UI_CONSTANTS.COLORS.AXIS}
        strokeWidth={1}
      />
      
      {/* Y axis */}
      <line
        x1={dimensions.margin.left}
        x2={dimensions.margin.left}
        y1={dimensions.margin.top}
        y2={chartHeight - dimensions.margin.bottom}
        stroke={UI_CONSTANTS.COLORS.AXIS}
        strokeWidth={1}
      />
    </g>
  );
};

export default ChartAxes;