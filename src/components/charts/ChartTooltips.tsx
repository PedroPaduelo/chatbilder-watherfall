import React from 'react';
import type { ProcessedDataRow, ChartSettings } from '../../types';
import { formatValue } from '../../utils/helpers';

interface ChartTooltipsProps {
  processedData: ProcessedDataRow[];
  settings: ChartSettings;
  hoveredBar: string | null;
  hoveredSegment: { barId: string; segmentIndex: number } | null;
}

const ChartTooltips: React.FC<ChartTooltipsProps> = ({
  processedData,
  settings,
  hoveredBar,
  hoveredSegment
}) => {
  // Tooltip for segments
  if (hoveredSegment) {
    const bar = processedData.find(d => d.id === hoveredSegment.barId);
    const segment = bar?.processedSegments?.[hoveredSegment.segmentIndex];
    
    if (bar && segment) {
      return (
        <div
          className="absolute bg-gray-800 text-white px-3 py-2 rounded text-sm pointer-events-none shadow-lg z-10"
          style={{
            left: bar.x + bar.width / 2,
            top: segment.y - 10,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="font-semibold">{segment.categoria}</div>
          <div>
            {formatValue(segment.valor, settings.valuePrefix, settings.valueSuffix)}
          </div>
        </div>
      );
    }
  }

  // Tooltip for regular bars
  if (hoveredBar && !hoveredSegment) {
    const bar = processedData.find(d => d.id === hoveredBar);
    
    if (bar) {
      return (
        <div
          className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none shadow-lg z-10"
          style={{
            left: bar.x + bar.width / 2,
            top: bar.y - 30,
            transform: 'translateX(-50%)'
          }}
        >
          {bar.category}: {formatValue(bar.value, settings.valuePrefix, settings.valueSuffix)}
        </div>
      );
    }
  }

  return null;
};

export default ChartTooltips;