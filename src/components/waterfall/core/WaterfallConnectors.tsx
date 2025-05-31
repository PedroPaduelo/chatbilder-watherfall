import React from 'react';
import { ReferenceLine } from 'recharts';
import type { WaterfallConnectorProps } from '../types';
import { shouldShowConnector } from '../utils';

export const WaterfallConnectors: React.FC<WaterfallConnectorProps> = ({
  data,
  settings
}) => {
  if (!settings.showConnectors) return null;

  const lines = [];
  
  for (let i = 0; i < data.length - 1; i++) {
    const current = data[i];
    const next = data[i + 1];
    
    if (shouldShowConnector(current, next, settings)) {
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