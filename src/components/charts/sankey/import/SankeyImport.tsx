import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { SankeyData, SankeyNode, SankeyLink } from '../types';
import { processRawSankeyData } from '../utils';

interface SankeyImportProps {
  onDataImport: (data: SankeyData) => void;
  onError: (error: string) => void;
}

const SankeyImport: React.FC<SankeyImportProps> = ({ onDataImport, onError }) => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Formato esperado dos dados
  const expectedFormat = {
    nodes: [
      { id: 'A', name: 'Fonte A', value: 100 },
      { id: 'B', name: 'Destino B', value: 60 },
    ],
    links: [
      { source: 'A', target: 'B', value: 60 },
    ]
  };

  // Dados de exemplo
  const sampleData: SankeyData = {
    nodes: [
      { id: 'energy_source', name: 'Fontes de Energia', value: 1000 },
      { id: 'coal', name: 'Carvão', value: 400 },
      { id: 'natural_gas', name: 'Gás Natural', value: 300 },
      { id: 'renewable', name: 'Renováveis', value: 300 },
      { id: 'electricity', name: 'Eletricidade', value: 900 },
      { id: 'heat', name: 'Aquecimento', value: 100 },
      { id: 'residential', name: 'Residencial', value: 400 },
      { id: 'commercial', name: 'Comercial', value: 300 },
      { id: 'industrial', name: 'Industrial', value: 300 }
    ],
    links: [
      { source: 'energy_source', target: 'coal', value: 400 },
      { source: 'energy_source', target: 'natural_gas', value: 300 },
      { source: 'energy_source', target: 'renewable', value: 300 },
      { source: 'coal', target: 'electricity', value: 350 },
      { source: 'coal', target: 'heat', value: 50 },
      { source: 'natural_gas', target: 'electricity', value: 250 },
      { source: 'natural_gas', target: 'heat', value: 50 },
      { source: 'renewable', target: 'electricity', value: 300 },
      { source: 'electricity', target: 'residential', value: 300 },
      { source: 'electricity', target: 'commercial', value: 300 },
      { source: 'electricity', target: 'industrial', value: 300 },
      { source: 'heat', target: 'residential', value: 100 }
    ]
  };

  // Processar arquivo carregado
  const processFile = async (file: File) => {
    setImporting(true);
    setValidationResult(null);

    try {
      const text = await file.text();
      let data: any;

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        // Para CSV, assumimos formato específico
        data = parseCSVToSankeyData(text);
      } else {
        throw new Error('Formato de arquivo não suportado. Use JSON ou CSV.');
      }

      const { data: processedData, validation } = processRawSankeyData(data);
      
      setValidationResult(validation);

      if (validation.isValid) {
        onDataImport(processedData);
      } else {
        onError(`Dados inválidos: ${validation.errors.join(', ')}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao processar arquivo';
      onError(errorMessage);
      setValidationResult({
        isValid: false,
        errors: [errorMessage],
        warnings: []
      });
    } finally {
      setImporting(false);
    }
  };

  // Converter CSV para formato Sankey
  const parseCSVToSankeyData = (csvText: string): SankeyData => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const nodes: SankeyNode[] = [];
    const links: SankeyLink[] = [];
    const nodeSet = new Set<string>();

    // Assumir formato: source,target,value
    for (let i = 1; i < lines.length; i++) { // Pular cabeçalho
      const [source, target, value] = lines[i].split(',').map(s => s.trim());
      
      if (source && target && value) {
        nodeSet.add(source);
        nodeSet.add(target);
        
        links.push({
          source,
          target,
          value: parseFloat(value) || 0
        });
      }
    }

    // Criar nós únicos
    nodeSet.forEach(nodeId => {
      nodes.push({
        id: nodeId,
        name: nodeId,
        value: 0 // Será calculado automaticamente
      });
    });

    return { nodes, links };
  };

  // Manipuladores de eventos de drag
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  // Carregar dados de exemplo
  const loadSampleData = () => {
    const { data: processedData, validation } = processRawSankeyData(sampleData);
    setValidationResult(validation);
    if (validation.isValid) {
      onDataImport(processedData);
    }
  };

  // Baixar template
  const downloadTemplate = () => {
    const template = {
      nodes: [
        { id: 'node1', name: 'Nó 1', value: 100 },
        { id: 'node2', name: 'Nó 2', value: 80 },
        { id: 'node3', name: 'Nó 3', value: 60 }
      ],
      links: [
        { source: 'node1', target: 'node2', value: 80 },
        { source: 'node2', target: 'node3', value: 60 }
      ]
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sankey-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Área de Upload */}
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
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Importar Dados do Sankey
        </h3>
        <p className="text-gray-600 mb-4">
          Arraste e solte um arquivo JSON ou CSV aqui, ou clique para selecionar
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {importing ? 'Importando...' : 'Selecionar Arquivo'}
        </button>
      </div>

      {/* Resultado da Validação */}
      {validationResult && (
        <div className={`p-4 rounded-lg border ${
          validationResult.isValid 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            {validationResult.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
            )}
            <div className="flex-1">
              <h4 className={`font-medium ${
                validationResult.isValid ? 'text-green-800' : 'text-red-800'
              }`}>
                {validationResult.isValid ? 'Dados Válidos!' : 'Dados Inválidos'}
              </h4>
              
              {validationResult.errors.length > 0 && (
                <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                  {validationResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              )}
              
              {validationResult.warnings.length > 0 && (
                <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={loadSampleData}
          className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileText className="h-5 w-5 mr-2" />
          Carregar Dados de Exemplo
        </button>
        
        <button
          onClick={downloadTemplate}
          className="flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Baixar Template
        </button>
      </div>

      {/* Formato Esperado */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Formato Esperado (JSON):</h4>
        <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
          {JSON.stringify(expectedFormat, null, 2)}
        </pre>
        
        <div className="mt-3 text-sm text-gray-600">
          <p className="mb-2"><strong>Para CSV:</strong> Use o formato: source,target,value</p>
          <p><strong>Exemplo:</strong></p>
          <pre className="text-xs bg-white p-2 rounded border mt-1">
{`source,target,value
A,B,50
B,C,30
A,C,20`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SankeyImport;