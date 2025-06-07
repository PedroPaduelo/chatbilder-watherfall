import type { ChartType, DataRow, SankeyData } from '../../../../types';

export interface UniversalImporterProps {
  chartType: ChartType;
  onDataImported: (data: DataRow[] | SankeyData) => void;
  onClose?: () => void;
  className?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface FileProcessingState {
  dragActive: boolean;
  importing: boolean;
  validationResult: ValidationResult | null;
}

export interface FileProcessorConfig {
  chartType: ChartType;
  onValidationComplete: (result: ValidationResult) => void;
  onDataProcessed: (data: DataRow[] | SankeyData) => void;
}

export interface TemplateDownloadOptions {
  chartType: ChartType;
  format: 'csv' | 'json';
}

export interface ImportedData {
  headers: string[];
  rows: any[][];
  filename: string;
  fileType: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImporterProps {
  onDataImported: (data: ImportedData) => void;
  acceptedTypes?: string[];
  maxFileSize?: number;
  className?: string;
}

export interface FileProcessorOptions {
  delimiter?: string;
  encoding?: string;
  skipEmptyLines?: boolean;
  headers?: boolean;
}

export interface ImportState {
  isProcessing: boolean;
  error: string | null;
  progress: number;
  currentFile: File | null;
}

export type SupportedFileType = 'csv' | 'xlsx' | 'xls' | 'json' | 'tsv';