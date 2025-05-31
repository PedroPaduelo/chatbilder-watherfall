import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Share2, Copy, Trash2, Eye, Grid, Maximize2 } from 'lucide-react';
import WaterfallChart from '../components/WaterfallChart';
import { useDashboards } from '../hooks/useDashboards';
import { useNotifications } from '../hooks/useNotifications';
import { databaseService, Dashboard } from '../services/databaseService';

const DashboardViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chartsData, setChartsData] = useState<any[]>([]);
  
  // Hooks
  const { getDashboardWithCharts, deleteDashboard, duplicateDashboard } = useDashboards();
  const { notifySuccess, notifyError } = useNotifications();

  // Load dashboard
  useEffect(() => {
    if (id) {
      const loadDashboard = async () => {
        setIsLoading(true);
        try {
          const dashboardData = await getDashboardWithCharts(id);
          if (dashboardData) {
            setDashboard(dashboardData);
            
            // Carregar dados dos gráficos
            const charts = await Promise.all(
              dashboardData.charts.map(async (chart) => {
                const chartData = await databaseService.getChart(chart.chartId);
                return { ...chart, chartData };
              })
            );
            setChartsData(charts);
            
            notifySuccess('Dashboard carregado', `"${dashboardData.name}" foi carregado`);
          } else {
            notifyError('Dashboard não encontrado', 'O dashboard solicitado não existe');
            navigate('/dashboards');
          }
        } catch (error) {
          notifyError('Erro ao carregar dashboard', 'Não foi possível carregar o dashboard');
          navigate('/dashboards');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDashboard();
    }
  }, [id, getDashboardWithCharts, notifySuccess, notifyError, navigate]);

  // Handlers
  const handleEdit = () => {
    if (dashboard) {
      navigate(`/dashboards/${dashboard.id}/edit`);
    }
  };

  const handleDuplicate = async () => {
    if (dashboard) {
      try {
        const newId = await duplicateDashboard(dashboard.id);
        notifySuccess('Dashboard duplicado', `Uma cópia de "${dashboard.name}" foi criada`);
        navigate(`/dashboards/${newId}/edit`);
      } catch (error) {
        notifyError('Erro ao duplicar', 'Não foi possível duplicar o dashboard');
      }
    }
  };

  const handleDelete = async () => {
    if (dashboard && confirm(`Tem certeza que deseja excluir "${dashboard.name}"?`)) {
      try {
        await deleteDashboard(dashboard.id);
        notifySuccess('Dashboard excluído', `"${dashboard.name}" foi excluído com sucesso`);
        navigate('/dashboards');
      } catch (error) {
        notifyError('Erro ao excluir', 'Não foi possível excluir o dashboard');
      }
    }
  };

  const handleShare = () => {
    if (dashboard) {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      notifySuccess('Link copiado', 'Link do dashboard foi copiado para a área de transferência');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard não encontrado
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          O dashboard que você está procurando não existe ou foi removido.
        </p>
        <Link
          to="/dashboards"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar aos Dashboards
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'p-4' : ''}`}>
      {/* Header - Hidden in fullscreen */}
      {!isFullscreen && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboards"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar aos Dashboards</span>
              </Link>
              <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboard.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {dashboard.charts.length} gráfico{dashboard.charts.length !== 1 ? 's' : ''} • 
                  Atualizado em {new Date(dashboard.updatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFullscreen}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Tela Cheia</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </button>

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

          {/* Dashboard Description */}
          {dashboard.description && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-gray-700 dark:text-gray-300">{dashboard.description}</p>
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {dashboard.charts.length}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Gráfico{dashboard.charts.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {dashboard.layout.columns}×{dashboard.layout.rows}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Grid Layout
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {dashboard.isPublic ? 'Público' : 'Privado'}
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">
                Visibilidade
              </div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {new Date(dashboard.createdAt).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">
                Criado em
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className={`${isFullscreen ? 'h-screen' : ''}`}>
        {dashboard.charts.length === 0 ? (
          // Empty Dashboard
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Grid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Dashboard Vazio
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Este dashboard ainda não possui gráficos. Adicione alguns gráficos para começar a visualizar seus dados.
            </p>
            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar Dashboard
            </button>
          </div>
        ) : (
          // Dashboard with Charts
          <div className="space-y-6">
            {chartsData.map((chartItem, index) => {
              if (!chartItem.chartData) {
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <Grid className="w-8 h-8 mx-auto mb-2" />
                      <p>Gráfico não encontrado</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {chartItem.title && (
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {chartItem.title}
                      </h3>
                    </div>
                  )}
                  <div className="p-6">
                    <WaterfallChart
                      data={chartItem.chartData.data}
                      settings={chartItem.chartData.settings}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Controls */}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Sair da Tela Cheia</span>
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Info - Hidden in fullscreen */}
      {!isFullscreen && dashboard.charts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Informações do Dashboard
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Layout</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                Grid {dashboard.layout.columns}×{dashboard.layout.rows} com espaçamento de {dashboard.layout.gap}px
              </dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Criado em</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {new Date(dashboard.createdAt).toLocaleDateString('pt-BR', {
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
                {new Date(dashboard.updatedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </dd>
            </div>
          </div>

          {/* Charts List */}
          {dashboard.charts.length > 0 && (
            <div className="mt-6">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                Gráficos no Dashboard
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashboard.charts.map((chart, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {chart.chartId || `Gráfico ${index + 1}`}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {chart.size.width}×{chart.size.height}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardViewerPage;