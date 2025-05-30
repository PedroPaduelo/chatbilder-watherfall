import React from 'react';
import UniversalImporter from './UniversalImporter';
import { ChartData, ChartSettings } from '../types';
import { DEFAULT_CHART_SETTINGS } from '../utils/constants';

interface StackedBarChartImportProps {
  onImport: (data: ChartData[], settings: ChartSettings) => void;
}

export default function StackedBarChartImport({ onImport }: StackedBarChartImportProps) {
  const handleImport = (data: ChartData[], settings: ChartSettings) => {
    onImport(data, settings);
  };

  return (
    <UniversalImporter
      onImport={handleImport}
      chartType="stackedBar"
      defaultSettings={DEFAULT_CHART_SETTINGS}
    />
  );
}