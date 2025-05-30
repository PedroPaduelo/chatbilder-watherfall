import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, Info, AlertCircle, CheckCircle2, X } from 'lucide-react';
import type { ChartType, DataRow, SankeyData } from '../types';
import { TemplateService } from '../services/templateService';
import Papa from 'papaparse';

interface UniversalImporterProps {
  chartType: ChartType;
  onDataImported: (data: DataRow[] | SankeyData) => void;
  onClose?: () => void;
  className?: string;
}

const UniversalImporter: React.FC<UniversalImporterProps> = ({
  chartType,
  onDataImported,
  onClose,
  className = ''
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const template = TemplateService.getTemplate(chartType);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
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
    setImporting(true);
    setValidationResult(null);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (chartType === 'sankey' && fileExtension !== 'json') {
        throw new Error('Diagrama Sankey requer arquivo JSON');
      }

      let parsedData: any;

      if (fileExtension === 'json') {
        const text = await file.text();
        parsedData = JSON.parse(text);
      } else if (fileExtension === 'csv') {
        const text = await file.text();
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transform: (value, field) => {
            // Convert numeric fields
            if (['value', 'segment_valor'].includes(field)) {
              return parseFloat(value) || 0;
            }
            // Convert boolean fields
            if (field === 'isSubtotal') {
              return value.toLowerCase() === 'true';
            }
            return value;
          }
        });

        if (result.errors.length > 0) {
          throw new Error(`Erro no CSV: ${result.errors[0].message}`);
        }

        // Transform CSV data to proper format
        parsedData = transformCSVData(result.data, chartType);
      } else {
        throw new Error('Formato de arquivo não suportado. Use CSV ou JSON.');
      }

      // Validate data
      const validation = TemplateService.validateImportedData(chartType, parsedData);
      setValidationResult(validation);

      if (validation.valid) {
        onDataImported(parsedData);
        if (onClose) {
          setTimeout(onClose, 1500); // Close after showing success
        }
      }
    } catch (error) {
      setValidationResult({
        valid: false,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido']
      });
    } finally {
      setImporting(false);
    }
  };

  const transformCSVData = (csvData: any[], chartType: ChartType): DataRow[] => {
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
  };

  const downloadTemplate = (format: 'csv' | 'json' = 'csv') => {
    TemplateService.downloadTemplate(chartType, format);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Upload size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Importar Dados - {template.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {template.description}
            </p>
          </div>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Template Download */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={16} className="text-gray-600 dark:text-gray-400" />
          <h4 className="font-medium text-gray-900 dark:text-white">
            Downloads de Template
          </h4>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {chartType !== 'sankey' && (
            <button
              onClick={() => downloadTemplate('csv')}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Download size={14} />
              Template CSV
            </button>
          )}
          
          <button
            onClick={() => downloadTemplate('json')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            <Download size={14} />
            Template JSON
          </button>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          Baixe o template para ver a estrutura esperada dos dados
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Info size={16} className="text-amber-600 dark:text-amber-400" />
          <h4 className="font-medium text-amber-900 dark:text-amber-100">
            Instruções de Formatação
          </h4>
        </div>
        
        <ul className="space-y-1 text-sm text-amber-800 dark:text-amber-200">
          {template.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-amber-600 dark:text-amber-400 mt-0.5">•</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* File Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${importing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={chartType === 'sankey' ? '.json' : '.csv,.json'}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-3">
          <div className={`
            p-3 rounded-full
            ${dragActive 
              ? 'bg-blue-100 dark:bg-blue-900/40' 
              : 'bg-gray-100 dark:bg-gray-700'
            }
          `}>
            <Upload size={24} className={`
              ${dragActive 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400'
              }
            `} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {importing ? 'Processando arquivo...' : 'Arraste seu arquivo aqui'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ou clique para selecionar • Formatos: {chartType === 'sankey' ? 'JSON' : 'CSV, JSON'}
            </p>
          </div>
        </div>
      </div>

      {/* Validation Results */}
      {validationResult && (
        <div className={`
          mt-4 p-4 rounded-lg border
          ${validationResult.valid 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }
        `}>
          <div className="flex items-center gap-2 mb-2">
            {validationResult.valid ? (
              <>
                <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Dados importados com sucesso!
                </h4>
              </>
            ) : (
              <>
                <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Erro na validação dos dados
                </h4>
              </>
            )}
          </div>
          
          {!validationResult.valid && (
            <ul className="space-y-1 text-sm text-red-800 dark:text-red-200">
              {validationResult.errors.map((error, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UniversalImporter;