import React, { useState } from 'react';
import type { DataRow, ChartSettings } from '../types';
import RechartsWaterfall from './RechartsWaterfall';
import RechartsStackedBars from './RechartsStackedBars';
import { useRechartsData } from '../hooks/useRechartsData';

interface WaterfallChartProps {
  data: DataRow[];
  settings: ChartSettings;
}

const WaterfallChart: React.FC<WaterfallChartProps> = ({ data, settings }) => {
  const [chartMode, setChartMode] = useState<'waterfall' | 'stacked'>('waterfall');
  const { segmentData, segmentKeys, segmentColors } = useRechartsData(data);
  
  // Check if we have any stacked data
  const hasStackedData = segmentData.length > 0 && segmentKeys.length > 0;
  
  return (
    <div className="relative w-full">
      {/* Chart Mode Toggle */}
      {hasStackedData && (
        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setChartMode('waterfall')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                chartMode === 'waterfall'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Gráfico Waterfall
            </button>
            <button
              onClick={() => setChartMode('stacked')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                chartMode === 'stacked'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Barras Empilhadas
            </button>
          </div>
        </div>
      )}

      {/* Chart Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {chartMode === 'waterfall' ? (
          <RechartsWaterfall data={data} settings={settings} />
        ) : (
          <RechartsStackedBars
            data={segmentData}
            segmentKeys={segmentKeys}
            segmentColors={segmentColors}
            settings={settings}
          />
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-4 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 mb-1">Dados</h4>
            <p className="text-blue-700">
              {data.length} {data.length === 1 ? 'categoria' : 'categorias'}
            </p>
          </div>
          
          {hasStackedData && (
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="font-medium text-green-900 mb-1">Segmentos</h4>
              <p className="text-green-700">
                {segmentKeys.length} {segmentKeys.length === 1 ? 'segmento' : 'segmentos'} empilhados
              </p>
            </div>
          )}
          
          <div className="bg-purple-50 rounded-lg p-3">
            <h4 className="font-medium text-purple-900 mb-1">Visualização</h4>
            <p className="text-purple-700">
              Powered by Recharts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterfallChart;