import React from 'react';
import Modal from '../ui/Modal';
import ChartTypeSelector from '../charts/ChartTypeSelector';
import type { ChartType } from '../../types';

interface ChartTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedType: ChartType;
  onTypeChange: (type: ChartType) => void;
  onLoadSampleData: (type: ChartType) => void;
}

const ChartTypeSelectorModal: React.FC<ChartTypeSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedType,
  onTypeChange,
  onLoadSampleData
}) => {
  const handleTypeChange = (type: ChartType) => {
    onTypeChange(type);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Seleção de Tipo de Gráfico"
      maxWidth="2xl"
    >
      <ChartTypeSelector 
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        onLoadSampleData={(type) => {
          onLoadSampleData(type);
          onClose();
        }}
      />
    </Modal>
  );
};

export default ChartTypeSelectorModal;