import { useCallback } from 'react';
import { FileService } from '../services/fileService';
import { ExportService } from '../services/exportService';
import { useValidation } from './useValidation';
import type { DataRow, ChartSettings } from '../types';

export interface UseFileOperationsProps {
  data: DataRow[];
  settings: ChartSettings;
  onDataChange: (data: DataRow[]) => void;
  chartRef: React.RefObject<HTMLDivElement>;
}

export const useFileOperations = ({
  data,
  settings,
  onDataChange,
  chartRef
}: UseFileOperationsProps) => {
  
  const { validateFile, validateDataArray, validateChartSettings } = useValidation();

  const handleFileUpload = useCallback(async (file: File) => {
    // Validate file first
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      throw new Error(fileValidation.errors.join(', '));
    }

    const fileType = FileService.getFileType(file.name);
    
    if (fileType === 'csv') {
      return { shouldOpenCSVImporter: true };
    }

    if (fileType === 'excel') {
      try {
        const parsedData = await FileService.parseExcelFile(file);
        
        // Validate parsed data
        const dataValidation = validateDataArray(parsedData);
        if (!dataValidation.isValid) {
          throw new Error(`Data validation failed: ${dataValidation.errors.join(', ')}`);
        }
        
        onDataChange(parsedData);
        return { success: true, rowCount: parsedData.length };
      } catch (error) {
        throw new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    throw new Error('Unsupported file type');
  }, [onDataChange, validateFile, validateDataArray]);

  const exportAsPNG = useCallback(async () => {
    if (!chartRef.current) {
      throw new Error('Chart reference not available');
    }
    
    // Validate settings before export
    const settingsValidation = validateChartSettings(settings);
    if (!settingsValidation.isValid) {
      throw new Error(`Settings validation failed: ${settingsValidation.errors.join(', ')}`);
    }
    
    try {
      await ExportService.exportAsPNG(chartRef.current);
    } catch (error) {
      throw new Error(`Failed to export PNG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [chartRef, settings, validateChartSettings]);

  const exportAsSVG = useCallback(() => {
    if (!chartRef.current) {
      throw new Error('Chart reference not available');
    }
    
    try {
      ExportService.exportAsSVG(chartRef.current);
    } catch (error) {
      throw new Error(`Failed to export SVG: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [chartRef]);

  const exportAsJSON = useCallback(() => {
    // Validate data before export
    const dataValidation = validateDataArray(data);
    if (!dataValidation.isValid) {
      throw new Error(`Data validation failed: ${dataValidation.errors.join(', ')}`);
    }
    
    try {
      ExportService.exportAsJSON(data, settings);
    } catch (error) {
      throw new Error(`Failed to export JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [data, settings, validateDataArray]);

  const exportAsHTML = useCallback(() => {
    if (!chartRef.current) {
      throw new Error('Chart reference not available');
    }
    
    try {
      ExportService.exportAsHTML(chartRef.current);
    } catch (error) {
      throw new Error(`Failed to export HTML: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [chartRef]);

  return {
    handleFileUpload,
    exportAsPNG,
    exportAsSVG,
    exportAsJSON,
    exportAsHTML
  };
};