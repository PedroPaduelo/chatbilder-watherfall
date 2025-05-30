import { useState, useRef, useEffect } from 'react';
import UniversalChartRenderer from './components/UniversalChartRenderer';
import ChartTypeSelector from './components/ChartTypeSelector';
import DataEditor from './components/DataEditor';
import CSVImporter from './components/CSVImporter';
import Toolbar from './components/Toolbar';
import SaveViewModal from './components/SaveViewModal';
import SavedViewsManager from './components/SavedViewsManager';
import FilterPanel from './components/FilterPanel';
import AnnotationsManager, { type Annotation } from './components/AnnotationsManager';
import MetricsDashboard from './components/MetricsDashboard';
import ThemeSelector from './components/ThemeSelector';
import { NotificationContainer } from './components/Notification';
import { useFileOperations } from './hooks/useFileOperations';
import { useNotifications } from './hooks/useNotifications';
import { useSavedViews } from './hooks/useSavedViews';
import { useTheme } from './hooks/useTheme';
import { useChartDimensions } from './hooks/useChartDimensions';
import type { DataRow, ChartSettings, ChartType, ChartData, SankeyData } from './types';
import { defaultSettings, initialData } from './utils/constants';
import { getSampleDataForChartType, getSankeySampleData } from './utils/sampleData';

