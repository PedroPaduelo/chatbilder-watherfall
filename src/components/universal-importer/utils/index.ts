import Papa from 'papaparse';
import type { ChartType, DataRow } from '../../../types';
import { TemplateService } from '../../../services/templateService';
import type { ValidationResult } from '../types';

export class FileProcessor {
  static async processFile(
    file: File, 
    chartType: ChartType
  ): Promise<{ data: any; validation: ValidationResult }> {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (chartType === 'sankey' && fileExtension !== 'json') {
      throw new Error('Diagrama Sankey requer arquivo JSON');
    }

    let parsedData: any;

    if (fileExtension === 'json') {
      parsedData = await this.processJSONFile(file);
    } else if (fileExtension === 'csv') {
      parsedData = await this.processCSVFile(file, chartType);
    } else {
      throw new Error('Formato de arquivo não suportado. Use CSV ou JSON.');
    }

    const validation = TemplateService.validateImportedData(chartType, parsedData);
    
    return { data: parsedData, validation };
  }

  private static async processJSONFile(file: File): Promise<any> {
    const text = await file.text();
    return JSON.parse(text);
  }

  private static async processCSVFile(file: File, chartType: ChartType): Promise<DataRow[]> {
    const text = await file.text();
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      transform: (value, field) => {
        // Convert numeric fields
        if (['value', 'segment_valor'].includes(String(field))) {
          return parseFloat(String(value)) || 0;
        }
        // Convert boolean fields
        if (String(field) === 'isSubtotal') {
          return String(value).toLowerCase() === 'true';
        }
        return String(value);
      }
    });

    if (result.errors.length > 0) {
      throw new Error(`Erro no CSV: ${result.errors[0].message}`);
    }

    return this.transformCSVData(result.data, chartType);
  }

  private static transformCSVData(csvData: any[], chartType: ChartType): DataRow[] {
    if (chartType === 'stacked-bar' || chartType === 'area') {
      // Group by id and category to create stacked segments
      const grouped = csvData.reduce((acc: any, row: any) => {
        const key = `${row.id}-${row.category}`;
        if (!acc[key]) {
          acc[key] = {
            id: row.id,
            category: row.category,
            value: row.value || 0,
            type: row.type,
            color: row.color,
            segments: []
          };
        }
        
        if (row.segment_categoria && row.segment_valor) {
          acc[key].segments.push({
            categoria: row.segment_categoria,
            valor: row.segment_valor,
            cor: row.segment_cor || '#3b82f6'
          });
        }
        
        return acc;
      }, {});
      
      return Object.values(grouped);
    }
    
    // For other chart types, return as-is
    return csvData;
  }
}

export class TemplateDownloader {
  static download(chartType: ChartType, format: 'csv' | 'json' = 'csv'): void {
    TemplateService.downloadTemplate(chartType, format);
  }
}

export const generateTemplate = (chartType: ChartType, format: 'csv' | 'json' = 'csv'): string => {
  return TemplateService.generateTemplate(chartType, format);
};