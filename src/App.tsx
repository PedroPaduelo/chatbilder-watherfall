import { useState, useRef } from 'react';
import WaterfallChart from './components/WaterfallChart';
import DataEditor from './components/DataEditor';
import SettingsPanel from './components/SettingsPanel';
import CSVImporter from './components/CSVImporter';
import Toolbar from './components/Toolbar';
import SaveViewModal from './components/SaveViewModal';
import SavedViewsManager from './components/SavedViewsManager';
import { NotificationContainer } from './components/Notification';
import { useFileOperations } from './hooks/useFileOperations';
import { useNotifications } from './hooks/useNotifications';
import { useSavedViews } from './hooks/useSavedViews';
import type { DataRow, ChartSettings } from './types';
import { defaultSettings, initialData } from './utils/constants';

const App = () => {
  const [data, setData] = useState<DataRow[]>(initialData);
  const [settings, setSettings] = useState<ChartSettings>(defaultSettings);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showViewsManager, setShowViewsManager] = useState(false);
  
  const chartRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { notifications, notifySuccess, notifyError, removeNotification } = useNotifications();
  const { saveView } = useSavedViews();
  
  const {
    handleFileUpload,
    exportAsPNG,
    exportAsSVG,
    exportAsJSON,
    exportAsHTML
  } = useFileOperations({
    data,
    settings,
    onDataChange: setData,
    chartRef
  });

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
      await saveView(name, description, data, settings, thumbnail);
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
    // Optionally reset to default data or show a creation wizard
    notifySuccess('Criando nova visualização', 'Configure seus dados e configurações, depois clique em Salvar');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Waterfall Chart Builder
          </h1>
          <p className="text-gray-600">
            Create professional waterfall charts with stacked bars support
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Display */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Chart Preview</h2>
              
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
            
            <div ref={chartRef} className="border rounded-lg p-4 bg-gray-50 overflow-hidden">
              <WaterfallChart data={data} settings={settings} />
            </div>
          </div>

          {/* Settings Panel */}
          <div className="lg:col-span-1">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
        </div>

        {/* Data Editor */}
        <div className="mt-6">
          <DataEditor data={data} onDataChange={setData} />
        </div>

        {/* CSV Importer Modal */}
        {showCSVImporter && (
          <CSVImporter
            open={showCSVImporter}
            onClose={() => setShowCSVImporter(false)}
            onDataImported={handleCSVImported}
          />
        )}

        {/* Save View Modal */}
        {showSaveModal && (
          <SaveViewModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            onSave={handleSaveView}
            data={data}
            settings={settings}
            chartRef={chartRef}
          />
        )}

        {/* Saved Views Manager */}
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
      </div>
    </div>
  );
};

export default App;