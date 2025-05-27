import { useMemo } from 'react';
import type { DataRow, ChartSettings, ChartDimensions } from '../types';
import { calculateBottomMarginForRotation, getMaxCategoryLength } from '../utils/helpers';

/**
 * Custom hook to calculate chart dimensions based on settings and data
 * Automatically adjusts margins for rotated category labels and prevents X-axis overflow
 */
export const useChartDimensions = (
  data: DataRow[],
  settings: ChartSettings,
  baseHeight = 400
): ChartDimensions => {
  return useMemo(() => {
    const maxCategoryLength = getMaxCategoryLength(data);
    const dynamicBottomMargin = calculateBottomMarginForRotation(
      settings.categoryLabelRotation,
      maxCategoryLength,
      12 // fontSize
    );

    // Calculate required width based on data
    const uniqueCategories = [...new Set(data.map(item => item.category))];
    const categoryCount = uniqueCategories.length;
    
    // Group data by group field to count groups per category
    const groups = data.reduce((acc, item) => {
      const group = item.group || 'default';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, DataRow[]>);
    
    const groupCount = Object.keys(groups).length;
    const totalBarWidth = settings.barWidth * groupCount;
    const categoryWidth = totalBarWidth + settings.barSpacing;
    
    // Calculate minimum required width
    const contentWidth = categoryCount * categoryWidth;
    const minRequiredWidth = contentWidth + 60 + 40; // left margin + right margin
    
    // Use the larger of base width or required width
    const calculatedWidth = Math.max(900, minRequiredWidth);

    return {
      width: calculatedWidth,
      height: baseHeight,
      margin: {
        top: 40,
        right: 40,
        bottom: dynamicBottomMargin,
        left: 60
      }
    };
  }, [data, settings.categoryLabelRotation, settings.barWidth, settings.barSpacing, baseHeight]);
};