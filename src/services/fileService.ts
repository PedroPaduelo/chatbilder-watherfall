import * as XLSX from 'xlsx';
import type { DataRow } from '../types';
import { UI_CONSTANTS } from '../utils/constants';

export interface CSVRow {
  category?: string;
  Category?: string;
  value?: string | number;
  Value?: string | number;
  type?: string;
  Type?: string;
  color?: string;
  Color?: string;
  group?: string;
  Group?: string;
  isSubtotal?: boolean;
  Subtotal?: boolean;
  segments?: string;
}

export class FileService {
  /**
   * Parse Excel file and convert to DataRow array
   */
  static parseExcelFile(file: File): Promise<DataRow[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as CSVRow[];
          
          const parsedData = this.transformCSVToDataRow(jsonData);
          resolve(parsedData);
        } catch (error) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  }

  /**
   * Transform CSV data to DataRow format
   */
  static transformCSVToDataRow(csvData: CSVRow[]): DataRow[] {
    return csvData.map((row, index) => ({
      id: (index + 1).toString(),
      category: row.category || row.Category || `Row ${index + 1}`,
      value: Number.parseFloat(String(row.value || row.Value || 0)),
      type: (row.type || row.Type || 'increase') as DataRow['type'],
      color: row.color || row.Color,
      group: row.group || row.Group,
      isSubtotal: row.isSubtotal === true || row.Subtotal === true,
      segments: row.segments ? JSON.parse(row.segments) : undefined
    }));
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Validate if file type is supported
   */
  static isSupportedFileType(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return false;
    
    return UI_CONSTANTS.FILES.SUPPORTED_EXTENSIONS.includes(extension as 'csv' | 'xlsx' | 'xls');
  }

  /**
   * Validate file size (max 10MB)
   */
  static validateFileSize(file: File, maxSizeMB = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Get file type from extension
   */
  static getFileType(filename: string): 'csv' | 'excel' | 'unknown' {
    const extension = this.getFileExtension(filename);
    if (extension === 'csv') return 'csv';
    if (['xlsx', 'xls'].includes(extension)) return 'excel';
    return 'unknown';
  }
}