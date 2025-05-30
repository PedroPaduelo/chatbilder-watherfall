import UniversalImporter from './UniversalImporter';
import { DataRow, SankeyData, ChartSettings } from '../types';
import { defaultSettings } from '../utils/constants';

interface LineChartImportProps {
  onImport: (data: DataRow[], settings: ChartSettings) => void;
  onClose?: () => void;
}

export default function LineChartImport({ onImport, onClose }: LineChartImportProps) {
  const handleImport = (data: DataRow[] | SankeyData) => {
    // For line charts, we expect DataRow[]
    onImport(data as DataRow[], defaultSettings);
  };

  return (
    <UniversalImporter
      chartType="line"
      onDataImported={handleImport}
      onClose={onClose}
    />
  );
}