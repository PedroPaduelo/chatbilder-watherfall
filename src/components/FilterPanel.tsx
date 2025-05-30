import React from 'react';
import { Search, Filter, X, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { useFilters } from '../hooks/useFilters';
import type { DataRow } from '../types';

interface FilterPanelProps {
  data: DataRow[];
  onFilteredDataChange: (filteredData: DataRow[]) => void;
  className?: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  data, 
  onFilteredDataChange, 
  className = '' 
}) => {
  const { filters, actions, filteredData, isFiltered } = useFilters(data);

  React.useEffect(() => {
    onFilteredDataChange(filteredData);
  }, [filteredData, onFilteredDataChange]);

  const availableTypes = React.useMemo(() => {
    return Array.from(new Set(data.map(item => item.type)));
  }, [data]);

  const valueStats = React.useMemo(() => {
    const values = data.map(item => item.value);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [data]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filtros</h3>
          {isFiltered && (
            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
              {filteredData.length} de {data.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={actions.toggleVisibility}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded"
            title={filters.isVisible ? "Ocultar filtros" : "Mostrar filtros"}
          >
            {filters.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          
          {isFiltered && (
            <button
              onClick={actions.resetAll}
              className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded"
              title="Limpar todos os filtros"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {filters.isVisible && (
        <div className="space-y-4">
          {/* Filtro de Texto */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buscar por Nome/Categoria
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={filters.searchText}
                onChange={(e) => actions.setSearchText(e.target.value)}
                placeholder="Digite para buscar..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {filters.searchText && (
                <button
                  onClick={() => actions.setSearchText('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro de Tipo */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Item
            </label>
            <select
              value={filters.selectedType}
              onChange={(e) => actions.setSelectedType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os tipos</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Filtro de Valor */}
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
              Faixa de Valores
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="number"
                  value={filters.valueRange.min}
                  onChange={(e) => actions.setValueRange({ ...filters.valueRange, min: Number(e.target.value) })}
                  placeholder={`Min (${valueStats.min})`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={filters.valueRange.max}
                  onChange={(e) => actions.setValueRange({ ...filters.valueRange, max: Number(e.target.value) })}
                  placeholder={`Max (${valueStats.max})`}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Filtros Booleanos */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Mostrar Apenas
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showPositiveOnly}
                  onChange={(e) => actions.setShowPositiveOnly(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Valores Positivos</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.showNegativeOnly}
                  onChange={(e) => actions.setShowNegativeOnly(e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Valores Negativos</span>
              </label>
            </div>
          </div>

          {/* Resumo dos Filtros Ativos */}
          {isFiltered && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Exibindo {filteredData.length} de {data.length} itens
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterPanel;