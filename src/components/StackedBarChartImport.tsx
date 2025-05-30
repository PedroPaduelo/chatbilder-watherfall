import UniversalImporter from './UniversalImporter';
import { DataRow, SankeyData, ChartSettings } from '../types';
import { defaultSettings } from '../utils/constants';

interface StackedBarChartImportProps {
  onImport: (data: DataRow[], settings: ChartSettings) => void;
  onClose?: () => void;
}

export default function StackedBarChartImport({ onImport, onClose }: StackedBarChartImportProps) {
  const handleImport = (data: DataRow[] | SankeyData) => {
    // For stacked bar charts, we expect DataRow[]
    onImport(data as DataRow[], defaultSettings);
  };

  return (
    <UniversalImporter
      chartType="stacked-bar"
      onDataImported={handleImport}
      onClose={onClose}
    />
  );
}