import { useState, useEffect, useCallback } from 'react';
import { databaseService, SavedChart } from '../services/databaseService';
import { useNotifications } from './useNotifications';

export const useSavedCharts = () => {
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  // Carregar todos os gráficos
  const loadCharts = useCallback(async () => {
    try {
      setLoading(true);
      const allCharts = await databaseService.getAllCharts();
      setCharts(allCharts.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
      setError(null);
    } catch (err) {
      setError('Erro ao carregar gráficos');
      addNotification('error', 'Erro ao carregar gráficos');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Salvar gráfico
  const saveChart = useCallback(async (chartData: {
    name: string;
    description?: string;
    chartType: string;
    data: any;
    settings: any;
    thumbnail?: string;
    tags?: string[];
  }) => {
    try {
      const chart: SavedChart = {
        id: crypto.randomUUID(),
        ...chartData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await databaseService.saveChart(chart);
      await loadCharts();
      addNotification('success', `Gráfico "${chart.name}" salvo com sucesso!`);
      return chart.id;
    } catch (err) {
      addNotification('error', 'Erro ao salvar gráfico');
      throw err;
    }
  }, [loadCharts, addNotification]);

  // Atualizar gráfico existente
  const updateChart = useCallback(async (id: string, updates: Partial<SavedChart>) => {
    try {
      const existingChart = await databaseService.getChart(id);
      if (!existingChart) {
        throw new Error('Gráfico não encontrado');
      }

      const updatedChart = {
        ...existingChart,
        ...updates,
        updatedAt: new Date(),
      };

      await databaseService.saveChart(updatedChart);
      await loadCharts();
      addNotification('success', `Gráfico "${updatedChart.name}" atualizado!`);
    } catch (err) {
      addNotification('error', 'Erro ao atualizar gráfico');
      throw err;
    }
  }, [loadCharts, addNotification]);

  // Duplicar gráfico
  const duplicateChart = useCallback(async (id: string) => {
    try {
      const originalChart = await databaseService.getChart(id);
      if (!originalChart) {
        throw new Error('Gráfico não encontrado');
      }

      const duplicatedChart: SavedChart = {
        ...originalChart,
        id: crypto.randomUUID(),
        name: `${originalChart.name} (Cópia)`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await databaseService.saveChart(duplicatedChart);
      await loadCharts();
      addNotification('success', `Gráfico duplicado: "${duplicatedChart.name}"`);
      return duplicatedChart.id;
    } catch (err) {
      addNotification('error', 'Erro ao duplicar gráfico');
      throw err;
    }
  }, [loadCharts, addNotification]);

  // Deletar gráfico
  const deleteChart = useCallback(async (id: string) => {
    try {
      const chart = await databaseService.getChart(id);
      await databaseService.deleteChart(id);
      await loadCharts();
      addNotification('success', `Gráfico "${chart?.name}" removido`);
    } catch (err) {
      addNotification('error', 'Erro ao remover gráfico');
      throw err;
    }
  }, [loadCharts, addNotification]);

  // Buscar gráficos com filtros
  const searchCharts = useCallback(async (filters: {
    chartType?: string;
    tags?: string[];
    dateRange?: { start: Date; end: Date };
    searchText?: string;
  }) => {
    try {
      setLoading(true);
      let filteredCharts = await databaseService.searchCharts({
        chartType: filters.chartType,
        tags: filters.tags,
        dateRange: filters.dateRange,
      });

      // Filtro por texto de busca
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        filteredCharts = filteredCharts.filter(chart =>
          chart.name.toLowerCase().includes(searchLower) ||
          chart.description?.toLowerCase().includes(searchLower) ||
          chart.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      setCharts(filteredCharts.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ));
    } catch (err) {
      addNotification('error', 'Erro ao buscar gráficos');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  // Obter estatísticas dos gráficos
  const getChartsStats = useCallback(() => {
    const stats = {
      total: charts.length,
      byType: {} as Record<string, number>,
      recentCount: 0,
      tagsUsed: new Set<string>(),
    };

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    charts.forEach(chart => {
      // Contagem por tipo
      stats.byType[chart.chartType] = (stats.byType[chart.chartType] || 0) + 1;
      
      // Gráficos recentes
      if (new Date(chart.createdAt) > oneWeekAgo) {
        stats.recentCount++;
      }
      
      // Tags utilizadas
      chart.tags?.forEach(tag => stats.tagsUsed.add(tag));
    });

    return {
      ...stats,
      tagsUsed: Array.from(stats.tagsUsed),
    };
  }, [charts]);

  // Exportar todos os gráficos
  const exportCharts = useCallback(async () => {
    try {
      const exportData = await databaseService.exportDatabase();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chart-builder-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      addNotification('success', 'Backup exportado com sucesso!');
    } catch (err) {
      addNotification('error', 'Erro ao exportar backup');
    }
  }, [addNotification]);

  // Importar gráficos
  const importCharts = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      await databaseService.importDatabase(data);
      await loadCharts();
      
      const importedCount = data.charts?.length || 0;
      addNotification('success', `${importedCount} gráficos importados com sucesso!`);
    } catch (err) {
      addNotification('error', 'Erro ao importar gráficos');
      throw err;
    }
  }, [loadCharts, addNotification]);

  // Carregar dados iniciais
  useEffect(() => {
    loadCharts();
  }, [loadCharts]);

  return {
    charts,
    loading,
    error,
    saveChart,
    updateChart,
    duplicateChart,
    deleteChart,
    searchCharts,
    loadCharts,
    getChartsStats,
    exportCharts,
    importCharts,
  };
};