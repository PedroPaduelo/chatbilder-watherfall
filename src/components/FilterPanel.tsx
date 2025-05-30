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
          <Filter size={20} className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filtros</h3>
          {isFiltered && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full">
              {filteredData.length} de {data.length}
            </span>
          )}
        </div>
        
        {isFiltered && (
          <button
            onClick={actions.clearFilters}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Limpar filtros"
          >
            <RotateCcw size={14} />
            Limpar
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Buscar Categorias
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            placeholder="Digite para buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          {filters.searchTerm && (
            <button
              onClick={() => actions.setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Type Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tipos de Barra
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTypes.map(type => {
            const isSelected = filters.selectedTypes.includes(type);
            const typeLabels: Record<string, string> = {
              baseline: 'Inicial',
              increase: 'Aumento',
              decrease: 'Diminuição',
              subtotal: 'Subtotal',
              total: 'Total'
            };
            
            return (
              <button
                key={type}
                onClick={() => {
                  const newTypes = isSelected 
                    ? filters.selectedTypes.filter(t => t !== type)
                    : [...filters.selectedTypes, type];
                  actions.setSelectedTypes(newTypes);
                }}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200'
                    : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {typeLabels[type] || type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Value Range Filter */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Faixa de Valores
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder={`Min (${valueStats.min})`}
            value={filters.valueRange?.min ?? ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              actions.setValueRange(
                value !== undefined 
                  ? { min: value, max: filters.valueRange?.max ?? valueStats.max }
                  : undefined
              );
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="number"
            placeholder={`Max (${valueStats.max})`}
            value={filters.valueRange?.max ?? ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              actions.setValueRange(
                value !== undefined 
                  ? { min: filters.valueRange?.min ?? valueStats.min, max: value }
                  : undefined
              );
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Visibility */}
      {data.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Visibilidade das Categorias
          </label>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {data.map(item => {
              const isHidden = filters.hiddenCategories.has(item.category);
              return (
                <button
                  key={item.id}
                  onClick={() => actions.toggleCategory(item.category)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg border transition-colors ${
                    isHidden
                      ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="truncate">{item.category}</span>
                  {isHidden ? (
                    <EyeOff size={16} className="text-gray-400 flex-shrink-0 ml-2" />
                  ) : (
                    <Eye size={16} className="text-green-500 flex-shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;