import React from 'react';
import type { WaterfallTooltipProps } from '../types';
import { formatWaterfallValue } from '../utils';

export const WaterfallTooltip: React.FC<WaterfallTooltipProps> = ({
  active,
  payload,
  label,
  settings
}) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const hasSegments = data.segments && data.segments.length > 0;

  return (
    <div className="bg-gray-800 text-white px-3 py-2 rounded text-sm shadow-lg border border-gray-600">
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-blue-200">
        Valor: {formatWaterfallValue(
          data.displayValue || data.originalValue,
          settings.valuePrefix,
          settings.valueSuffix
        )}
      </p>
      {data.type !== 'baseline' && data.type !== 'total' && (
        <p className="text-gray-300 text-xs">
          Acumulado: {formatWaterfallValue(data.end, settings.valuePrefix, settings.valueSuffix)}
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
                {formatWaterfallValue(segment.valor, settings.valuePrefix, settings.valueSuffix)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};