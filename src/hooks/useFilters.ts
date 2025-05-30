import { useState, useCallback, useMemo } from 'react';
import type { DataRow } from '../types';

export interface FilterState {
  searchTerm: string;
  selectedTypes: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange?: {
    min: number;
    max: number;
  };
  hiddenCategories: Set<string>;
}

interface FilterActions {
  setSearchTerm: (term: string) => void;
  setSelectedTypes: (types: string[]) => void;
  setDateRange: (range: FilterState['dateRange']) => void;
  setValueRange: (range: FilterState['valueRange']) => void;
  toggleCategory: (category: string) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
}

interface UseFiltersReturn {
  filters: FilterState;
  actions: FilterActions;
  filteredData: DataRow[];
  isFiltered: boolean;
}

const defaultFilters: FilterState = {
  searchTerm: '',
  selectedTypes: [],
  hiddenCategories: new Set(),
};

export const useFilters = (data: DataRow[]): UseFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setSearchTerm = useCallback((term: string) => {
    setFilters(prev => ({ ...prev, searchTerm: term }));
  }, []);

  const setSelectedTypes = useCallback((types: string[]) => {
    setFilters(prev => ({ ...prev, selectedTypes: types }));
  }, []);

  const setDateRange = useCallback((range: FilterState['dateRange']) => {
    setFilters(prev => ({ ...prev, dateRange: range }));
  }, []);

  const setValueRange = useCallback((range: FilterState['valueRange']) => {
    setFilters(prev => ({ ...prev, valueRange: range }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => {
      const newHidden = new Set(prev.hiddenCategories);
      if (newHidden.has(category)) {
        newHidden.delete(category);
      } else {
        newHidden.add(category);
      }
      return { ...prev, hiddenCategories: newHidden };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const resetToDefaults = useCallback(() => {
    setFilters({ ...defaultFilters, hiddenCategories: new Set() });
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (!item.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Type filter
      if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes(item.type)) {
        return false;
      }

      // Value range filter
      if (filters.valueRange) {
        if (item.value < filters.valueRange.min || item.value > filters.valueRange.max) {
          return false;
        }
      }

      // Hidden categories
      if (filters.hiddenCategories.has(item.category)) {
        return false;
      }

      return true;
    });
  }, [data, filters]);

  const isFiltered = useMemo(() => {
    return (
      filters.searchTerm !== '' ||
      filters.selectedTypes.length > 0 ||
      filters.dateRange !== undefined ||
      filters.valueRange !== undefined ||
      filters.hiddenCategories.size > 0
    );
  }, [filters]);

  const actions: FilterActions = {
    setSearchTerm,
    setSelectedTypes,
    setDateRange,
    setValueRange,
    toggleCategory,
    clearFilters,
    resetToDefaults,
  };

  return {
    filters,
    actions,
    filteredData,
    isFiltered,
  };
};