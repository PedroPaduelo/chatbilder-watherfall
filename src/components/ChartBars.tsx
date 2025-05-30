import React from 'react';
import type { ProcessedDataRow, ChartSettings, ChartDimensions } from '../types';
import { adjustColor, formatValue } from '../utils/helpers';

interface ChartBarsProps {
  processedData: ProcessedDataRow[];
  settings: ChartSettings;
  dimensions: ChartDimensions;
  hoveredBar: string | null;
  hoveredSegment: { barId: string; segmentIndex: number } | null;
  onBarHover: (barId: string | null) => void;
  onSegmentHover: (hover: { barId: string; segmentIndex: number } | null) => void;
}

const ChartBars: React.FC<ChartBarsProps> = ({
  processedData,
  settings,
  dimensions,
  hoveredBar,
  hoveredSegment,
  onBarHover,
  onSegmentHover
}) => {
  return (
    <g>
      {processedData.map((bar) => (
        <g key={bar.id}>
          {/* Render stacked segments or single bar */}
          {bar.processedSegments && bar.processedSegments.length > 0 ? (
            // Stacked bar
            bar.processedSegments.map((segment, segmentIndex) => (
              <g key={`${bar.id}-segment-${segmentIndex}`}>
                <rect
                  x={bar.x}
                  y={dimensions.margin.top + segment.y}
                  width={bar.width}
                  height={segment.height}
                  fill={
                    hoveredSegment?.barId === bar.id && hoveredSegment?.segmentIndex === segmentIndex
                      ? adjustColor(segment.cor, 0.8)
                      : segment.cor
                  }
                  onMouseEnter={() => onSegmentHover({ barId: bar.id, segmentIndex })}
                  onMouseLeave={() => onSegmentHover(null)}
                  style={{
                    transition: 'fill 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
                
                {/* Segment labels */}
                {settings.showSegmentLabels && segment.height > 20 && (
                  <text
                    x={bar.x + bar.width / 2}
                    y={dimensions.margin.top + segment.y + segment.height / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={settings.labelSettings?.segmentLabelFontSize || 10}
                    fill={settings.labelSettings?.segmentLabelFontColor || '#FFFFFF'}
                    style={{ pointerEvents: 'none' }}
                  >
                    {formatValue(segment.valor, settings.valuePrefix, settings.valueSuffix)}
                  </text>
                )}
              </g>
            ))
          ) : (
            // Regular bar
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={hoveredBar === bar.id 
                ? adjustColor(bar.color || settings.colors[bar.type], 0.8)
                : bar.color || settings.colors[bar.type]}
              onMouseEnter={() => onBarHover(bar.id)}
              onMouseLeave={() => onBarHover(null)}
              style={{
                transition: 'fill 0.2s ease',
                cursor: 'pointer'
              }}
            />
          )}
          
          {/* Value labels for non-stacked bars */}
          {settings.showValues && (!bar.segments || bar.segments.length === 0) && (
            <text
              x={bar.x + bar.width / 2}
              y={bar.y - 5}
              textAnchor="middle"
              fontSize={settings.labelSettings?.valueFontSize || 14}
              fill={settings.labelSettings?.valueFontColor || '#374151'}
              fontWeight={settings.labelSettings?.valueFontWeight || 'bold'}
            >
              {formatValue(bar.value, settings.valuePrefix, settings.valueSuffix)}
            </text>
          )}
          
          {/* Total value for stacked bars */}
          {settings.showValues && bar.segments && bar.segments.length > 0 && (
            <text
              x={bar.x + bar.width / 2}
              y={bar.y - 5}
              textAnchor="middle"
              fontSize={settings.labelSettings?.valueFontSize || 14}
              fill={settings.labelSettings?.valueFontColor || '#374151'}
              fontWeight={settings.labelSettings?.valueFontWeight || 'bold'}
            >
              {formatValue(bar.value, settings.valuePrefix, settings.valueSuffix)}
            </text>
          )}
        </g>
      ))}
    </g>
  );
};

export default ChartBars;