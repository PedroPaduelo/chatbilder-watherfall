import React from 'react';
import type { ChartType, DataRow, SankeyData } from '../../../../types';
import { useFileUpload } from '../hooks';
import { TemplateDownloadSection } from './TemplateDownloadSection';
import { FileDropZone } from './FileDropZone';
import { ValidationResultDisplay } from './ValidationResultDisplay';

interface UniversalImporterProps {
  chartType: ChartType;
  isOpen: boolean;
  onClose: () => void;
  onDataImported: (data: DataRow[] | SankeyData) => void;
  title?: string;
}

export const UniversalImporter: React.FC<UniversalImporterProps> = ({
  chartType,
  isOpen,
  onClose,
  onDataImported,
  title = 'Importar Dados'
}) => {
  const { state, fileInputRef, handlers } = useFileUpload(
    chartType,
    onDataImported,
    onClose
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
          </div>

          <TemplateDownloadSection chartType={chartType} />

          <FileDropZone
            dragActive={state.dragActive}
            importing={state.importing}
            onDragEnter={handlers.handleDrag}
            onDragLeave={handlers.handleDrag}
            onDragOver={handlers.handleDrag}
            onDrop={handlers.handleDrop}
            onClick={handlers.triggerFileSelect}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handlers.handleFileSelect}
            className="hidden"
          />

          {state.validationResult && (
            <ValidationResultDisplay validationResult={state.validationResult} />
          )}
        </div>
      </div>
    </div>
  );
};