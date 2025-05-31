import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface FileDropZoneProps {
  dragActive: boolean;
  importing: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  dragActive,
  importing,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick
}) => {
  return (
    <div
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
        ${dragActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
        }
        ${importing ? 'pointer-events-none opacity-50' : ''}
      `}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      {importing ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={48} className="text-blue-500 animate-spin" />
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              Processando arquivo...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aguarde enquanto validamos os dados
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
            <Upload size={32} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {dragActive ? 'Solte o arquivo aqui' : 'Arraste um arquivo ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Formatos suportados: CSV, JSON
            </p>
          </div>
        </div>
      )}
    </div>
  );
};