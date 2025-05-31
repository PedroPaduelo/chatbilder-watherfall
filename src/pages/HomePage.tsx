import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Layout as LayoutIcon, 
  Plus, 
  TrendingUp, 
  Zap,
  ArrowRight,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { useSavedCharts } from '../hooks/useSavedCharts';
import { useDashboards } from '../hooks/useDashboards';

const HomePage: React.FC = () => {
  const { charts, getChartsStats } = useSavedCharts();
  const { dashboards, getDashboardsStats } = useDashboards();
  
  const chartStats = getChartsStats();
  const dashboardStats = getDashboardsStats();

  const recentCharts = charts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const recentDashboards = dashboards
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const features = [
    {
      icon: BarChart3,
      title: 'Gráficos Profissionais',
      description: 'Crie gráficos waterfall, sankey, linha, área e barras empilhadas com facilidade.',
      color: 'blue'
    },
    {
      icon: LayoutIcon,
      title: 'Dashboards Interativos',
      description: 'Organize seus gráficos em dashboards personalizáveis e responsivos.',
      color: 'green'
    },
    {
      icon: Zap,
      title: 'Importação Rápida',
      description: 'Importe dados de CSV, Excel e JSON com processamento automático.',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Análise Avançada',
      description: 'Ferramentas de análise com métricas, filtros e anotações.',
      color: 'orange'
    }
  ];

  const chartTypeLabels = {
    waterfall: 'Waterfall',
    'stacked-bar': 'Barras Empilhadas',
    line: 'Linha',
    area: 'Área',
    sankey: 'Sankey',
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-blue-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Chart Builder Pro
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Crie gráficos{' '}
                <span className="text-blue-600 dark:text-blue-400">profissionais</span>{' '}
                em minutos
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                Transforme seus dados em visualizações impressionantes com nossa plataforma 
                intuitiva de criação de gráficos e dashboards interativos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/charts/new"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" />
                Criar Primeiro Gráfico
              </Link>
              <Link
                to="/dashboards/new"
                className="inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <LayoutIcon className="w-5 h-5 mr-2" />
                Criar Dashboard
              </Link>
            </div>
          </div>

          <div className="flex-shrink-0 mt-8 lg:mt-0 lg:ml-8">
            <div className="relative">
              <div className="w-72 h-48 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Vendas 2024</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-blue-200 dark:bg-blue-800 rounded-full">
                      <div className="h-2 bg-blue-600 rounded-full w-4/5"></div>
                    </div>
                    <div className="h-2 bg-green-200 dark:bg-green-800 rounded-full">
                      <div className="h-2 bg-green-600 rounded-full w-3/5"></div>
                    </div>
                    <div className="h-2 bg-purple-200 dark:bg-purple-800 rounded-full">
                      <div className="h-2 bg-purple-600 rounded-full w-4/6"></div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    R$ 2.4M
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-yellow-800" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gráficos Criados</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{chartStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dashboards</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{dashboardStats.total}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <LayoutIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Esta Semana</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {chartStats.recentCount + dashboardStats.recentCount}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipos de Gráfico</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {Object.keys(chartStats.byType).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Recursos Principais
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Descubra as funcionalidades que tornam nossa plataforma a escolha ideal 
            para visualização de dados profissional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
              purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
              orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
            };

            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className={`p-3 rounded-lg w-fit mb-4 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Charts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gráficos Recentes
              </h3>
              <Link
                to="/charts"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentCharts.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Nenhum gráfico criado ainda
                </p>
                <Link
                  to="/charts/new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Gráfico
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCharts.map((chart) => (
                  <Link
                    key={chart.id}
                    to={`/charts/${chart.id}`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {chart.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chartTypeLabels[chart.chartType as keyof typeof chartTypeLabels]} • {' '}
                          {new Date(chart.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Dashboards */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dashboards Recentes
              </h3>
              <Link
                to="/dashboards"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm flex items-center"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6">
            {recentDashboards.length === 0 ? (
              <div className="text-center py-8">
                <LayoutIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Nenhum dashboard criado ainda
                </p>
                <Link
                  to="/dashboards/new"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentDashboards.map((dashboard) => (
                  <Link
                    key={dashboard.id}
                    to={`/dashboards/${dashboard.id}`}
                    className="block p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {dashboard.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {dashboard.charts.length} gráfico{dashboard.charts.length !== 1 ? 's' : ''} • {' '}
                          {new Date(dashboard.updatedAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;