const App = () => {
  // Core state
  const [data, setData] = useState<DataRow[]>(initialData);
  const [filteredData, setFilteredData] = useState<DataRow[]>(initialData);
  const [sankeyData, setSankeyData] = useState<SankeyData>(getSankeySampleData());
  const [settings, setSettings] = useState<ChartSettings>(defaultSettings);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('waterfall');
  
  // UI state
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showViewsManager, setShowViewsManager] = useState(false);
  const [showChartSettings, setShowChartSettings] = useState(false);
  const [activeView, setActiveView] = useState<'chart' | 'dashboard'>('chart');
  
  // Refs
  const chartRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { notifications, notifySuccess, notifyError, removeNotification } = useNotifications();
  const { saveView } = useSavedViews();
  const { resolvedTheme } = useTheme();
  const dimensions = useChartDimensions(filteredData, settings);
  
  const {
    handleFileUpload,
    exportAsPNG,
    exportAsSVG,
    exportAsJSON,
    exportAsHTML
  } = useFileOperations({
    data: filteredData,
    settings,
    onDataChange: setData,
    chartRef
  });

  // Create chart data object for UniversalChartRenderer
  const chartData: ChartData = {
    type: selectedChartType,
    waterfall: filteredData,
    sankey: sankeyData,
    stackedBar: filteredData,
    line: filteredData,
    area: filteredData,
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S - Save view
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveModal(true);
      }
      
      // Ctrl/Cmd + O - Open views manager
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        setShowViewsManager(true);
      }
      
      // Ctrl/Cmd + I - Import CSV
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        setShowCSVImporter(true);
      }
      
      // Ctrl/Cmd + E - Export PNG
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        handleExportPNG();
      }
      
      // Tab - Switch between chart and dashboard
      if (e.key === 'Tab' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setActiveView(prev => prev === 'chart' ? 'dashboard' : 'chart');
        }
      }

      // Number keys 1-5 for quick chart type switching
      if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement?.tagName !== 'INPUT' && activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          const chartTypes: ChartType[] = ['waterfall', 'sankey', 'stacked-bar', 'line', 'area'];
          const index = parseInt(e.key) - 1;
          if (chartTypes[index]) {
            setSelectedChartType(chartTypes[index]);
            notifySuccess(`Tipo de gráfico alterado`, `Alterado para ${chartTypes[index]}`);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // File upload handler with error handling
  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await handleFileUpload(file);
      
      if (result.shouldOpenCSVImporter) {
        setShowCSVImporter(true);
      } else if (result.success) {
        notifySuccess('File imported successfully', `Data loaded from ${file.name}`);
      }
    } catch (error) {
      notifyError(
        'Import failed', 
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Export handlers with error handling
  const handleExportPNG = async () => {
    try {
      await exportAsPNG();
      notifySuccess('PNG exported successfully');
    } catch (error) {
      notifyError(
        'Export failed',
        error instanceof Error ? error.message : 'Failed to export PNG'
      );
    }
  };

  const handleExportSVG = () => {
    try {
      exportAsSVG();
      notifySuccess('SVG exported successfully');
    } catch (error) {
      notifyError(
        'Export failed',
        error instanceof Error ? error.message : 'Failed to export SVG'
      );
    }
  };

  const handleExportJSON = () => {
    try {
      exportAsJSON();
      notifySuccess('JSON exported successfully');
    } catch (error) {
      notifyError(
        'Export failed',
        error instanceof Error ? error.message : 'Failed to export JSON'
      );
    }
  };

  const handleExportHTML = () => {
    try {
      exportAsHTML();
      notifySuccess('HTML exported successfully');
    } catch (error) {
      notifyError(
        'Export failed',
        error instanceof Error ? error.message : 'Failed to export HTML'
      );
    }
  };

  const handleCSVImported = (importedData: DataRow[]) => {
    setData(importedData);
    setShowCSVImporter(false);
    notifySuccess('CSV imported successfully', `${importedData.length} rows imported`);
  };

  // Saved Views handlers
  const handleSaveView = async (name: string, description: string, thumbnail?: string) => {
    try {
      await saveView(name, description, filteredData, settings, thumbnail);
      notifySuccess('Visualização salva com sucesso', `"${name}" foi salva e pode ser acessada em Minhas Views`);
    } catch (error) {
      notifyError(
        'Erro ao salvar visualização',
        error instanceof Error ? error.message : 'Erro desconhecido'
      );
    }
  };

  const handleLoadView = (viewData: DataRow[], viewSettings: ChartSettings) => {
    setData(viewData);
    setSettings(viewSettings);
    notifySuccess('Visualização carregada', 'Dados e configurações foram aplicados');
  };

  const handleCreateNewView = () => {
    setShowViewsManager(false);
    notifySuccess('Criando nova visualização', 'Configure seus dados e configurações, depois clique em Salvar');
  };

  // Handler para mudança de tipo de gráfico (resetar dados)
  const handleChartTypeChange = (newType: ChartType) => {
    if (newType === 'sankey') {
      // Para Sankey, carregar dados específicos
      const newSankeyData = getSankeySampleData();
      setSankeyData(newSankeyData);
      setData([]); // Limpar dados de tabela para Sankey
      setFilteredData([]);
    } else {
      // Para outros tipos, resetar dados para o padrão do novo tipo de gráfico
      const newSampleData = getSampleDataForChartType(newType);
      setData(newSampleData);
      setFilteredData(newSampleData);
    }
    
    setSelectedChartType(newType);
    
    // Limpar anotações
    setAnnotations([]);
    
    // Resetar configurações para o padrão
    setSettings(defaultSettings);
    
    // Notificar o usuário
    notifySuccess(
      `Tipo de gráfico alterado`, 
      `Alterado para ${newType} com dados de exemplo. Use "Ver Exemplo" para entender o formato dos dados.`
    );
  };

  // Handler para carregar dados de exemplo
  const handleLoadSampleData = (chartType: ChartType) => {
    if (chartType === 'sankey') {
      // Para Sankey, usar dados específicos
      const newSankeyData = getSankeySampleData();
      setSankeyData(newSankeyData);
      setData([]); // Limpar dados de tabela para Sankey
      setFilteredData([]);
      
      notifySuccess(
        'Dados de exemplo carregados', 
        `Dados de exemplo para ${chartType} foram carregados`
      );
    } else {
      const sampleData = getSampleDataForChartType(chartType);
      setData(sampleData);
      setFilteredData(sampleData);
      
      // Resetar anotações e configurações
      setAnnotations([]);
      setSettings(defaultSettings);
      
      notifySuccess(
        'Dados de exemplo carregados', 
        `Dados de exemplo para ${chartType} foram carregados. Examine a estrutura dos dados no editor abaixo.`
      );
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      resolvedTheme === 'dark' 
        ? 'bg-gray-900' 
        : 'bg-gray-100'
    }`}>
      <div className="w-full px-4">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Universal Chart Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create professional charts with advanced analytics - Waterfall, Sankey, Line, Area & more
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeSelector />
              
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setActiveView('chart')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeView === 'chart'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Gráfico
                </button>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeView === 'dashboard'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Chart Type and Filters */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            {/* Chart Type Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <ChartTypeSelector
                selectedType={selectedChartType}
                onTypeChange={handleChartTypeChange}
                onLoadSampleData={handleLoadSampleData}
              />
            </div>
            
            <FilterPanel 
              data={data}
              onFilteredDataChange={setFilteredData}
            />
            
            <AnnotationsManager
              data={filteredData}
              annotations={annotations}
              onAnnotationsChange={setAnnotations}
            />
          </div>

          {/* Main Content Area - Chart/Dashboard (expande para ocupar o espaço do painel removido) */}
          <div className="lg:col-span-10 xl:col-span-10 space-y-6">
            {activeView === 'dashboard' ? (
              <MetricsDashboard 
                data={filteredData} 
                settings={settings}
                className="animate-fade-in"
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Chart Preview - {selectedChartType.charAt(0).toUpperCase() + selectedChartType.slice(1)}
                  </h2>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={onFileUpload}
                    className="hidden"
                  />
                  
                  {/* Toolbar */}
                  <Toolbar
                    chartType={selectedChartType}
                    onImportCSV={() => setShowCSVImporter(true)}
                    onExportPNG={handleExportPNG}
                    onExportSVG={handleExportSVG}
                    onExportJSON={handleExportJSON}
                    onExportHTML={handleExportHTML}
                    onSaveView={() => setShowSaveModal(true)}
                    onManageViews={() => setShowViewsManager(true)}
                    onShowChartSettings={() => setShowChartSettings(true)}
                  />
                </div>
                
                <div ref={chartRef} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
                  <UniversalChartRenderer
                    chartType={selectedChartType}
                    data={chartData}
                    settings={settings}
                    dimensions={dimensions}
                    onDataChange={setData}
                    onSettingsChange={setSettings}
                    isConfigModalOpen={showChartSettings}
                    onConfigModalClose={() => setShowChartSettings(false)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Removido painel lateral de configurações */}
        </div>

        {/* Data Editor - Full Width */}
        <div className="mt-6">
          <DataEditor data={data} onDataChange={setData} />
        </div>

        {/* Modals */}
        {showCSVImporter && (
          <CSVImporter
            open={showCSVImporter}
            onClose={() => setShowCSVImporter(false)}
            onDataImported={handleCSVImported}
          />
        )}

        {showSaveModal && (
          <SaveViewModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSaveView}
            data={filteredData}
            settings={settings}
            chartRef={chartRef}
          />
        )}

        {showViewsManager && (
          <SavedViewsManager
            isOpen={showViewsManager}
            onClose={() => setShowViewsManager(false)}
            onLoadView={handleLoadView}
            onCreateNew={handleCreateNewView}
          />
        )}

        {/* Notifications */}
        <NotificationContainer
          notifications={notifications}
          onClose={removeNotification}
        />

        {/* Keyboard Shortcuts Help */}
        <div className="fixed bottom-4 left-4 z-40">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 text-xs text-gray-600 dark:text-gray-400 opacity-75 hover:opacity-100 transition-opacity">
            <div className="font-medium mb-1">Atalhos:</div>
            <div>Ctrl+S: Salvar | Ctrl+O: Abrir | Ctrl+I: Importar | Ctrl+E: Exportar</div>
            <div>Tab: Alternar vista | 1-5: Tipos de gráfico</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;