import { useState } from 'react';
import type { DataRow, ChartSettings } from '../types';
import { useProcessedData } from '../hooks/useProcessedData';
import { useChartDimensions } from '../hooks/useChartDimensions';
import { adjustColor, formatValue } from '../utils/helpers';
import CategoryLabels from './CategoryLabels';

interface WaterfallChartProps {
  data: DataRow[];
  settings: ChartSettings;
}

const WaterfallChart = ({ data, settings }: WaterfallChartProps) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{ barId: string, segmentIndex: number } | null>(null);
  
  // Use dynamic dimensions that adjust for rotated labels
  const dimensions = useChartDimensions(data, settings);
  const processedData = useProcessedData(data, settings, dimensions);

  return (
    <div className="relative w-full">
      <svg 
        width="100%" 
        height={dimensions.height}
        viewBox={`0 0 900 ${dimensions.height}`}
        className="max-w-full h-auto"
      >
        <title>Waterfall Chart with Stacked Bars</title>
        {/* Background */}
        <rect width={dimensions.width} height={dimensions.height} fill="transparent" />
        
        {/* Grid lines */}
        {settings.showGridlines && (
          <g opacity={0.1}>
            {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
              <line
                key={`grid-${val}`}
                x1={dimensions.margin.left}
                x2={dimensions.width - dimensions.margin.right}
                y1={dimensions.margin.top + (1 - val) * (dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
                y2={dimensions.margin.top + (1 - val) * (dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
                stroke="#9CA3AF"
                strokeWidth={1}
              />
            ))}
          </g>
        )}
        
        {/* Axes */}
        <g>
          {/* X axis */}
          <line
            x1={dimensions.margin.left}
            x2={dimensions.width - dimensions.margin.right}
            y1={dimensions.height - dimensions.margin.bottom}
            y2={dimensions.height - dimensions.margin.bottom}
            stroke="#374151"
            strokeWidth={1}
          />
          
          {/* Y axis */}
          <line
            x1={dimensions.margin.left}
            x2={dimensions.margin.left}
            y1={dimensions.margin.top}
            y2={dimensions.height - dimensions.margin.bottom}
            stroke="#374151"
            strokeWidth={1}
          />
        </g>
        
        {/* Bars */}
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
                      rx={segmentIndex === 0 ? settings.borderRadius : 0}
                      ry={segmentIndex === 0 ? settings.borderRadius : 0}
                      onMouseEnter={() => setHoveredSegment({ barId: bar.id, segmentIndex })}
                      onMouseLeave={() => setHoveredSegment(null)}
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
                        fontSize="11"
                        fill="white"
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
                  rx={settings.borderRadius}
                  ry={settings.borderRadius}
                  onMouseEnter={() => setHoveredBar(bar.id)}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    transition: 'fill 0.2s ease',
                    cursor: 'pointer'
                  }}
                />
              )}
              
              {/* Value labels (for non-stacked bars or total value) */}
              {settings.showValues && (!bar.segments || bar.segments.length === 0) && (
                <text
                  x={bar.x + bar.width / 2}
                  y={bar.y - 5}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
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
                  fontSize="12"
                  fill="#374151"
                  fontWeight="bold"
                >
                  {formatValue(bar.value, settings.valuePrefix, settings.valueSuffix)}
                </text>
              )}
            </g>
          ))}
        </g>
        
        {/* Connectors */}
        {settings.showConnectors && (
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
                  />
                );
              }
              return null;
            })}
          </g>
        )}
        
        {/* Category labels - Now using the modular component */}
        <CategoryLabels 
          processedData={processedData}
          settings={settings}
          dimensions={dimensions}
        />
        
        {/* Y axis labels */}
        <g>
          {[0, 0.2, 0.4, 0.6, 0.8, 1.0].map((val) => (
            <text
              key={`y-label-${val}`}
              x={dimensions.margin.left - 10}
              y={dimensions.margin.top + (1 - val) * (dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
              textAnchor="end"
              fontSize="12"
              fill="#374151"
              alignmentBaseline="middle"
            >
              {formatValue(val, settings.valuePrefix, settings.valueSuffix)}
            </text>
          ))}
        </g>
      </svg>
      
      {/* Tooltip for segments */}
      {hoveredSegment && (
        <div
          className="absolute bg-gray-800 text-white px-3 py-2 rounded text-sm pointer-events-none shadow-lg"
          style={{
            left: processedData.find(d => d.id === hoveredSegment.barId)?.x || 0,
            top: (processedData.find(d => d.id === hoveredSegment.barId)?.processedSegments?.[hoveredSegment.segmentIndex]?.y || 0) - 10
          }}
        >
          <div className="font-semibold">
            {processedData.find(d => d.id === hoveredSegment.barId)?.processedSegments?.[hoveredSegment.segmentIndex]?.categoria}
          </div>
          <div>
            {formatValue(
              processedData.find(d => d.id === hoveredSegment.barId)?.processedSegments?.[hoveredSegment.segmentIndex]?.valor || 0,
              settings.valuePrefix,
              settings.valueSuffix
            )}
          </div>
        </div>
      )}
      
      {/* Tooltip for regular bars */}
      {hoveredBar && !hoveredSegment && (
        <div
          className="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm pointer-events-none"
          style={{
            left: processedData.find(d => d.id === hoveredBar)?.x || 0,
            top: (processedData.find(d => d.id === hoveredBar)?.y || 0) - 30
          }}
        >
          {processedData.find(d => d.id === hoveredBar)?.category}: {formatValue(
            processedData.find(d => d.id === hoveredBar)?.value || 0,
            settings.valuePrefix,
            settings.valueSuffix
          )}
        </div>
      )}
    </div>
  );
};

export default WaterfallChart;