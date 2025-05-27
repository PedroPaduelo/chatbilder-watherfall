import { useMemo } from 'react';
import type { DataRow, ChartSettings, ChartDimensions } from '../types';
import { calculateBottomMarginForRotation, getMaxCategoryLength } from '../utils/helpers';

/**
 * Custom hook to calculate chart dimensions based on settings and data
 * Automatically adjusts margins for rotated category labels
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

    return {
      width: 900,
      height: baseHeight,
      margin: {
        top: 40,
        right: 40,
        bottom: dynamicBottomMargin,
        left: 60
      }
    };
  }, [data, settings.categoryLabelRotation, baseHeight]);
};