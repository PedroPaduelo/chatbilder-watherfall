import React, { useState, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Eye, 
  Trash2, 
  Download, 
  Upload, 
  Calendar,
  FileText,
  MoreVertical,
  X,
  SortAsc,
  SortDesc,
  Copy
} from 'lucide-react';
import type { DataRow, ChartSettings } from '../types';
import { useSavedViews } from '../hooks/useSavedViews';

interface SavedViewsManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadView: (data: DataRow[], settings: ChartSettings) => void;
  onCreateNew: () => void;
}

type SortBy = 'name' | 'createdAt' | 'updatedAt' | 'dataCount';
type SortOrder = 'asc' | 'desc';

const SavedViewsManager: React.FC<SavedViewsManagerProps> = ({
  isOpen,
  onClose,
  onLoadView,
  onCreateNew
}) => {
  const {
    savedViews,
    loadView,
    deleteView,
    duplicateView,
    exportView,
    importViews,
    clearAllViews,
    error
  } = useSavedViews();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter and sort views
  const filteredAndSortedViews = savedViews
    .filter(view => 
      view.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (view.description && view.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleLoadView = async (viewId: string) => {
    try {
      const view = await loadView(viewId);
      if (view) {
        // Extract waterfall data from ChartData
        const viewData = view.data.waterfall || [];
        onLoadView(viewData, view.settings);
        onClose();
      }
    } catch (error) {
      console.error('Failed to load view:', error);
    }
  };

  const handleDeleteView = async (id: string) => {
    try {
      await deleteView(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete view:', error);
    }
  };

  const handleDuplicateView = async (id: string, name: string) => {
    try {
      await duplicateView(id, `${name} (Cópia)`);
      setShowDropdown(null);
    } catch (error) {
      console.error('Failed to duplicate view:', error);
    }
  };

  const handleExportView = async (id: string) => {
    try {
      await exportView(id);
      setShowDropdown(null);
    } catch (error) {
      console.error('Failed to export view:', error);
    }
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedCount = await importViews(text);
      alert(`${importedCount} visualização(ões) importada(s) com sucesso!`);
      setShowImport(false);
    } catch (error) {
      console.error('Failed to import views:', error);
      alert('Erro ao importar visualizações. Verifique o formato do arquivo.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Tem certeza que deseja excluir todas as visualizações? Esta ação não pode ser desfeita.')) {
      try {
        await clearAllViews();
      } catch (error) {
        console.error('Failed to clear views:', error);
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleSort = (field: SortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-3 text-gray-900 dark:text-gray-100">
              <BookOpen size={24} className="text-blue-600 dark:text-blue-400" />
              Visualizações Salvas
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar visualizações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus size={20} />
                Nova Visualização
              </button>
              
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Upload size={20} />
                Importar
              </button>

              {savedViews.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={20} />
                  Limpar Tudo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {error && (
            <div className="m-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {savedViews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
              <BookOpen size={48} className="mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium mb-2">Nenhuma visualização salva</h3>
              <p className="text-center mb-4">
                Crie e salve suas visualizações para acessá-las rapidamente depois.
              </p>
              <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus size={20} />
                Criar Primeira Visualização
              </button>
            </div>
          ) : (
            <>
              {/* Sort Controls */}
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Ordenar por:</span>
                  {[
                    { key: 'updatedAt' as SortBy, label: 'Última modificação' },
                    { key: 'createdAt' as SortBy, label: 'Data de criação' },
                    { key: 'name' as SortBy, label: 'Nome' },
                    { key: 'dataCount' as SortBy, label: 'Quantidade de dados' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => toggleSort(key)}
                      className={`flex items-center gap-1 px-2 py-1 rounded ${
                        sortBy === key ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {label}
                      {sortBy === key && (
                        sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Views Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedViews.map((view) => (
                    <div
                      key={view.id}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Thumbnail */}
                      <div className="h-32 bg-gray-100 dark:bg-gray-600 relative">
                        {view.thumbnail ? (
                          <img
                            src={view.thumbnail}
                            alt={view.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText size={32} className="text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        
                        {/* Actions Dropdown */}
                        <div className="absolute top-2 right-2">
                          <button
                            onClick={() => setShowDropdown(showDropdown === view.id ? null : view.id)}
                            className="p-1 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-full hover:bg-opacity-100 dark:hover:bg-opacity-100 shadow-sm"
                          >
                            <MoreVertical size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>
                          
                          {showDropdown === view.id && (
                            <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10 min-w-40">
                              <button
                                onClick={() => handleLoadView(view.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                              >
                                <Eye size={16} />
                                Carregar
                              </button>
                              <button
                                onClick={() => handleDuplicateView(view.id, view.name)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                              >
                                <Copy size={16} />
                                Duplicar
                              </button>
                              <button
                                onClick={() => handleExportView(view.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                              >
                                <Download size={16} />
                                Exportar
                              </button>
                              <hr className="my-1 border-gray-200 dark:border-gray-600" />
                              <button
                                onClick={() => setShowDeleteConfirm(view.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2"
                              >
                                <Trash2 size={16} />
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate" title={view.name}>
                          {view.name}
                        </h3>
                        
                        {view.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {view.description}
                          </p>
                        )}

                        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                          <div className="flex items-center gap-1">
                            <FileText size={12} />
                            {view.dataCount} {view.dataCount === 1 ? 'categoria' : 'categorias'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(view.updatedAt)}
                          </div>
                        </div>

                        {/* Load Button */}
                        <button
                          onClick={() => handleLoadView(view.id)}
                          className="w-full mt-3 px-3 py-2 bg-blue-600 dark:bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          Carregar Visualização
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredAndSortedViews.length === 0 && searchTerm && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado</h3>
                    <p>Tente usar termos diferentes na busca.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Confirmar Exclusão</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Tem certeza que deseja excluir esta visualização? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeleteView(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImport && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Importar Visualizações</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Selecione um arquivo JSON com visualizações exportadas anteriormente.
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowImport(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 flex items-center gap-2"
                >
                  <Upload size={16} />
                  Selecionar Arquivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedViewsManager;