import React from 'react';
import type { WaterfallBarProps } from '../types';
import { getWaterfallBarColor } from '../utils';

export const WaterfallBar: React.FC<WaterfallBarProps> = ({
  payload,
  x,
  y,
  width,
  height,
  settings
}) => {
  if (!payload || height === 0) return null;

  const color = getWaterfallBarColor(payload.type, settings.colors);
  
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
              stroke="rgba(255,255,255,0.8)"
              strokeWidth={1}
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
      y={y}
      width={width}
      height={Math.abs(height)}
      fill={color}
      stroke="rgba(255,255,255,0.2)"
      strokeWidth={1}
    />
  );
};