import React from 'react';
import { Download, FileText, Database } from 'lucide-react';
import { generateSampleWaterfallData } from '../utils';
import { ExportService } from '../../../services/exportService';
import { defaultSettings } from '../../../utils/constants';

interface WaterfallImportProps {
  onDataImported?: (data: any[]) => void;
  className?: string;
}

export const WaterfallImport: React.FC<WaterfallImportProps> = ({
  onDataImported,
  className = ''
}) => {
  const handleDownloadCSV = () => {
    const sampleData = generateSampleWaterfallData();
    const csvData = sampleData.map((row, index) => ({
      id: row.id || `${index + 1}`,
      category: row.category,
      value: row.value,
      type: row.type,
      color: row.color,
      isSubtotal: row.isSubtotal ? 'true' : 'false'
    }));
    ExportService.exportAsCSV(csvData, 'waterfall-sample.csv');
  };

  const handleDownloadJSON = () => {
    const sampleData = generateSampleWaterfallData();
    ExportService.exportAsJSON(sampleData, defaultSettings, 'waterfall-sample.json');
  };

  const handleLoadSampleData = () => {
    const sampleData = generateSampleWaterfallData();
    if (onDataImported) {
      onDataImported(sampleData);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Importar Dados do Waterfall
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Baixe templates ou carregue dados de exemplo para começar
          </p>
        </div>
      </div>

      {/* Sample Data Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          Dados de Exemplo Inclusos
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
          Demonstra um fluxo financeiro completo com receitas, custos e total final.
          Inclui diferentes tipos de barras: baseline, increase, decrease e total.
        </p>
        <button
          onClick={handleLoadSampleData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Database className="w-4 h-4" />
          Carregar Dados de Exemplo
        </button>
      </div>

      {/* Download Templates */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          Templates para Download
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* CSV Template */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900 dark:text-white">Template CSV</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Arquivo CSV com estrutura e dados de exemplo
            </p>
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </button>
          </div>

          {/* JSON Template */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900 dark:text-white">Template JSON</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Arquivo JSON com dados e configurações completas
            </p>
            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm w-full justify-center"
            >
              <Download className="w-4 h-4" />
              Download JSON
            </button>
          </div>
        </div>
      </div>

      {/* Data Structure Info */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Estrutura dos Dados
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p><strong>id:</strong> Identificador único (obrigatório)</p>
          <p><strong>category:</strong> Nome da categoria (obrigatório)</p>
          <p><strong>value:</strong> Valor numérico (obrigatório)</p>
          <p><strong>type:</strong> baseline | increase | decrease | subtotal | total (obrigatório)</p>
          <p><strong>color:</strong> Cor em hexadecimal (opcional)</p>
          <p><strong>isSubtotal:</strong> true/false para subtotais (opcional)</p>
        </div>
      </div>

      {/* Validation Info */}
      <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">
          💡 Dicas de Validação
        </h4>
        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
          <li>• Inclua pelo menos um valor "baseline" para o ponto de partida</li>
          <li>• Adicione um valor "total" para mostrar o resultado final</li>
          <li>• Use valores positivos para "increase" e negativos para "decrease"</li>
          <li>• Subtotais ajudam a organizar dados complexos</li>
        </ul>
      </div>
    </div>
  );
};