import { useMemo } from 'react';
import type { DataRow, RechartsDataPoint, RechartsSegmentData } from '../types';

export const useRechartsData = (data: DataRow[]) => {
  return useMemo(() => {
    let cumulative = 0;
    
    // Process data for waterfall chart
    const waterfallData: RechartsDataPoint[] = data.map((item) => {
      const start = cumulative;
      
      if (item.type === 'baseline' || item.type === 'total') {
        cumulative = item.value;
      } else if (item.isSubtotal) {
        cumulative = item.value;
      } else {
        cumulative += item.value;
      }
      
      return {
        name: item.category,
        value: item.value,
        start,
        end: cumulative,
        type: item.type,
        color: item.color,
        segments: item.segments,
        originalData: item
      };
    });

    // Process data for stacked segments
    const segmentData: RechartsSegmentData[] = [];
    const segmentKeys: string[] = [];
    
    data.forEach((item) => {
      if (item.segments && item.segments.length > 0) {
        const segmentPoint: RechartsSegmentData = { name: item.category };
        
        item.segments.forEach((segment) => {
          const key = segment.categoria;
          segmentPoint[key] = segment.valor;
          
          if (!segmentKeys.includes(key)) {
            segmentKeys.push(key);
          }
        });
        
        segmentData.push(segmentPoint);
      }
    });

    // Create color mapping for segments
    const segmentColors: Record<string, string> = {};
    data.forEach((item) => {
      if (item.segments) {
        item.segments.forEach((segment) => {
          segmentColors[segment.categoria] = segment.cor;
        });
      }
    });

    return {
      waterfallData,
      segmentData,
      segmentKeys,
      segmentColors
    };
  }, [data]);
};