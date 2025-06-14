import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import UniversalChartRenderer from '../components/charts/UniversalChartRenderer';
import ChartTypeSelectorModal from '../components/shared/ChartTypeSelectorModal';
import ExportModal from '../components/shared/ExportModal';
import CSVImporter from '../components/data/CSVImporter';
import UniversalImporter from '../components/data/UniversalImporter';
import Toolbar from '../components/layout/Toolbar';
import SaveViewModal from '../components/shared/SaveViewModal';
import SavedViewsManager from '../components/shared/SavedViewsManager';
import { useFileOperations } from '../hooks/useFileOperations';
import { useNotifications } from '../hooks/useNotifications';
import { useSavedViews } from '../hooks/useSavedViews';
import { useSavedCharts } from '../hooks/useSavedCharts';
import { useChartDimensions } from '../hooks/useChartDimensions';
import type { DataRow, ChartSettings, ChartType, ChartData, SankeyData } from '../types';
import { defaultSettings, initialData } from '../utils/constants';
import { getSampleDataForChartType, getSankeySampleData } from '../utils/sampleData';

const ChartCreatorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Core state
  const [data, setData] = useState<DataRow[]>(initialData);
  const [sankeyData, setSankeyData] = useState<SankeyData>(getSankeySampleData());
  const [settings, setSettings] = useState<ChartSettings>(defaultSettings);
  const [selectedChartType, setSelectedChartType] = useState<ChartType>('waterfall');
  const [chartName, setChartName] = useState('');
  const [chartDescription, setChartDescription] = useState('');

  // UI state
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [showUniversalImporter, setShowUniversalImporter] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showViewsManager, setShowViewsManager] = useState(false);
  const [showChartSettings, setShowChartSettings] = useState(false);
  const [showChartTypeSelector, setShowChartTypeSelector] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const chartRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const { notifySuccess, notifyError } = useNotifications();
  const { saveView } = useSavedViews();
  const { saveChart, updateChart, getChart } = useSavedCharts();
  const dimensions = useChartDimensions(data, settings);

  const {
    handleFileUpload,
    exportAsPNG,
    exportAsSVG,
    exportAsJSON,
    exportAsHTML
  } = useFileOperations({
    data: data,
    settings,
    onDataChange: setData,
    chartRef
  });

  // Load existing chart if editing
  useEffect(() => {
    if (isEditing && id) {
      const loadChart = async () => {
        setIsLoading(true);
        try {
          const chart = await getChart(id);
          if (chart) {
            setChartName(chart.name);
            setChartDescription(chart.description || '');
            setSelectedChartType(chart.chartType as ChartType);
            
            if (chart.chartType === 'sankey') {
              setSankeyData(chart.data as SankeyData);
              setData([]);
            } else {
              setData(chart.data as DataRow[]);
            }
            
            setSettings(chart.settings);
            
            notifySuccess('Gráfico carregado', `"${chart.name}" carregado para edição`);
          }
        } catch (error) {
          notifyError('Erro ao carregar gráfico', 'Não foi possível carregar o gráfico');
          navigate('/charts');
        } finally {
          setIsLoading(false);
        }
      };
      
      loadChart();
    }
  }, [id, isEditing]);

  // Create chart data object for UniversalChartRenderer
  const chartData: ChartData = {
    type: selectedChartType,
    waterfall: data,
    sankey: sankeyData,
    stackedBar: data,
    line: data,
    area: data,
  };

  // Handle chart type change
  const handleChartTypeChange = (newType: ChartType) => {
    if (newType === 'sankey') {
      const newSankeyData = getSankeySampleData();
      setSankeyData(newSankeyData);
      setData([]);
    } else {
      const newSampleData = getSampleDataForChartType(newType);
      setData(newSampleData);
    }
    
    setSelectedChartType(newType);
    setSettings(defaultSettings);
    
    notifySuccess(`Tipo de gráfico alterado`, `Alterado para ${newType}`);
  };

  // Handle loading sample data
  const handleLoadSampleData = (chartType: ChartType) => {
    if (chartType === 'sankey') {
      const newSankeyData = getSankeySampleData();
      setSankeyData(newSankeyData);
      setData([]);
    } else {
      const sampleData = getSampleDataForChartType(chartType);
      setData(sampleData);
      setSettings(defaultSettings);
    }
    
    notifySuccess('Dados de exemplo carregados', `Dados de exemplo para ${chartType} foram carregados`);
  };

  // Save chart
  const handleSaveChart = async () => {
    if (!chartName.trim()) {
      notifyError('Nome obrigatório', 'Por favor, digite um nome para o gráfico');
      return;
    }

    try {
      const chartDataToSave = {
        name: chartName,
        description: chartDescription,
        chartType: selectedChartType,
        data: selectedChartType === 'sankey' ? sankeyData : data,
        settings,
        tags: [selectedChartType, 'custom'],
      };

      if (isEditing && id) {
        await updateChart(id, chartDataToSave);
        notifySuccess('Gráfico atualizado', `"${chartName}" foi atualizado com sucesso`);
      } else {
        const newId = await saveChart(chartDataToSave);
        notifySuccess('Gráfico salvo', `"${chartName}" foi salvo com sucesso`);
        navigate(`/charts/${newId}/edit`);
      }
    } catch (error) {
      notifyError('Erro ao salvar', 'Não foi possível salvar o gráfico');
    }
  };

  // File upload handler
  const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await handleFileUpload(file);
      
      if (result.shouldOpenCSVImporter) {
        setShowCSVImporter(true);
      } else if (result.success) {
        notifySuccess('Arquivo importado', `Dados carregados de ${file.name}`);
      }
    } catch (error) {
      notifyError('Erro na importação', 'Não foi possível importar o arquivo');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Export handlers
  const handleExportPNG = async () => {
    try {
      await exportAsPNG();
      notifySuccess('PNG exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar PNG');
    }
  };

  const handleExportSVG = () => {
    try {
      exportAsSVG();
      notifySuccess('SVG exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar SVG');
    }
  };

  const handleExportJSON = () => {
    try {
      exportAsJSON();
      notifySuccess('JSON exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar JSON');
    }
  };

  const handleExportHTML = () => {
    try {
      exportAsHTML();
      notifySuccess('HTML exportado com sucesso');
    } catch (error) {
      notifyError('Erro na exportação', 'Falha ao exportar HTML');
    }
  };

  const handleCSVImported = (importedData: DataRow[]) => {
    setData(importedData);
    setShowCSVImporter(false);
    notifySuccess('CSV importado', `${importedData.length} linhas importadas`);
  };

  const handleUniversalDataImported = (importedData: DataRow[] | SankeyData) => {
    if (selectedChartType === 'sankey') {
      setSankeyData(importedData as SankeyData);
      setData([]);
      notifySuccess('Dados Sankey importados', `${(importedData as SankeyData).nodes.length} nós e ${(importedData as SankeyData).links.length} conexões`);
    } else {
      const dataArray = importedData as DataRow[];
      setData(dataArray);
      notifySuccess('Dados importados', `${dataArray.length} linhas importadas`);
    }
    setShowUniversalImporter(false);
  };

  const handleSaveView = async (name: string, description: string, thumbnail?: string) => {
    try {
      await saveView(name, description, data, settings, thumbnail);
      notifySuccess('Visualização salva', `"${name}" foi salva com sucesso`);
    } catch (error) {
      notifyError('Erro ao salvar visualização', 'Não foi possível salvar a visualização');
    }
  };

  const handleLoadView = (viewData: DataRow[], viewSettings: ChartSettings) => {
    setData(viewData);
    setSettings(viewSettings);
    notifySuccess('Visualização carregada', 'Dados e configurações foram aplicados');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              onClick={() => navigate('/charts')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Voltar aos Gráficos</span>
            </button>
            <div className="h-6 border-l border-gray-300 dark:border-gray-600"></div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Editar Gráfico' : 'Novo Gráfico'}
            </h1>
          </div>

          <button
            onClick={handleSaveChart}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Atualizar' : 'Salvar'}</span>
          </button>
        </div>

        {/* Chart Name and Description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Gráfico *
            </label>
            <input
              type="text"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              placeholder="Digite o nome do gráfico"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <input
              type="text"
              value={chartDescription}
              onChange={(e) => setChartDescription(e.target.value)}
              placeholder="Descrição opcional"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Main Chart Area */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                onImportCSV={() => {
                  if (selectedChartType === 'sankey') {
                    setShowUniversalImporter(true);
                  } else {
                    setShowCSVImporter(true);
                  }
                }}
                onShowExportModal={() => setShowExportModal(true)}
                onSaveView={() => setShowSaveModal(true)}
                onManageViews={() => setShowViewsManager(true)}
                onShowChartSettings={() => setShowChartSettings(true)}
                onShowChartTypeSelector={() => setShowChartTypeSelector(true)}
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
        </div>
      </div>

      {/* Modals */}
      {showCSVImporter && (
        <CSVImporter
          open={showCSVImporter}
          onClose={() => setShowCSVImporter(false)}
          onDataImported={handleCSVImported}
        />
      )}

      {showUniversalImporter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <UniversalImporter
              chartType={selectedChartType}
              onDataImported={handleUniversalDataImported}
              onClose={() => setShowUniversalImporter(false)}
              className="w-full"
            />
          </div>
        </div>
      )}

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

      {showViewsManager && (
        <SavedViewsManager
          isOpen={showViewsManager}
          onClose={() => setShowViewsManager(false)}
          onLoadView={handleLoadView}
          onCreateNew={() => setShowViewsManager(false)}
        />
      )}

      {showChartTypeSelector && (
        <ChartTypeSelectorModal
          isOpen={showChartTypeSelector}
          onClose={() => setShowChartTypeSelector(false)}
          selectedType={selectedChartType}
          onTypeChange={handleChartTypeChange}
          onLoadSampleData={handleLoadSampleData}
        />
      )}

      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportJSON={handleExportJSON}
          onExportHTML={handleExportHTML}
        />
      )}
    </div>
  );
};

export default ChartCreatorPage;