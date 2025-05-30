import React, { useState, useRef } from 'react';
import { 
  Save, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus,
  Download,
  Upload,
  Trash2,
  Copy,
  Edit3,
  Eye,
  Calendar,
  Tag,
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Layers
} from 'lucide-react';
import { useSavedCharts } from '../hooks/useSavedCharts';
import { SavedChart } from '../services/databaseService';
import Modal from './Modal';

interface SavedChartsManagerProps {
  onSelectChart?: (chart: SavedChart) => void;
  onEditChart?: (chart: SavedChart) => void;
  currentChartData?: {
    name: string;
    description?: string;
    chartType: string;
    data: any;
    settings: any;
    tags?: string[];
  };
}

const chartTypeIcons = {
  waterfall: BarChart3,
  'stacked-bar': Layers,
  line: TrendingUp,
  area: Activity,
  sankey: PieChart,
};

const chartTypeLabels = {
  waterfall: 'Waterfall',
  'stacked-bar': 'Barras Empilhadas',
  line: 'Linha',
  area: 'Área',
  sankey: 'Sankey',
};

export const SavedChartsManager: React.FC<SavedChartsManagerProps> = ({
  onSelectChart,
  onEditChart,
  currentChartData,
}) => {
  const {
    charts,
    loading,
    saveChart,
    updateChart,
    duplicateChart,
    deleteChart,
    searchCharts,
    getChartsStats,
    exportCharts,
    importCharts,
  } = useSavedCharts();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [editingChart, setEditingChart] = useState<SavedChart | null>(null);
  const [saveForm, setSaveForm] = useState({
    name: '',
    description: '',
    tags: [] as string[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stats = getChartsStats();

  // Filtrar gráficos
  const filteredCharts = charts.filter(chart => {
    if (searchText && !chart.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !chart.description?.toLowerCase().includes(searchText.toLowerCase())) {
      return false;
    }
    if (selectedType && chart.chartType !== selectedType) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => chart.tags?.includes(tag))) {
      return false;
    }
    return true;
  });

  // Obter todas as tags únicas
  const allTags = Array.from(new Set(charts.flatMap(chart => chart.tags || [])));

  const handleSaveChart = async () => {
    if (!currentChartData || !saveForm.name.trim()) return;

    try {
      if (editingChart) {
        await updateChart(editingChart.id, {
          name: saveForm.name,
          description: saveForm.description,
          tags: saveForm.tags,
        });
      } else {
        await saveChart({
          ...currentChartData,
          name: saveForm.name,
          description: saveForm.description,
          tags: saveForm.tags,
        });
      }
      
      setShowSaveModal(false);
      setEditingChart(null);
      setSaveForm({ name: '', description: '', tags: [] });
    } catch (error) {
      console.error('Erro ao salvar gráfico:', error);
    }
  };

  const handleEditChart = (chart: SavedChart) => {
    setEditingChart(chart);
    setSaveForm({
      name: chart.name,
      description: chart.description || '',
      tags: chart.tags || [],
    });
    setShowSaveModal(true);
  };

  const handleImportCharts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importCharts(file);
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

  const ChartIcon = ({ type }: { type: string }) => {
    const Icon = chartTypeIcons[type as keyof typeof chartTypeIcons] || BarChart3;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Header e Estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gráficos Salvos
          </h2>
          <div className="flex gap-2">
            {currentChartData && (
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Salvar Atual
              </button>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Importar
            </button>
            <button
              onClick={exportCharts}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Total de Gráficos</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.recentCount}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Criados esta Semana</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Object.keys(stats.byType).length}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Tipos Diferentes</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.tagsUsed.length}</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Tags Utilizadas</div>
          </div>
        </div>

        {/* Barra de Busca e Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar gráficos..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
            
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

        {/* Filtros Avançados */}
        {showFilters && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Gráfico
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Todos os tipos</option>
                {Object.entries(chartTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {allTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de Gráficos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCharts.length === 0 ? (
          <div className="text-center p-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {charts.length === 0 ? 'Nenhum gráfico salvo ainda' : 'Nenhum gráfico encontrado com os filtros aplicados'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCharts.map(chart => (
              <div
                key={chart.id}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => onSelectChart?.(chart)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ChartIcon type={chart.chartType} />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {chartTypeLabels[chart.chartType as keyof typeof chartTypeLabels]}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditChart?.(chart);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditChart(chart);
                      }}
                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateChart(chart.id);
                      }}
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja excluir este gráfico?')) {
                          deleteChart(chart.id);
                        }
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {chart.name}
                </h3>
                
                {chart.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {chart.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="w-3 h-3" />
                  {formatDate(chart.updatedAt)}
                </div>
                
                {chart.tags && chart.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {chart.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                    {chart.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-600 dark:text-gray-400">
                        +{chart.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-600">
            {filteredCharts.map(chart => (
              <div
                key={chart.id}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => onSelectChart?.(chart)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <ChartIcon type={chart.chartType} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {chart.name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>{chartTypeLabels[chart.chartType as keyof typeof chartTypeLabels]}</span>
                        <span>{formatDate(chart.updatedAt)}</span>
                        {chart.tags && chart.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{chart.tags.length} tags</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditChart?.(chart);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditChart(chart);
                      }}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateChart(chart.id);
                      }}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Tem certeza que deseja excluir este gráfico?')) {
                          deleteChart(chart.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Salvar/Editar */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setEditingChart(null);
          setSaveForm({ name: '', description: '', tags: [] });
        }}
        title={editingChart ? 'Editar Gráfico' : 'Salvar Gráfico'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Gráfico *
            </label>
            <input
              type="text"
              value={saveForm.name}
              onChange={(e) => setSaveForm({ ...saveForm, name: e.target.value })}
              placeholder="Digite o nome do gráfico"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={saveForm.description}
              onChange={(e) => setSaveForm({ ...saveForm, description: e.target.value })}
              placeholder="Descreva o gráfico (opcional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              placeholder="Adicione tags separadas por vírgula"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') {
                  e.preventDefault();
                  const value = e.currentTarget.value.trim();
                  if (value && !saveForm.tags.includes(value)) {
                    setSaveForm({ ...saveForm, tags: [...saveForm.tags, value] });
                    e.currentTarget.value = '';
                  }
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {saveForm.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {saveForm.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      onClick={() => setSaveForm({
                        ...saveForm,
                        tags: saveForm.tags.filter((_, i) => i !== index)
                      })}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => {
                setShowSaveModal(false);
                setEditingChart(null);
                setSaveForm({ name: '', description: '', tags: [] });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveChart}
              disabled={!saveForm.name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingChart ? 'Atualizar' : 'Salvar'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Input de arquivo escondido */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportCharts}
        className="hidden"
      />
    </div>
  );
};