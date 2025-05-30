import React, { useState } from 'react';
import type { DataRow, ChartSettings } from '../types';
import RechartsWaterfall from './RechartsWaterfall';
import { useRechartsData } from '../hooks/useRechartsData';

interface WaterfallChartProps {
  data: DataRow[];
  settings: ChartSettings;
  onBarSelect?: (barId: string | undefined) => void;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ 
  data, 
  settings, 
  onBarSelect 
}) => {
  const [selectedBarId, setSelectedBarId] = useState<string | undefined>();
  const { segmentKeys } = useRechartsData(data);
  
  const handleBarSelect = (barId: string | undefined) => {
    setSelectedBarId(barId);
    onBarSelect?.(barId);
  };
  
  return (
    <div className="relative w-full">
      {/* Chart Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 transition-colors">
        <RechartsWaterfall 
          data={data} 
          settings={settings}
          onBarSelect={handleBarSelect}
        />
      </div>

      {/* Chart Info */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Dados</h4>
            <p className="text-blue-700 dark:text-blue-300">
              {data.length} {data.length === 1 ? 'categoria' : 'categorias'}
            </p>
          </div>
          
          {segmentKeys.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">Segmentos</h4>
              <p className="text-green-700 dark:text-green-300">
                {segmentKeys.length} {segmentKeys.length === 1 ? 'segmento' : 'segmentos'} empilhados
              </p>
            </div>
          )}
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">Visualização</h4>
            <p className="text-purple-700 dark:text-purple-300">
              Waterfall Chart
            </p>
          </div>
        </div>
        
        {selectedBarId && (
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">Barra Selecionada</h4>
            <p className="text-amber-700 dark:text-amber-300">
              {data.find(d => d.id === selectedBarId)?.category || 'Categoria não encontrada'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterfallChart;