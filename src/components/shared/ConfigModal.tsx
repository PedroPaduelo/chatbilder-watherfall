import React from 'react';
import Modal from '../ui/Modal';
import SettingsPanel from './SettingsPanel';
import type { ChartSettings } from '../../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ChartSettings;
  onSettingsChange: (settings: ChartSettings) => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurações do Gráfico"
      maxWidth="4xl"
    >
      <SettingsPanel 
        settings={settings} 
        onSettingsChange={onSettingsChange} 
      />
    </Modal>
  );
};

export default ConfigModal;