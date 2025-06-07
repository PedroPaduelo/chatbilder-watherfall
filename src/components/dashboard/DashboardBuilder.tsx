import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Save, 
  X, 
  Move, 
  BarChart3,
  Layout,
  Edit3
} from 'lucide-react';
import { useDashboards } from '../../hooks/useDashboards';
import { useSavedCharts } from '../../hooks/useSavedCharts';
import { Dashboard } from '../../services/databaseService';
import UniversalChartRenderer from '../charts/UniversalChartRenderer';
import Modal from '../ui/Modal';
import SaveStatus from '../shared/SaveStatus';

interface DashboardBuilderProps {
  dashboardId?: string;
  onClose?: () => void;
}

interface DragState {
  isDragging: boolean;
  isResizing: boolean;
  draggedChart: string | null;
  startPosition: { x: number; y: number };
  startSize: { width: number; height: number };
  startMouse: { x: number; y: number };
  currentPosition?: { x: number; y: number };
  currentSize?: { width: number; height: number };
  isValid?: boolean;
}

interface ChartPosition {
  x: number;
  y: number;
}

interface ChartSize {
  width: number;
  height: number;
}

const GRID_SIZE = 60; // Tamanho de cada célula do grid
const MIN_CHART_SIZE = { width: 2, height: 2 };
const MAX_CHART_SIZE = { width: 8, height: 6 };

