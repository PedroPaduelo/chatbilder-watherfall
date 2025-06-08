import React from 'react';
import Modal from '../ui/Modal';
import NewSettingsPanel from './NewSettingsPanel';
import type { ChartSettings, ChartType } from '../../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
  chartType: ChartType;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
  chartType
}) => {
  const getChartTypeName = (type: ChartType): string => {
    const names = {
      waterfall: 'Waterfall',
      sankey: 'Sankey',
      'stacked-bar': 'Stacked Bar',
      line: 'Line Chart',
      area: 'Area Chart'
    };
    return names[type] || type;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configurações - ${getChartTypeName(chartType)}`}
      maxWidth="4xl"
    >
      <NewSettingsPanel 
        settings={settings} 
        onSettingsChange={onSettingsChange}
        chartType={chartType}
      />
    </Modal>
  );
};

export default ConfigModal;