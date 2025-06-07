import React from 'react';
import type { WaterfallLabelProps } from '../types';
import { formatWaterfallValue } from '../utils';

export const WaterfallLabel: React.FC<WaterfallLabelProps> = ({
  x,
  y,
  width,
  height,
  value,
  settings,
  payload
}) => {
  if (!settings.showValues) return null;

  const displayValue = payload?.displayValue || payload?.originalValue || value;
  const isNegative = displayValue < 0;
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
      {formatWaterfallValue(displayValue, settings.valuePrefix, settings.valueSuffix)}
    </text>
  );
};