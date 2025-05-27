import React from 'react';
import type { ProcessedDataRow, ChartSettings } from '../types';

interface ChartConnectorsProps {
  processedData: ProcessedDataRow[];
  settings: ChartSettings;
}

const ChartConnectors: React.FC<ChartConnectorsProps> = ({
  processedData,
  settings
}) => {
  if (!settings.showConnectors) return null;

  return (
    <g>
      {processedData.map((bar, index) => {
        if (
          index < processedData.length - 1 && 
          bar.type !== 'total' && 
          !bar.isSubtotal &&
          processedData[index + 1].type !== 'baseline' &&
          processedData[index + 1].type !== 'total'
        ) {
          const nextBar = processedData[index + 1];
          return (
            <line
              key={`connector-${bar.id}`}
              x1={bar.x + bar.width}
              y1={bar.y}
              x2={nextBar.x}
              y2={bar.y}
              stroke="#9CA3AF"
              strokeWidth={1}
              strokeDasharray="3,3"
              opacity={0.7}
            />
          );
        }
        return null;
      })}
    </g>
  );
};

export default ChartConnectors;