export const DashboardBuilder: React.FC<DashboardBuilderProps> = ({
  dashboardId,
  onClose,
}) => {
  const {
    createDashboard,
    updateDashboard,
    getDashboard
  } = useDashboards();

  const { charts: savedCharts, getChart } = useSavedCharts();

  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null);
  const [dashboardCharts, setDashboardCharts] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddChart, setShowAddChart] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    isResizing: false,
    draggedChart: null,
    startPosition: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startMouse: { x: 0, y: 0 },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 12, height: 8 });
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const pendingChangesRef = useRef<Map<string, { position: ChartPosition; size: ChartSize }>>(new Map());

  // Função para validar posição do gráfico
  const validateChartPosition = useCallback((
    position: ChartPosition,
    size: ChartSize,
    excludeChartId?: string
  ): boolean => {
    // Verificar se está dentro dos limites do grid
    if (position.x < 0 || position.y < 0) return false;
    if (position.x + size.width > gridSize.width) return false;
    if (position.y + size.height > gridSize.height) return false;

    // Verificar colisão com outros gráficos
    const otherCharts = dashboardCharts.filter(chart => chart.chartId !== excludeChartId);
    
    for (const chart of otherCharts) {
      const chartRight = chart.position.x + chart.size.width;
      const chartBottom = chart.position.y + chart.size.height;
      const newRight = position.x + size.width;
      const newBottom = position.y + size.height;

      // Verificar sobreposição
      if (!(position.x >= chartRight || newRight <= chart.position.x ||
            position.y >= chartBottom || newBottom <= chart.position.y)) {
        return false;
      }
    }

    return true;
  }, [gridSize, dashboardCharts]);

  // Função para encontrar próxima posição disponível
  const findNextAvailablePosition = useCallback((
    size: ChartSize
  ): ChartPosition | null => {
    for (let y = 0; y <= gridSize.height - size.height; y++) {
      for (let x = 0; x <= gridSize.width - size.width; x++) {
        const position = { x, y };
        if (validateChartPosition(position, size)) {
          return position;
        }
      }
    }
    return null;
  }, [gridSize, validateChartPosition]);

  // Função para obter dashboard com gráficos
  const getDashboardWithCharts = useCallback(async (id: string) => {
    try {
      const dashboard = await getDashboard(id);
      if (!dashboard) return null;

      // Carregar dados dos gráficos
      const chartsWithData = await Promise.all(
        dashboard.charts.map(async (chartRef: any) => {
          const chartData = await getChart(chartRef.chartId);
          return {
            ...chartRef,
            chartData
          };
        })
      );

      return {
        ...dashboard,
        charts: chartsWithData
      };
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      return null;
    }
  }, [getDashboard, getChart]);



  // Função de salvamento inteligente com batching
  const debouncedSave = useCallback(async (
    chartId: string,
    position: ChartPosition,
    size: ChartSize
  ) => {
    if (!currentDashboard) return;

    // Armazenar mudança pendente
    pendingChangesRef.current.set(chartId, { position, size });
    setHasUnsavedChanges(true);

    // Cancelar salvamento anterior se existir
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Agendar novo salvamento
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        
        // Salvar todas as mudanças pendentes de uma vez
        const pendingChanges = Array.from(pendingChangesRef.current.entries());
        if (pendingChanges.length > 0) {
          const dashboard = await getDashboard(currentDashboard.id);
          if (dashboard) {
            const updatedCharts = dashboard.charts.map((chart: any) => {
              const pendingChange = pendingChangesRef.current.get(chart.chartId);
              if (pendingChange) {
                return { ...chart, ...pendingChange };
              }
              return chart;
            });

            await updateDashboard(currentDashboard.id, {
              charts: updatedCharts
            });

            // Limpar mudanças pendentes
            pendingChangesRef.current.clear();
            setHasUnsavedChanges(false);
          }
        }
      } catch (error) {
        console.error('Erro ao salvar:', error);
      } finally {
        setIsSaving(false);
        saveTimeoutRef.current = null;
      }
    }, 800); // 800ms de delay para permitir múltiplas operações
  }, [currentDashboard, updateDashboard, getDashboard]);

  // Carregar dashboard
  useEffect(() => {
    const initialize = async () => {
      if (dashboardId && dashboardId !== 'new') {
        await loadDashboard(dashboardId);
      } else {
        // Criar novo dashboard
        await handleCreateDashboard();
      }
    };
    
    initialize();
  }, [dashboardId]);

  const loadDashboard = async (id: string) => {
    try {
      const dashboardWithCharts = await getDashboardWithCharts(id);
      if (dashboardWithCharts) {
        setCurrentDashboard(dashboardWithCharts);
        setDashboardCharts(dashboardWithCharts.charts || []);
        setGridSize({
          width: dashboardWithCharts.layout?.columns || 12,
          height: dashboardWithCharts.layout?.rows || 8,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  const handleCreateDashboard = async () => {
    try {
      const newId = await createDashboard({
        name: `Novo Dashboard ${new Date().toLocaleString()}`,
        description: 'Dashboard criado automaticamente',
        layout: {
          columns: 12,
          rows: 8,
          gap: 16
        }
      });
      if (newId) {
        const newDashboard = await getDashboard(newId);
        if (newDashboard) {
          setCurrentDashboard(newDashboard);
          setDashboardCharts([]);
          setGridSize({
            width: newDashboard.layout?.columns || 12,
            height: newDashboard.layout?.rows || 8,
          });
          setIsEditMode(true);
        }
      }
    } catch (error) {
      console.error('Erro ao criar dashboard:', error);
    }
  };

  // Funções de drag and drop
  const handleMouseDown = useCallback((
    e: React.MouseEvent,
    chartId: string,
    action: 'drag' | 'resize' = 'drag'
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const chart = dashboardCharts.find(c => c.chartId === chartId);
    if (!chart || !isEditMode) return;

    setDragState({
      isDragging: action === 'drag',
      isResizing: action === 'resize',
      draggedChart: chartId,
      startPosition: { x: chart.position.x, y: chart.position.y },
      startSize: { width: chart.size.width, height: chart.size.height },
      startMouse: { x: e.clientX, y: e.clientY },
    });

    setSelectedChart(chartId);
  }, [dashboardCharts, isEditMode]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!dragState.draggedChart || !containerRef.current) return;

    // Calcular movimento em pixels primeiro, depois converter para grid
    const deltaXPx = e.clientX - dragState.startMouse.x;
    const deltaYPx = e.clientY - dragState.startMouse.y;

    if (dragState.isDragging) {
      // Movimento mais suave para drag
      const deltaX = Math.round(deltaXPx / GRID_SIZE);
      const deltaY = Math.round(deltaYPx / GRID_SIZE);

      const newPosition = {
        x: Math.max(0, Math.min(gridSize.width - dragState.startSize.width, dragState.startPosition.x + deltaX)),
        y: Math.max(0, Math.min(gridSize.height - dragState.startSize.height, dragState.startPosition.y + deltaY)),
      };

      const isValid = validateChartPosition(
        newPosition,
        dragState.startSize,
        dragState.draggedChart
      );

      setDragState(prev => ({
        ...prev,
        currentPosition: newPosition,
        isValid
      }));

      if (isValid) {
        setDashboardCharts(prev => prev.map(chart =>
          chart.chartId === dragState.draggedChart
            ? { ...chart, position: newPosition }
            : chart
        ));
      }
    } else if (dragState.isResizing) {
      // Resize mais responsivo
      const deltaX = Math.round(deltaXPx / GRID_SIZE);
      const deltaY = Math.round(deltaYPx / GRID_SIZE);

      let newSize = {
        width: Math.max(MIN_CHART_SIZE.width, dragState.startSize.width + deltaX),
        height: Math.max(MIN_CHART_SIZE.height, dragState.startSize.height + deltaY),
      };

      const chart = dashboardCharts.find(c => c.chartId === dragState.draggedChart);
      if (chart) {
        // Limitar pelo grid
        const maxWidth = gridSize.width - chart.position.x;
        const maxHeight = gridSize.height - chart.position.y;
        
        newSize = {
          width: Math.min(Math.min(newSize.width, maxWidth), MAX_CHART_SIZE.width),
          height: Math.min(Math.min(newSize.height, maxHeight), MAX_CHART_SIZE.height)
        };

        const isValid = validateChartPosition(
          chart.position,
          newSize,
          dragState.draggedChart
        );

        setDragState(prev => ({
          ...prev,
          currentSize: newSize,
          isValid
        }));

        if (isValid) {
          setDashboardCharts(prev => prev.map(chart =>
            chart.chartId === dragState.draggedChart
              ? { ...chart, size: newSize }
              : chart
          ));
        }
      }
    }
  }, [dragState, gridSize, validateChartPosition, dashboardCharts]);

  const handleMouseUp = useCallback(async () => {
    if (!dragState.isDragging && !dragState.isResizing) return;
    if (!dragState.draggedChart) return;

    const chart = dashboardCharts.find(c => c.chartId === dragState.draggedChart);
    if (chart && dragState.isValid !== false) {
      // Verificar se houve mudança real
      const hasPositionChanged = chart.position.x !== dragState.startPosition.x || chart.position.y !== dragState.startPosition.y;
      const hasSizeChanged = chart.size.width !== dragState.startSize.width || chart.size.height !== dragState.startSize.height;
      
      if (hasPositionChanged || hasSizeChanged) {
        // Usar debounced save para evitar múltiplos salvamentos
        debouncedSave(dragState.draggedChart, chart.position, chart.size);
      }
    }

    // Limpar estado de drag imediatamente
    setDragState({
      isDragging: false,
      isResizing: false,
      draggedChart: null,
      startPosition: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
      startMouse: { x: 0, y: 0 },
      currentPosition: undefined,
      currentSize: undefined,
      isValid: undefined
    });
  }, [dragState, dashboardCharts, debouncedSave]);

  // Event listeners para mouse
  useEffect(() => {
    if (dragState.isDragging || dragState.isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.isResizing, handleMouseMove, handleMouseUp]);

  // Cleanup do timeout ao desmontar
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Limpar mudanças pendentes
      pendingChangesRef.current.clear();
    };
  }, []);

  // Aviso antes de sair com mudanças não salvas
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Adicionar gráfico ao dashboard
  const handleAddChart = async (chartId: string) => {
    if (!currentDashboard) return;

    try {
      const position = findNextAvailablePosition({ width: 4, height: 3 });
      if (position) {
        const chartData = await getChart(chartId);
        const newChart = {
          chartId,
          position,
          size: { width: 4, height: 3 },
          title: chartData?.name || 'Gráfico',
          settings: {}
        };

        // Atualizar localmente primeiro
        const updatedCharts = [...dashboardCharts, { ...newChart, chartData }];
        setDashboardCharts(updatedCharts);

        // Atualizar estado local do dashboard
        setCurrentDashboard(prev => prev ? {
          ...prev,
          charts: [...(prev.charts || []), newChart]
        } : null);

        // Salvar no banco de forma manual para adição
        setIsSaving(true);
        try {
          await updateDashboard(currentDashboard.id, {
            charts: [...(currentDashboard.charts || []), newChart]
          });
        } finally {
          setIsSaving(false);
        }
      } else {
        console.warn('Não há espaço disponível no dashboard');
      }
    } catch (error) {
      console.error('Erro ao adicionar gráfico:', error);
    }
    setShowAddChart(false);
  };

  // Remover gráfico do dashboard
  const handleRemoveChart = async (chartId: string) => {
    if (!currentDashboard) return;
    
    // Atualizar localmente primeiro
    const updatedCharts = dashboardCharts.filter(chart => chart.chartId !== chartId);
    setDashboardCharts(updatedCharts);
    
    // Atualizar estado do dashboard
    setCurrentDashboard(prev => prev ? {
      ...prev,
      charts: prev.charts.filter(chart => chart.chartId !== chartId)
    } : null);
    
    setSelectedChart(null);
    
    // Salvar no banco
    setIsSaving(true);
    try {
      await updateDashboard(currentDashboard.id, {
        charts: currentDashboard.charts.filter(chart => chart.chartId !== chartId)
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Salvar mudanças pendentes imediatamente
  const saveNow = useCallback(async () => {
    if (!currentDashboard || pendingChangesRef.current.size === 0) return;

    // Cancelar salvamento agendado
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    setIsSaving(true);
    try {
      const dashboard = await getDashboard(currentDashboard.id);
      if (dashboard) {
        const updatedCharts = dashboard.charts.map((chart: any) => {
          const pendingChange = pendingChangesRef.current.get(chart.chartId);
          if (pendingChange) {
            return { ...chart, ...pendingChange };
          }
          return chart;
        });

        await updateDashboard(currentDashboard.id, {
          charts: updatedCharts
        });

        pendingChangesRef.current.clear();
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setIsSaving(false);
    }
  }, [currentDashboard, updateDashboard, getDashboard]);

  // Salvar dashboard
  const handleSaveDashboard = async () => {
    if (!currentDashboard) return;
    
    // Salvar mudanças pendentes primeiro
    if (hasUnsavedChanges) {
      await saveNow();
    }
    
    setIsEditMode(false);
  };

  // Renderizar grid de fundo
  const renderGrid = () => {
    const gridLines = [];
    
    // Linhas verticais
    for (let i = 0; i <= gridSize.width; i++) {
      gridLines.push(
        <line
          key={`v-${i}`}
          x1={i * GRID_SIZE}
          y1={0}
          x2={i * GRID_SIZE}
          y2={gridSize.height * GRID_SIZE}
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={isEditMode ? 0.5 : 0}
        />
      );
    }
    
    // Linhas horizontais
    for (let i = 0; i <= gridSize.height; i++) {
      gridLines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * GRID_SIZE}
          x2={gridSize.width * GRID_SIZE}
          y2={i * GRID_SIZE}
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={isEditMode ? 0.5 : 0}
        />
      );
    }

    return (
      <svg
        className="absolute inset-0 pointer-events-none"
        width={gridSize.width * GRID_SIZE}
        height={gridSize.height * GRID_SIZE}
      >
        {gridLines}
      </svg>
    );
  };

  if (!currentDashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentDashboard.name}
              </h1>
              {currentDashboard.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {currentDashboard.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <button
                  onClick={() => setShowAddChart(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Gráfico
                </button>
                {/* Status de salvamento */}
                <SaveStatus
                  isSaving={isSaving}
                  hasUnsavedChanges={hasUnsavedChanges}
                  onSaveNow={saveNow}
                />
                
                <button
                  onClick={handleSaveDashboard}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {hasUnsavedChanges ? 'Salvar e Concluir' : 'Concluir'}
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Editar
              </button>
            )}
            
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Canvas */}
      <div className="flex-1 overflow-auto p-6">
        <div
          ref={containerRef}
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          style={{
            width: gridSize.width * GRID_SIZE,
            height: gridSize.height * GRID_SIZE,
            minWidth: '100%',
          }}
        >
          {renderGrid()}
          
          {/* Charts */}
          {dashboardCharts.map((dashboardChart) => {
            const isDragging = dragState.isDragging && dragState.draggedChart === dashboardChart.chartId;
            const isResizing = dragState.isResizing && dragState.draggedChart === dashboardChart.chartId;
            const isBeingManipulated = isDragging || isResizing;
            
            return (
            <div
              key={dashboardChart.chartId}
              className={`absolute border-2 rounded-lg bg-white dark:bg-gray-700 shadow-sm transition-all duration-200 ${
                selectedChart === dashboardChart.chartId
                  ? 'border-blue-500 shadow-lg'
                  : 'border-gray-200 dark:border-gray-600'
              } ${
                isBeingManipulated ? 'opacity-80 shadow-2xl border-blue-600' : ''
              } ${
                dragState.isValid === false && isBeingManipulated ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : ''
              }`}
              style={{
                left: dashboardChart.position.x * GRID_SIZE,
                top: dashboardChart.position.y * GRID_SIZE,
                width: dashboardChart.size.width * GRID_SIZE,
                height: dashboardChart.size.height * GRID_SIZE,
                transform: isBeingManipulated ? 'scale(1.02)' : 'scale(1)',
                zIndex: isBeingManipulated ? 20 : selectedChart === dashboardChart.chartId ? 10 : 1,
              }}
              onClick={() => setSelectedChart(dashboardChart.chartId)}
            >
              {/* Chart Header */}
              {isEditMode && (
                <div 
                  className="absolute top-0 left-0 right-0 bg-gray-50 dark:bg-gray-600 px-3 py-2 rounded-t-lg border-b border-gray-200 dark:border-gray-500 flex items-center justify-between cursor-move"
                  onMouseDown={(e) => handleMouseDown(e, dashboardChart.chartId, 'drag')}
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                    {dashboardChart.title || dashboardChart.chartData?.name || 'Gráfico'}
                  </span>
                  <div className="flex gap-1">
                    <Move className="w-3 h-3 text-gray-400" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveChart(dashboardChart.chartId);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Chart Content */}
              <div 
                className={`p-4 h-full ${isEditMode ? 'pt-12' : ''}`}
                style={{ overflow: 'hidden' }}
              >
                {dashboardChart.chartData ? (
                  <UniversalChartRenderer
                    chartType={dashboardChart.chartData.chartType}
                    data={dashboardChart.chartData.data}
                    settings={{
                      ...dashboardChart.chartData.settings,
                      width: dashboardChart.size.width * GRID_SIZE - 32,
                      height: (dashboardChart.size.height * GRID_SIZE) - (isEditMode ? 80 : 32),
                    }}
                    dimensions={{
                      width: dashboardChart.size.width * GRID_SIZE - 32,
                      height: (dashboardChart.size.height * GRID_SIZE) - (isEditMode ? 80 : 32),
                      margin: {
                        top: 10,
                        right: 10,
                        bottom: 10,
                        left: 10
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <BarChart3 className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Resize Handles */}
              {isEditMode && selectedChart === dashboardChart.chartId && (
                <>
                  {/* Corner resize handle */}
                  <div 
                    className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-80 hover:opacity-100 transform translate-x-2 translate-y-2 shadow-lg border-2 border-white"
                    style={{
                      clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
                    }}
                    onMouseDown={(e) => handleMouseDown(e, dashboardChart.chartId, 'resize')}
                    title="Redimensionar (arrastar o canto)"
                  />
                  
                  {/* Right edge handle */}
                  <div 
                    className="absolute right-0 top-1/2 w-1 h-8 bg-blue-500 cursor-e-resize opacity-60 hover:opacity-100 transform translate-x-1 -translate-y-1/2"
                    onMouseDown={(e) => handleMouseDown(e, dashboardChart.chartId, 'resize')}
                    title="Redimensionar largura"
                  />
                  
                  {/* Bottom edge handle */}
                  <div 
                    className="absolute bottom-0 left-1/2 w-8 h-1 bg-blue-500 cursor-s-resize opacity-60 hover:opacity-100 transform -translate-x-1/2 translate-y-1"
                    onMouseDown={(e) => handleMouseDown(e, dashboardChart.chartId, 'resize')}
                    title="Redimensionar altura"
                  />
                  
                  {/* Visual corner indicator lines */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none">
                    <div className="absolute bottom-0 right-1 w-1 h-1 bg-blue-300 rounded-full"></div>
                    <div className="absolute bottom-1 right-0 w-1 h-1 bg-blue-300 rounded-full"></div>
                  </div>
                  
                  {/* Size indicator during resize */}
                  {isResizing && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
                      {dashboardChart.size.width} × {dashboardChart.size.height}
                    </div>
                  )}
                </>
              )}
            </div>
            );
          })}

          {/* Empty State */}
          {dashboardCharts.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Seu dashboard está vazio
                </p>
                {isEditMode && (
                  <button
                    onClick={() => setShowAddChart(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Primeiro Gráfico
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Adicionar Gráfico */}
      <Modal
        isOpen={showAddChart}
        onClose={() => setShowAddChart(false)}
        title="Adicionar Gráfico ao Dashboard"
      >
        <div className="space-y-4">
          {savedCharts.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum gráfico salvo disponível
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {savedCharts.map((chart) => (
                <div
                  key={chart.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleAddChart(chart.id)}
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {chart.name}
                  </h3>
                  {chart.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {chart.description}
                    </p>
                  )}
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                    {chart.chartType}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de Configurações */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Configurações do Dashboard"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Dashboard
            </label>
            <input
              type="text"
              value={currentDashboard.name}
              onChange={(e) => setCurrentDashboard({ ...currentDashboard, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={currentDashboard.description || ''}
              onChange={(e) => setCurrentDashboard({ ...currentDashboard, description: e.target.value })}
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
                value={gridSize.width}
                onChange={(e) => setGridSize({ ...gridSize, width: parseInt(e.target.value) })}
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
                value={gridSize.height}
                onChange={(e) => setGridSize({ ...gridSize, height: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                if (currentDashboard) {
                  await updateDashboard(currentDashboard.id, {
                    name: currentDashboard.name,
                    description: currentDashboard.description,
                    layout: {
                      columns: gridSize.width,
                      rows: gridSize.height,
                      gap: 16,
                    },
                  });
                  await loadDashboard(currentDashboard.id);
                }
                setShowSettings(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardBuilder;