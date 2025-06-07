import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Share2, Download, Copy, Trash2 } from 'lucide-react';
import UniversalChartRenderer from '../components/charts/UniversalChartRenderer';
import { useSavedCharts } from '../hooks/useSavedCharts';
import { useNotifications } from '../hooks/useNotifications';
import { useFileOperations } from '../hooks/useFileOperations';
import { useChartDimensions } from '../hooks/useChartDimensions';
import type { ChartData, ChartType, DataRow, SankeyData } from '../types';
import { SavedChart } from '../services/databaseService';

const ChartViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [chart, setChart] = useState<SavedChart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const chartRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { getChart, deleteChart, duplicateChart } = useSavedCharts();
  const { notifySuccess, notifyError } = useNotifications();
  
  const dimensions = useChartDimensions(
    chart?.chartType === 'sankey' ? [] : (chart?.data as DataRow[] || []), 
    chart?.settings || {}
  );
  
  const {
    exportAsPNG,
    exportAsSVG,
    exportAsJSON,
    exportAsHTML
  } = useFileOperations({
    data: chart?.chartType === 'sankey' ? [] : (chart?.data as DataRow[] || []),
    settings: chart?.settings || {},
    onDataChange: () => {},
    chartRef
  });

  // Load chart
  useEffect(() => {
    if (id) {
      const loadChart = async () => {
        setIsLoading(true);
        try {
          const chartData = await getChart(id);
          if (chartData) {
            setChart(chartData);
            notifySuccess('Gráfico carregado', `"${chartData.name}" foi carregado`);
          } else {
            notifyError('Gráfico não encontrado', 'O gráfico solicitado não existe');
            navigate('/charts');
          }
        } catch (error) {
          notifyError('Erro ao carregar gráfico', 'Não foi possível carregar o gráfico');
          navigate('/charts');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadChart();
    }
  }, [id]);

  // Handlers
  const handleEdit = () => {
    if (chart) {
      navigate(`/charts/${chart.id}/edit`);
    }
  };

  const handleDuplicate = async () => {
    if (chart) {
      try {
        const newId = await duplicateChart(chart.id);
        notifySuccess('Gráfico duplicado', `Uma cópia de "${chart.name}" foi criada`);
        navigate(`/charts/${newId}/edit`);
      } catch (error) {
        notifyError('Erro ao duplicar', 'Não foi possível duplicar o gráfico');
      }
    }
  };

  const handleDelete = async () => {
    if (chart && confirm(`Tem certeza que deseja excluir "${chart.name}"?`)) {
      try {
        await deleteChart(chart.id);
        notifySuccess('Gráfico excluído', `"${chart.name}" foi excluído com sucesso`);
        navigate('/charts');
      } catch (error) {
        notifyError('Erro ao excluir', 'Não foi possível excluir o gráfico');
      }
    }
  };

  const handleShare = () => {
    if (chart) {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      notifySuccess('Link copiado', 'Link do gráfico foi copiado para a área de transferência');
    }
  };

  // Export handlers
  const handleExportPNG = async () => {
    try {
      await exportAsPNG();
      notifySuccess('PNG exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar PNG');
    }
  };

  const handleExportSVG = () => {
    try {
      exportAsSVG();
      notifySuccess('SVG exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar SVG');
    }
  };

  const handleExportJSON = () => {
    try {
      exportAsJSON();
      notifySuccess('JSON exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar JSON');
    }
  };

  const handleExportHTML = () => {
    try {
      exportAsHTML();
      notifySuccess('HTML exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar HTML');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Gráfico não encontrado
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          O gráfico que você está procurando não existe ou foi removido.
        </p>
        <Link
          to="/charts"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Gráficos
        </Link>
      </div>
    );
  }

  // Create chart data object
  const chartData: ChartData = {
    type: chart.chartType as ChartType,
    waterfall: chart.chartType === 'sankey' ? [] : (chart.data as DataRow[]),
    sankey: chart.chartType === 'sankey' ? (chart.data as SankeyData) : { nodes: [], links: [] },
    stackedBar: chart.chartType === 'sankey' ? [] : (chart.data as DataRow[]),
    line: chart.chartType === 'sankey' ? [] : (chart.data as DataRow[]),
    area: chart.chartType === 'sankey' ? [] : (chart.data as DataRow[]),
  };

  const chartTypeLabels = {
    waterfall: 'Waterfall',
    'stacked-bar': 'Barras Empilhadas',
    line: 'Linha',
    area: 'Área',
    sankey: 'Sankey',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/charts"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar aos Gráficos</span>
            </Link>
            <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {chart.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {chartTypeLabels[chart.chartType as keyof typeof chartTypeLabels]} • 
                Atualizado em {new Date(chart.updatedAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartilhar</span>
            </button>

            <div className="relative group">
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Exportar</span>
              </button>
              
              {/* Export Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <div className="py-2">
                  <button
                    onClick={handleExportPNG}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Exportar como PNG
                  </button>
                  <button
                    onClick={handleExportSVG}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Exportar como SVG
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Exportar como JSON
                  </button>
                  <button
                    onClick={handleExportHTML}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Exportar como HTML
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleDuplicate}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Duplicar</span>
            </button>

            <button
              onClick={handleEdit}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-300 dark:border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </button>
          </div>
        </div>

        {/* Chart Description */}
        {chart.description && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300">{chart.description}</p>
          </div>
        )}

        {/* Chart Tags */}
        {chart.tags && chart.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {chart.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Chart Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div ref={chartRef} className="w-full">
          <UniversalChartRenderer
            chartType={chart.chartType as ChartType}
            data={chartData}
            settings={chart.settings}
            dimensions={dimensions}
            onDataChange={() => {}} // Read-only in viewer
            onSettingsChange={() => {}} // Read-only in viewer
            isConfigModalOpen={false}
            onConfigModalClose={() => {}}
          />
        </div>
      </div>

      {/* Chart Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informações do Gráfico
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tipo</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {chartTypeLabels[chart.chartType as keyof typeof chartTypeLabels]}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(chart.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </dd>
          </div>
          
          <div>
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Última atualização</dt>
            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
              {new Date(chart.updatedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartViewerPage;