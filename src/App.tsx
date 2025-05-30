import { useState, useRef, useEffect } from 'react';
import WaterfallChart from './components/WaterfallChart';
import DataEditor from './components/DataEditor';
import SettingsPanel from './components/SettingsPanel';
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
import type { DataRow, ChartSettings } from './types';
import { defaultSettings, initialData } from './utils/constants';

const App = () => {
  // Core state
  const [data, setData] = useState<DataRow[]>(initialData);
  const [filteredData, setFilteredData] = useState<DataRow[]>(initialData);
  const [settings, setSettings] = useState<ChartSettings>(defaultSettings);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedBarId, setSelectedBarId] = useState<string | undefined>();
  
  // UI state
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showViewsManager, setShowViewsManager] = useState(false);
  const [activeView, setActiveView] = useState<'chart' | 'dashboard'>('chart');
  
  // Refs
  const chartRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks
  const { notifications, notifySuccess, notifyError, removeNotification } = useNotifications();
  const { saveView } = useSavedViews();
  const { resolvedTheme } = useTheme();
  
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
                Waterfall Chart Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create professional waterfall charts with advanced analytics
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
          {/* Left Sidebar - Filters and Tools */}
          <div className="lg:col-span-2 xl:col-span-2 space-y-6">
            <FilterPanel 
              data={data}
              onFilteredDataChange={setFilteredData}
            />
            
            <AnnotationsManager
              data={filteredData}
              annotations={annotations}
              onAnnotationsChange={setAnnotations}
              selectedBarId={selectedBarId}
            />
          </div>

          {/* Main Content Area - Chart/Dashboard */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6">
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
                    Chart Preview
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
                    onImportCSV={() => setShowCSVImporter(true)}
                    onFileUpload={() => fileInputRef.current?.click()}
                    onExportPNG={handleExportPNG}
                    onExportSVG={handleExportSVG}
                    onExportJSON={handleExportJSON}
                    onExportHTML={handleExportHTML}
                    onSaveView={() => setShowSaveModal(true)}
                    onManageViews={() => setShowViewsManager(true)}
                  />
                </div>
                
                <div ref={chartRef} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
                  <WaterfallChart 
                    data={filteredData} 
                    settings={settings}
                    onBarSelect={setSelectedBarId}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Settings */}
          <div className="lg:col-span-2 xl:col-span-2">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
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
            <div>Ctrl+S: Salvar | Ctrl+O: Abrir | Ctrl+I: Importar | Ctrl+E: Exportar | Tab: Alternar vista</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;