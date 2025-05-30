import { useMemo } from 'react';
import type { DataRow } from '../types';

export interface ChartMetrics {
  total: number;
  totalIncrease: number;
  totalDecrease: number;
  netChange: number;
  changePercentage: number;
  categoriesCount: number;
  largestIncrease: { category: string; value: number } | null;
  largestDecrease: { category: string; value: number } | null;
  averageValue: number;
  median: number;
  positiveCount: number;
  negativeCount: number;
  stackedBarsCount: number;
}

export const useChartMetrics = (data: DataRow[]): ChartMetrics => {
  return useMemo(() => {
    if (data.length === 0) {
      return {
        total: 0,
        totalIncrease: 0,
        totalDecrease: 0,
        netChange: 0,
        changePercentage: 0,
        categoriesCount: 0,
        largestIncrease: null,
        largestDecrease: null,
        averageValue: 0,
        median: 0,
        positiveCount: 0,
        negativeCount: 0,
        stackedBarsCount: 0,
      };
    }

    // Calculate basic metrics
    const values = data.map(item => item.value);
    const total = values.reduce((sum, val) => sum + val, 0);
    
    const increases = data.filter(item => item.type === 'increase');
    const decreases = data.filter(item => item.type === 'decrease');
    
    const totalIncrease = increases.reduce((sum, item) => sum + item.value, 0);
    const totalDecrease = Math.abs(decreases.reduce((sum, item) => sum + item.value, 0));
    
    const netChange = totalIncrease - totalDecrease;
    
    // Calculate baseline for percentage
    const baseline = data.find(item => item.type === 'baseline')?.value || 0;
    const changePercentage = baseline !== 0 ? (netChange / baseline) * 100 : 0;
    
    // Find largest changes
    const largestIncrease = increases.length > 0 
      ? increases.reduce((max, item) => item.value > max.value ? item : max)
      : null;
    
    const largestDecrease = decreases.length > 0
      ? decreases.reduce((min, item) => Math.abs(item.value) > Math.abs(min.value) ? item : min)
      : null;
    
    // Calculate statistical measures
    const sortedValues = [...values].sort((a, b) => a - b);
    const median = sortedValues.length % 2 === 0
      ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
      : sortedValues[Math.floor(sortedValues.length / 2)];
    
    const averageValue = total / data.length;
    
    const positiveCount = data.filter(item => item.value > 0).length;
    const negativeCount = data.filter(item => item.value < 0).length;
    
    const stackedBarsCount = data.filter(item => 
      item.segments && item.segments.length > 0
    ).length;

    return {
      total,
      totalIncrease,
      totalDecrease,
      netChange,
      changePercentage,
      categoriesCount: data.length,
      largestIncrease: largestIncrease ? {
        category: largestIncrease.category,
        value: largestIncrease.value
      } : null,
      largestDecrease: largestDecrease ? {
        category: largestDecrease.category,
        value: largestDecrease.value
      } : null,
      averageValue,
      median,
      positiveCount,
      negativeCount,
      stackedBarsCount,
    };
  }, [data]);
};