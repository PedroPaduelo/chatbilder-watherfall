import { useState, useEffect, useCallback } from 'react';
import { databaseService, Dashboard, DashboardChart } from '../services/databaseService';
import { useNotifications } from './useNotifications';

export const useDashboards = () => {
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  // Carregar todos os dashboards
  const loadDashboards = useCallback(async () => {
    try {
      setLoading(true);
      const allDashboards = await databaseService.getAllDashboards();
      setDashboards(allDashboards.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
      setError(null);
    } catch (error) {
      console.error('Erro ao carregar dashboards:', error);
      setError('Erro ao carregar dados');
      addNotification('error', 'Erro ao carregar dashboards');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Criar novo dashboard
  const createDashboard = useCallback(async (dashboardData: {
    name: string;
    description?: string;
    layout?: { columns: number; rows: number; gap: number };
  }) => {
    try {
      const dashboard: Dashboard = {
        id: crypto.randomUUID(),
        name: dashboardData.name,
        description: dashboardData.description,
        charts: [],
        layout: dashboardData.layout || { columns: 12, rows: 8, gap: 16 },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
      };

      await databaseService.saveDashboard(dashboard);
      await loadDashboards();
      addNotification('success', `Dashboard "${dashboard.name}" criado!`);
      return dashboard.id;
    } catch (err) {
      addNotification('error', 'Erro ao criar dashboard');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Atualizar dashboard
  const updateDashboard = useCallback(async (id: string, updates: Partial<Dashboard>) => {
    try {
      const existingDashboard = await databaseService.getDashboard(id);
      if (!existingDashboard) {
        throw new Error('Dashboard não encontrado');
      }

      const updatedDashboard = {
        ...existingDashboard,
        ...updates,
        updatedAt: new Date(),
      };

      await databaseService.saveDashboard(updatedDashboard);
      await loadDashboards();
      addNotification('success', `Dashboard "${updatedDashboard.name}" atualizado!`);
    } catch (err) {
      addNotification('error', 'Erro ao atualizar dashboard');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Adicionar gráfico ao dashboard
  const addChartToDashboard = useCallback(async (
    dashboardId: string, 
    chartId: string, 
    position: { x: number; y: number },
    size: { width: number; height: number },
    title?: string
  ) => {
    try {
      const dashboard = await databaseService.getDashboard(dashboardId);
      if (!dashboard) {
        throw new Error('Dashboard não encontrado');
      }

      const newChart: DashboardChart = {
        chartId,
        position,
        size,
        title,
      };

      const updatedDashboard = {
        ...dashboard,
        charts: [...dashboard.charts, newChart],
        updatedAt: new Date(),
      };

      await databaseService.saveDashboard(updatedDashboard);
      await loadDashboards();
      addNotification('success', 'Gráfico adicionado ao dashboard!');
    } catch (err) {
      addNotification('error', 'Erro ao adicionar gráfico');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Remover gráfico do dashboard
  const removeChartFromDashboard = useCallback(async (dashboardId: string, chartId: string) => {
    try {
      const dashboard = await databaseService.getDashboard(dashboardId);
      if (!dashboard) {
        throw new Error('Dashboard não encontrado');
      }

      const updatedDashboard = {
        ...dashboard,
        charts: dashboard.charts.filter(chart => chart.chartId !== chartId),
        updatedAt: new Date(),
      };

      await databaseService.saveDashboard(updatedDashboard);
      await loadDashboards();
      addNotification('success', 'Gráfico removido do dashboard!');
    } catch (err) {
      addNotification('error', 'Erro ao remover gráfico');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Atualizar posição/tamanho de gráfico no dashboard
  const updateChartInDashboard = useCallback(async (
    dashboardId: string,
    chartId: string,
    updates: Partial<DashboardChart>
  ) => {
    try {
      const dashboard = await databaseService.getDashboard(dashboardId);
      if (!dashboard) {
        throw new Error('Dashboard não encontrado');
      }

      const updatedDashboard = {
        ...dashboard,
        charts: dashboard.charts.map(chart =>
          chart.chartId === chartId ? { ...chart, ...updates } : chart
        ),
        updatedAt: new Date(),
      };

      await databaseService.saveDashboard(updatedDashboard);
      await loadDashboards();
    } catch (err) {
      addNotification('error', 'Erro ao atualizar gráfico');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Duplicar dashboard
  const duplicateDashboard = useCallback(async (id: string) => {
    try {
      const originalDashboard = await databaseService.getDashboard(id);
      if (!originalDashboard) {
        throw new Error('Dashboard não encontrado');
      }

      const duplicatedDashboard: Dashboard = {
        ...originalDashboard,
        id: crypto.randomUUID(),
        name: `${originalDashboard.name} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await databaseService.saveDashboard(duplicatedDashboard);
      await loadDashboards();
      addNotification('success', `Dashboard duplicado: "${duplicatedDashboard.name}"`);
      return duplicatedDashboard.id;
    } catch (err) {
      addNotification('error', 'Erro ao duplicar dashboard');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Deletar dashboard
  const deleteDashboard = useCallback(async (id: string) => {
    try {
      const dashboard = await databaseService.getDashboard(id);
      await databaseService.deleteDashboard(id);
      await loadDashboards();
      addNotification(`Dashboard "${dashboard?.name}" removido`, 'success');
    } catch (err) {
      addNotification('Erro ao remover dashboard', 'error');
      throw err;
    }
  }, [loadDashboards, addNotification]);

  // Obter dashboard específico com dados dos gráficos
  const getDashboardWithCharts = useCallback(async (id: string) => {
    try {
      const dashboard = await databaseService.getDashboard(id);
      if (!dashboard) return null;

      // Buscar dados dos gráficos
      const chartsWithData = await Promise.all(
        dashboard.charts.map(async (dashboardChart) => {
          const chartData = await databaseService.getChart(dashboardChart.chartId);
          return {
            ...dashboardChart,
            chartData,
          };
        })
      );

      return {
        ...dashboard,
        charts: chartsWithData,
      };
    } catch (err) {
      addNotification('Erro ao carregar dashboard', 'error');
      return null;
    }
  }, [addNotification]);

  // Obter estatísticas dos dashboards
  const getDashboardsStats = useCallback(() => {
    const stats = {
      total: dashboards.length,
      totalCharts: 0,
      averageChartsPerDashboard: 0,
      recentCount: 0,
      publicCount: 0,
    };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    dashboards.forEach(dashboard => {
      stats.totalCharts += dashboard.charts.length;
      
      if (new Date(dashboard.createdAt) > oneWeekAgo) {
        stats.recentCount++;
      }
      
      if (dashboard.isPublic) {
        stats.publicCount++;
      }
    });

    stats.averageChartsPerDashboard = stats.total > 0 
      ? Math.round(stats.totalCharts / stats.total * 10) / 10 
      : 0;

    return stats;
  }, [dashboards]);

  // Validar posicionamento de gráfico
  const validateChartPosition = useCallback((
    dashboardId: string,
    position: { x: number; y: number },
    size: { width: number; height: number },
    excludeChartId?: string
  ) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return false;

    // Verificar se está dentro dos limites do grid
    if (position.x < 0 || position.y < 0) return false;
    if (position.x + size.width > dashboard.layout.columns) return false;
    if (position.y + size.height > dashboard.layout.rows) return false;

    // Verificar sobreposição com outros gráficos
    for (const chart of dashboard.charts) {
      if (excludeChartId && chart.chartId === excludeChartId) continue;

      const overlapsX = position.x < chart.position.x + chart.size.width &&
                       position.x + size.width > chart.position.x;
      const overlapsY = position.y < chart.position.y + chart.size.height &&
                       position.y + size.height > chart.position.y;

      if (overlapsX && overlapsY) return false;
    }

    return true;
  }, [dashboards]);

  // Encontrar próxima posição disponível
  const findNextAvailablePosition = useCallback((
    dashboardId: string,
    size: { width: number; height: number }
  ) => {
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (!dashboard) return null;

    for (let y = 0; y <= dashboard.layout.rows - size.height; y++) {
      for (let x = 0; x <= dashboard.layout.columns - size.width; x++) {
        if (validateChartPosition(dashboardId, { x, y }, size)) {
          return { x, y };
        }
      }
    }

    return null; // Nenhuma posição disponível
  }, [dashboards, validateChartPosition]);

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboards();
  }, [loadDashboards]);

  return {
    dashboards,
    loading,
    error,
    createDashboard,
    updateDashboard,
    addChartToDashboard,
    removeChartFromDashboard,
    updateChartInDashboard,
    duplicateDashboard,
    deleteDashboard,
    getDashboardWithCharts,
    getDashboardsStats,
    validateChartPosition,
    findNextAvailablePosition,
    loadDashboards,
  };
};