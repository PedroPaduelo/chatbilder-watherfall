import { useMemo } from 'react';
import type { DataRow } from '../../../../types';

export const useWaterfallData = (data: DataRow[]) => {
  const processedData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        waterfallData: [],
        segmentKeys: [],
        totalValue: 0,
        hasBaseline: false,
        hasTotal: false
      };
    }

    let cumulativeValue = 0;
    const segmentKeys = new Set<string>();
    let hasBaseline = false;
    let hasTotal = false;

    const waterfallData = data.map((item) => {
      // Check for baseline and total
      if (item.type === 'baseline') hasBaseline = true;
      if (item.type === 'total') hasTotal = true;
      
      // Collect segment keys for stacked bars
      if (item.segments) {
        item.segments.forEach(segment => {
          segmentKeys.add(segment.categoria);
        });
      }

      let processedItem: any = {
        ...item,
        name: item.category,
        start: cumulativeValue,
        originalValue: item.value
      };

      if (item.type === 'baseline') {
        // Baseline starts at 0
        processedItem.start = 0;
        processedItem.end = item.value;
        cumulativeValue = item.value;
      } else if (item.type === 'total') {
        // Total shows cumulative value
        processedItem.start = 0;
        processedItem.end = item.value;
        processedItem.value = item.value;
      } else {
        // Regular waterfall item
        const startValue = cumulativeValue;
        const endValue = cumulativeValue + item.value;
        
        processedItem.start = startValue;
        processedItem.end = endValue;
        cumulativeValue = endValue;
      }

      return processedItem;
    });

    return {
      waterfallData,
      segmentKeys: Array.from(segmentKeys),
      totalValue: cumulativeValue,
      hasBaseline,
      hasTotal
    };
  }, [data]);

  return processedData;
};