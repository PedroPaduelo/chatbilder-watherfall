import React from 'react';
import { Download } from 'lucide-react';
import type { ChartType } from '../../../types';
import { generateTemplate } from '../utils';

interface TemplateDownloadSectionProps {
  chartType: ChartType;
}

export const TemplateDownloadSection: React.FC<TemplateDownloadSectionProps> = ({
  chartType
}) => {
  const handleDownloadTemplate = () => {
    const template = generateTemplate(chartType);
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${chartType}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
            Template de Dados
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Baixe o template para ver o formato correto dos dados
          </p>
        </div>
        <button
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download size={16} />
          Baixar Template
        </button>
      </div>
    </div>
  );
};