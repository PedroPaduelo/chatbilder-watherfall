import { useState, useRef } from 'react';
import type { ChartType, DataRow, SankeyData } from '../../../../types';
import type { FileProcessingState } from '../types';
import { FileProcessor } from '../utils';

export function useFileUpload(
  chartType: ChartType,
  onDataImported: (data: DataRow[] | SankeyData) => void,
  onClose?: () => void
) {
  const [state, setState] = useState<FileProcessingState>({
    dragActive: false,
    importing: false,
    validationResult: null
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setState(prev => ({
      ...prev,
      dragActive: e.type === "dragenter" || e.type === "dragover"
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, dragActive: false }));
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setState(prev => ({
      ...prev,
      importing: true,
      validationResult: null
    }));

    try {
      const { data, validation } = await FileProcessor.processFile(file, chartType);
      
      setState(prev => ({
        ...prev,
        validationResult: validation
      }));

      if (validation.valid) {
        onDataImported(data);
        if (onClose) {
          setTimeout(onClose, 1500); // Close after showing success
        }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        validationResult: {
          valid: false,
          errors: [error instanceof Error ? error.message : 'Erro desconhecido']
        }
      }));
    } finally {
      setState(prev => ({ ...prev, importing: false }));
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return {
    state,
    fileInputRef,
    handlers: {
      handleDrag,
      handleDrop,
      handleFileSelect,
      triggerFileSelect
    }
  };
}