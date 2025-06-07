import type React from 'react';
import { useState, useRef } from 'react';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import Papa from 'papaparse';
import type { DataRow } from '../../types';

interface CSVImporterProps {
  open: boolean;
  onDataImported: (data: DataRow[]) => void;
  onClose: () => void;
}

interface CSVRow {
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

const CSVImporter: React.FC<CSVImporterProps> = ({ onDataImported, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [parseResult, setParseResult] = useState<DataRow[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = `category,value,type,color,group,isSubtotal
Initial Value,100,baseline,#4B5563,,false
Revenue Growth,25,increase,#10B981,,false
Cost Reduction,15,increase,#10B981,,false
Quarterly Subtotal,140,subtotal,#3B82F6,,true
Market Decline,-20,decrease,#EF4444,,false
Final Total,120,total,#6366F1,,false`;

    const blob = new Blob([template], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = 'waterfall-template.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const downloadSegmentTemplate = () => {
    const template = `category,value,type,color,segments
Initial Value,100,baseline,#4B5563,"[{""categoria"":""Product A"",""valor"":60,""cor"":""#4B5563""},{""categoria"":""Product B"",""valor"":40,""cor"":""#6B7280""}]"
Revenue Growth,25,increase,#10B981,
Cost Reduction,15,increase,#10B981,
Final Total,140,total,#6366F1,"[{""categoria"":""Total A"",""valor"":85,""cor"":""#6366F1""},{""categoria"":""Total B"",""valor"":55,""cor"":""#8B5CF6""}]"`;

    const blob = new Blob([template], { type: 'text/csv' });
    const link = document.createElement('a');
    link.download = 'waterfall-stacked-template.csv';
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  const validateData = (data: CSVRow[]): { valid: DataRow[], errors: string[] } => {
    const validData: DataRow[] = [];
    const validationErrors: string[] = [];

    data.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because of header and 0-based index
      
      // Check category
      const category = row.category || row.Category;
      if (!category || category.trim() === '') {
        validationErrors.push(`Row ${rowNumber}: Category is required`);
        return;
      }

      // Check value
      const valueStr = row.value || row.Value;
      const value = typeof valueStr === 'number' ? valueStr : parseFloat(String(valueStr || 0));
      if (isNaN(value)) {
        validationErrors.push(`Row ${rowNumber}: Invalid value "${valueStr}"`);
        return;
      }

      // Check type
      const type = (row.type || row.Type || 'increase') as DataRow['type'];
      const validTypes = ['baseline', 'increase', 'decrease', 'subtotal', 'total'];
      if (!validTypes.includes(type)) {
        validationErrors.push(`Row ${rowNumber}: Invalid type "${type}". Must be one of: ${validTypes.join(', ')}`);
        return;
      }

      // Parse segments if present
      let segments;
      if (row.segments) {
        try {
          segments = JSON.parse(row.segments);
          if (!Array.isArray(segments)) {
            validationErrors.push(`Row ${rowNumber}: Segments must be a JSON array`);
            return;
          }
        } catch (e) {
          validationErrors.push(`Row ${rowNumber}: Invalid JSON in segments column`);
          return;
        }
      }

      validData.push({
        id: (index + 1).toString(),
        category: category.trim(),
        value,
        type,
        color: row.color || row.Color,
        group: row.group || row.Group,
        isSubtotal: row.isSubtotal === true || row.Subtotal === true,
        segments
      });
    });

    return { valid: validData, errors: validationErrors };
  };

  const handleFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: false, // Keep as strings for better validation
      skipEmptyLines: true,
      complete: (results) => {
        const { valid, errors: validationErrors } = validateData(results.data as CSVRow[]);
        setParseResult(valid);
        setErrors(validationErrors);
      },
      error: (error) => {
        setErrors([`CSV parsing error: ${error.message}`]);
        setParseResult(null);
      }
    });
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

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
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === 'text/csv') {
      handleFile(files[0]);
    } else {
      setErrors(['Please drop a valid CSV file']);
    }
  };

  const handleImport = () => {
    if (parseResult) {
      onDataImported(parseResult);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Import CSV Data</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          {/* Templates Section */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-3">Download Templates</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                <Download size={16} />
                Basic Template
              </button>
              <button
                onClick={downloadSegmentTemplate}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                <Download size={16} />
                Stacked Bars Template
              </button>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              Download a template to see the expected CSV format for waterfall charts.
            </p>
          </div>

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-lg mb-2">Drop your CSV file here</p>
            <p className="text-gray-500 mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Choose File
            </button>
          </div>

          {/* Format Information */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Expected CSV Format:</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>category</strong>: Name of the bar (required)</p>
              <p><strong>value</strong>: Numeric value (required)</p>
              <p><strong>type</strong>: baseline, increase, decrease, subtotal, or total</p>
              <p><strong>color</strong>: Hex color code (optional)</p>
              <p><strong>group</strong>: Group name for grouped bars (optional)</p>
              <p><strong>isSubtotal</strong>: true/false for subtotal bars (optional)</p>
              <p><strong>segments</strong>: JSON array for stacked segments (optional)</p>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={20} className="text-red-600" />
                <h4 className="font-medium text-red-800">Validation Errors:</h4>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {parseResult && parseResult.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-medium text-green-800">
                  Preview ({parseResult.length} rows)
                </h4>
              </div>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-1">Category</th>
                      <th className="text-left p-1">Value</th>
                      <th className="text-left p-1">Type</th>
                      <th className="text-left p-1">Color</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parseResult.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b border-gray-200">
                        <td className="p-1">{row.category}</td>
                        <td className="p-1">{row.value}</td>
                        <td className="p-1">{row.type}</td>
                        <td className="p-1">
                          {row.color && (
                            <div className="flex items-center gap-1">
                              <div 
                                className="w-4 h-4 rounded border" 
                                style={{ backgroundColor: row.color }}
                              />
                              {row.color}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parseResult.length > 5 && (
                  <p className="text-xs text-gray-500 mt-2">
                    ... and {parseResult.length - 5} more rows
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={!parseResult || parseResult.length === 0 || errors.length > 0}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Import Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSVImporter;