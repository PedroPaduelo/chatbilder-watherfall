import { useCallback } from 'react';
import type { DataRow, ChartSettings, StackedSegment } from '../types';
import { VALIDATION } from '../utils/constants';
import { FileService } from '../services/fileService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useValidation = () => {
  
  const validateDataRow = useCallback((row: DataRow): ValidationResult => {
    const errors: string[] = [];
    
    if (!row.category || row.category.trim().length === 0) {
      errors.push('Category is required');
    }
    
    if (typeof row.value !== 'number' || isNaN(row.value)) {
      errors.push('Value must be a valid number');
    }
    
    if (!['baseline', 'increase', 'decrease', 'subtotal', 'total'].includes(row.type)) {
      errors.push('Invalid data type');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateSegment = useCallback((segment: StackedSegment): ValidationResult => {
    const errors: string[] = [];
    
    if (!segment.categoria || segment.categoria.trim().length === 0) {
      errors.push('Segment category is required');
    }
    
    if (typeof segment.valor !== 'number' || isNaN(segment.valor) || segment.valor < 0) {
      errors.push('Segment value must be a positive number');
    }
    
    if (!segment.cor || !/^#[0-9A-F]{6}$/i.test(segment.cor)) {
      errors.push('Invalid color format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateChartSettings = useCallback((settings: ChartSettings): ValidationResult => {
    const errors: string[] = [];
    
    if (settings.barWidth < VALIDATION.MIN_BAR_WIDTH || settings.barWidth > VALIDATION.MAX_BAR_WIDTH) {
      errors.push(`Bar width must be between ${VALIDATION.MIN_BAR_WIDTH} and ${VALIDATION.MAX_BAR_WIDTH}`);
    }
    
    if (settings.barSpacing < VALIDATION.MIN_BAR_SPACING || settings.barSpacing > VALIDATION.MAX_BAR_SPACING) {
      errors.push(`Bar spacing must be between ${VALIDATION.MIN_BAR_SPACING} and ${VALIDATION.MAX_BAR_SPACING}`);
    }
    
    if (settings.borderRadius < VALIDATION.MIN_BORDER_RADIUS || settings.borderRadius > VALIDATION.MAX_BORDER_RADIUS) {
      errors.push(`Border radius must be between ${VALIDATION.MIN_BORDER_RADIUS} and ${VALIDATION.MAX_BORDER_RADIUS}`);
    }
    
    if (settings.labelSettings) {
      const { categoryFontSize, valueFontSize, segmentLabelFontSize } = settings.labelSettings;
      
      if (categoryFontSize < VALIDATION.MIN_FONT_SIZE || categoryFontSize > VALIDATION.MAX_FONT_SIZE) {
        errors.push(`Category font size must be between ${VALIDATION.MIN_FONT_SIZE} and ${VALIDATION.MAX_FONT_SIZE}`);
      }
      
      if (valueFontSize < VALIDATION.MIN_FONT_SIZE || valueFontSize > VALIDATION.MAX_FONT_SIZE) {
        errors.push(`Value font size must be between ${VALIDATION.MIN_FONT_SIZE} and ${VALIDATION.MAX_FONT_SIZE}`);
      }
      
      if (segmentLabelFontSize < VALIDATION.MIN_FONT_SIZE || segmentLabelFontSize > VALIDATION.MAX_FONT_SIZE) {
        errors.push(`Segment label font size must be between ${VALIDATION.MIN_FONT_SIZE} and ${VALIDATION.MAX_FONT_SIZE}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateFile = useCallback((file: File): ValidationResult => {
    const errors: string[] = [];
    
    if (!FileService.isSupportedFileType(file.name)) {
      errors.push('Unsupported file type. Please use CSV, XLSX, or XLS files.');
    }
    
    if (!FileService.validateFileSize(file)) {
      errors.push('File size must be less than 10MB');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  const validateDataArray = useCallback((data: DataRow[]): ValidationResult => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('At least one data row is required');
    }
    
    // Check for duplicate IDs
    const ids = data.map(row => row.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      errors.push(`Duplicate IDs found: ${duplicateIds.join(', ')}`);
    }
    
    // Validate each row
    data.forEach((row, index) => {
      const rowValidation = validateDataRow(row);
      if (!rowValidation.isValid) {
        errors.push(`Row ${index + 1}: ${rowValidation.errors.join(', ')}`);
      }
      
      // Validate segments if present
      if (row.segments) {
        row.segments.forEach((segment, segIndex) => {
          const segmentValidation = validateSegment(segment);
          if (!segmentValidation.isValid) {
            errors.push(`Row ${index + 1}, Segment ${segIndex + 1}: ${segmentValidation.errors.join(', ')}`);
          }
        });
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [validateDataRow, validateSegment]);

  return {
    validateDataRow,
    validateSegment,
    validateChartSettings,
    validateFile,
    validateDataArray
  };
};