import React, { useState } from 'react';
import { 
  Plus, 
  Grid, 
  List, 
  Search, 
  Calendar, 
  Eye, 
  Edit3, 
  Copy, 
  Trash2, 
  Layout
} from 'lucide-react';
import { useDashboards } from '../hooks/useDashboards';
import { Dashboard } from '../services/databaseService';
import Modal from './Modal';

interface DashboardsManagerProps {
  onSelectDashboard?: (dashboard: Dashboard) => void;
  onEditDashboard?: (dashboardId: string) => void;
  onCreateDashboard?: () => void;
}

export const DashboardsManager: React.FC<DashboardsManagerProps> = ({
  onSelectDashboard,
  onEditDashboard,
}) => {
  const {
    dashboards,
    loading,
    createDashboard,
    duplicateDashboard,
    deleteDashboard,
    getDashboardsStats,
  } = useDashboards();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    columns: 12,
    rows: 8,
  });

  const stats = getDashboardsStats();

  // Filtrar dashboards
  const filteredDashboards = dashboards.filter(dashboard => {
    if (searchText && !dashboard.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !dashboard.description?.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleCreateDashboard = async () => {
    if (!createForm.name.trim()) return;

    try {
      const newId = await createDashboard({
        name: createForm.name,
        description: createForm.description,
        layout: {
          columns: createForm.columns,
          rows: createForm.rows,
          gap: 16,
        },
      });

      if (newId && onEditDashboard) {
        onEditDashboard(newId);
      }

      setShowCreateModal(false);
      setCreateForm({ name: '', description: '', columns: 12, rows: 8 });
    } catch (error) {
      console.error('Erro ao criar dashboard:', error);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const DashboardCard = ({ dashboard }: { dashboard: Dashboard }) => (
    <div
      className="border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-700"
      onClick={() => onSelectDashboard?.(dashboard)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {dashboard.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dashboard.charts.length} gráfico{dashboard.charts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDashboard?.(dashboard);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditDashboard?.(dashboard.id);
            }}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateDashboard(dashboard.id);
            }}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Tem certeza que deseja excluir este dashboard?')) {
                deleteDashboard(dashboard.id);
              }
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {dashboard.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {dashboard.description}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {formatDate(dashboard.updatedAt)}
        </div>
        <div className="flex items-center gap-4">
          <span>{dashboard.layout.columns}×{dashboard.layout.rows} grid</span>
          {dashboard.isPublic && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
              Público
            </span>
          )}
        </div>
      </div>

      {/* Miniatura do layout */}
      <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-3">
        <div 
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${Math.min(dashboard.layout.columns, 6)}, 1fr)`,
            aspectRatio: '2/1',
          }}
        >
          {dashboard.charts.slice(0, 12).map((chart, index) => (
            <div
              key={index}
              className="bg-blue-200 dark:bg-blue-700 rounded-sm opacity-60"
              style={{
                gridColumn: `span ${Math.min(chart.size.width, 2)}`,
                gridRow: `span ${Math.min(chart.size.height, 1)}`,
              }}
            />
          ))}
        </div>
        {dashboard.charts.length === 0 && (
          <div className="flex items-center justify-center h-16 text-gray-400">
            <Layout className="w-8 h-8" />
          </div>
        )}
      </div>
    </div>
  );

  const DashboardListItem = ({ dashboard }: { dashboard: Dashboard }) => (
    <div
      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-200 dark:border-gray-600 last:border-b-0"
      onClick={() => onSelectDashboard?.(dashboard)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Layout className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {dashboard.name}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{dashboard.charts.length} gráfico{dashboard.charts.length !== 1 ? 's' : ''}</span>
              <span>{dashboard.layout.columns}×{dashboard.layout.rows} grid</span>
              <span>{formatDate(dashboard.updatedAt)}</span>
              {dashboard.isPublic && (
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs">
                  Público
                </span>
              )}
            </div>
            {dashboard.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                {dashboard.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectDashboard?.(dashboard);
            }}
            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Visualizar"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditDashboard?.(dashboard.id);
            }}
            className="p-2 text-gray-400 hover:text-green-600 transition-colors"
            title="Editar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateDashboard(dashboard.id);
            }}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
            title="Duplicar"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Tem certeza que deseja excluir este dashboard?')) {
                deleteDashboard(dashboard.id);
              }
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header e Estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Meus Dashboards
          </h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Dashboard
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total de Dashboards</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalCharts}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Gráficos nos Dashboards</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.averageChartsPerDashboard}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Média de Gráficos</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.recentCount}</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Criados esta Semana</div>
          </div>
        </div>

        {/* Barra de Busca e Controles */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar dashboards..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Dashboards */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDashboards.length === 0 ? (
          <div className="text-center p-8">
            <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {dashboards.length === 0 ? 'Nenhum dashboard criado ainda' : 'Nenhum dashboard encontrado'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {dashboards.length === 0 
                ? 'Crie seu primeiro dashboard para organizar seus gráficos'
                : 'Tente ajustar os filtros de busca'
              }
            </p>
            {dashboards.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Criar Primeiro Dashboard
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredDashboards.map(dashboard => (
              <DashboardCard key={dashboard.id} dashboard={dashboard} />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredDashboards.map(dashboard => (
              <DashboardListItem key={dashboard.id} dashboard={dashboard} />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Criar Dashboard */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateForm({ name: '', description: '', columns: 12, rows: 8 });
        }}
        title="Criar Novo Dashboard"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Dashboard *
            </label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="Digite o nome do dashboard"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Descreva o dashboard (opcional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Colunas do Grid
              </label>
              <input
                type="number"
                min="6"
                max="24"
                value={createForm.columns}
                onChange={(e) => setCreateForm({ ...createForm, columns: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Linhas do Grid
              </label>
              <input
                type="number"
                min="4"
                max="16"
                value={createForm.rows}
                onChange={(e) => setCreateForm({ ...createForm, rows: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowCreateModal(false);
                setCreateForm({ name: '', description: '', columns: 12, rows: 8 });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleCreateDashboard}
              disabled={!createForm.name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              Criar Dashboard
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};