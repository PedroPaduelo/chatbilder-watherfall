import { useMemo } from 'react';
import type { DataRow, ProcessedDataRow, ProcessedSegment, ChartSettings, ChartDimensions } from '../types';

export const useProcessedData = (
  data: DataRow[], 
  settings: ChartSettings, 
  dimensions: ChartDimensions
) => {
  return useMemo(() => {
    let cumulative = 0;
    const chartWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    const chartHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;
    
    // Group data by group field
    const groups = data.reduce((acc, item) => {
      const group = item.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, DataRow[]>);
    
    const groupNames = Object.keys(groups);
    const groupCount = groupNames.length;
    const totalBarWidth = settings.barWidth * groupCount;
    const categoryWidth = totalBarWidth + settings.barSpacing;
    
    const allProcessed: ProcessedDataRow[] = [];
    const yMax = 1.1; // Maximum y value for scaling
    
    groupNames.forEach((groupName, groupIndex) => {
      cumulative = 0;
      groups[groupName].forEach((item, index) => {
        const start = cumulative;
        
        if (item.type === 'baseline' || item.type === 'total') {
          cumulative = item.value;
        } else if (item.isSubtotal) {
          cumulative = item.value;
        } else {
          cumulative += item.value;
        }
        
        const x = index * categoryWidth + groupIndex * settings.barWidth;
        const scaleFactor = chartHeight / yMax;
        
        let processedSegments: ProcessedSegment[] | undefined;
        
        // Process segments for stacked bars
        if ((item.type === 'baseline' || item.type === 'total') && item.segments && item.segments.length > 0) {
          let segmentY = chartHeight;
          processedSegments = item.segments.map(segment => {
            const segmentHeight = segment.valor * scaleFactor;
            segmentY -= segmentHeight;
            return {
              ...segment,
              y: segmentY,
              height: segmentHeight
            };
          });
        }
        
        const barHeight = Math.abs(item.type === 'baseline' || item.type === 'total' 
          ? item.value 
          : cumulative - start) * scaleFactor;
        
        const y = item.type === 'baseline' || item.type === 'total'
          ? chartHeight - barHeight
          : chartHeight - Math.max(start, cumulative) * scaleFactor;
        
        allProcessed.push({
          ...item,
          start,
          end: cumulative,
          index,
          x: dimensions.margin.left + x,
          y: dimensions.margin.top + y,
          width: settings.barWidth,
          height: barHeight,
          processedSegments
        });
      });
    });
    
    return allProcessed;
  }, [data, settings, dimensions]);
};