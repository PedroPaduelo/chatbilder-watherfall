import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Grid, Eye } from 'lucide-react';
import { DashboardBuilder } from '../components/DashboardBuilder';
import { useDashboards } from '../hooks/useDashboards';
import { useSavedCharts } from '../hooks/useSavedCharts';
import { useNotifications } from '../hooks/useNotifications';
import { Dashboard } from '../services/databaseService';

const DashboardCreatorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // State
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dashboardName, setDashboardName] = useState('');
  const [dashboardDescription, setDashboardDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Hooks
  const { getDashboard, updateDashboard, createDashboard } = useDashboards();
  const { charts } = useSavedCharts();
  const { notifySuccess, notifyError } = useNotifications();

  // Load existing dashboard if editing
  useEffect(() => {
    if (isEditing && id) {
      const loadDashboard = async () => {
        setIsLoading(true);
        try {
          const dashboardData = await getDashboard(id);
          if (dashboardData) {
            setDashboard(dashboardData);
            setDashboardName(dashboardData.name);
            setDashboardDescription(dashboardData.description || '');
            notifySuccess('Dashboard carregado', `"${dashboardData.name}" carregado para edição`);
          }
        } catch (error) {
          notifyError('Erro ao carregar dashboard', 'Não foi possível carregar o dashboard');
          navigate('/dashboards');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDashboard();
    } else {
      // Create new dashboard structure
      setDashboard({
        id: 'new',
        name: '',
        description: '',
        layout: {
          columns: 12,
          rows: 8,
          gap: 16,
        },
        charts: [],
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }, [id, isEditing]);

  // Save dashboard
  const handleSaveDashboard = async () => {
    if (!dashboardName.trim()) {
      notifyError('Nome obrigatório', 'Por favor, digite um nome para o dashboard');
      return;
    }

    if (!dashboard) {
      notifyError('Erro', 'Dashboard não encontrado');
      return;
    }

    try {
      const dashboardDataToSave = {
        ...dashboard,
        name: dashboardName,
        description: dashboardDescription,
      };

      if (isEditing && id) {
        await updateDashboard(id, dashboardDataToSave);
        notifySuccess('Dashboard atualizado', `"${dashboardName}" foi atualizado com sucesso`);
      } else {
        const newId = await createDashboard(dashboardDataToSave);
        notifySuccess('Dashboard salvo', `"${dashboardName}" foi salvo com sucesso`);
        navigate(`/dashboards/${newId}/edit`);
      }
    } catch (error) {
      notifyError('Erro ao salvar', 'Não foi possível salvar o dashboard');
    }
  };

  // Handle dashboard changes
  const handleDashboardChange = (updatedDashboard: Dashboard) => {
    setDashboard(updatedDashboard);
  };

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
        <p className="text-gray-500 dark:text-gray-400">Dashboard não encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboards')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar aos Dashboards</span>
            </button>
            <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Dashboard' : 'Novo Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isPreviewMode
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {isPreviewMode ? <Grid className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPreviewMode ? 'Editar' : 'Visualizar'}</span>
            </button>

            <button
              onClick={handleSaveDashboard}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Atualizar' : 'Salvar'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Name and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Dashboard *
            </label>
            <input
              type="text"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Digite o nome do dashboard"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              placeholder="Descrição opcional"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Dashboard Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <DashboardBuilder
          dashboard={dashboard}
          availableCharts={charts}
          isPreviewMode={isPreviewMode}
          onDashboardChange={handleDashboardChange}
        />
      </div>

      {/* Instructions */}
      {!isPreviewMode && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            Como usar o Dashboard Builder
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-medium mb-2">Adicionando Gráficos:</h4>
              <ul className="space-y-1">
                <li>• Arraste gráficos da barra lateral para o grid</li>
                <li>• Redimensione arrastando as bordas</li>
                <li>• Mova gráficos arrastando o cabeçalho</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Dicas:</h4>
              <ul className="space-y-1">
                <li>• Use o modo visualização para testar</li>
                <li>• Salve frequentemente suas alterações</li>
                <li>• Organize por temas ou métricas</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCreatorPage;