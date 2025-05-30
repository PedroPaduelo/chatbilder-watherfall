import { useState, useCallback, useMemo } from 'react';
import type { DataRow } from '../types';

export interface FilterState {
  searchText: string; // Changed from searchTerm to searchText
  selectedType: string; // Changed from selectedTypes to selectedType (single value)
  dateRange?: {
    start: Date;
    end: Date;
  };
  valueRange: {
    min: number;
    max: number;
  }; // Made required and removed optional
  hiddenCategories: Set<string>;
  isVisible: boolean;
  showPositiveOnly: boolean;
  showNegativeOnly: boolean;
}

interface FilterActions {
  setSearchText: (text: string) => void; // Changed from setSearchTerm
  setSelectedType: (type: string) => void; // Changed from setSelectedTypes
  setDateRange: (range: FilterState['dateRange']) => void;
  setValueRange: (range: FilterState['valueRange']) => void;
  toggleCategory: (category: string) => void;
  clearFilters: () => void;
  resetToDefaults: () => void;
  toggleVisibility: () => void;
  resetAll: () => void;
  setShowPositiveOnly: (show: boolean) => void;
  setShowNegativeOnly: (show: boolean) => void;
}

interface UseFiltersReturn {
  filters: FilterState;
  actions: FilterActions;
  filteredData: DataRow[];
  isFiltered: boolean;
}

const defaultFilters: FilterState = {
  searchText: '', // Changed from searchTerm
  selectedType: '', // Changed from selectedTypes array to single string
  hiddenCategories: new Set(),
  isVisible: true,
  showPositiveOnly: false,
  showNegativeOnly: false,
  valueRange: { min: 0, max: 0 }, // Added default valueRange
};

export const useFilters = (data: DataRow[]): UseFiltersReturn => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setSearchText = useCallback((text: string) => {
    setFilters(prev => ({ ...prev, searchText: text }));
  }, []);

  const setSelectedType = useCallback((type: string) => {
    setFilters(prev => ({ ...prev, selectedType: type }));
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

  const toggleVisibility = useCallback(() => {
    setFilters(prev => ({ ...prev, isVisible: !prev.isVisible }));
  }, []);

  const setShowPositiveOnly = useCallback((show: boolean) => {
    setFilters(prev => ({ ...prev, showPositiveOnly: show }));
  }, []);

  const setShowNegativeOnly = useCallback((show: boolean) => {
    setFilters(prev => ({ ...prev, showNegativeOnly: show }));
  }, []);

  const resetAll = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search term filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        if (!item.category.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Type filter - changed to work with single value
      if (filters.selectedType && filters.selectedType !== item.type) {
        return false;
      }

      // Value range filter
      if (filters.valueRange) {
        if (filters.valueRange.min > 0 && item.value < filters.valueRange.min) {
          return false;
        }
        if (filters.valueRange.max > 0 && item.value > filters.valueRange.max) {
          return false;
        }
      }

      // Positive/negative filters
      if (filters.showPositiveOnly && item.value <= 0) {
        return false;
      }
      
      if (filters.showNegativeOnly && item.value >= 0) {
        return false;
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
      filters.searchText !== '' ||
      filters.selectedType !== '' ||
      filters.dateRange !== undefined ||
      (filters.valueRange && (filters.valueRange.min > 0 || filters.valueRange.max > 0)) ||
      filters.hiddenCategories.size > 0 ||
      filters.showPositiveOnly ||
      filters.showNegativeOnly
    );
  }, [filters]);

  const actions: FilterActions = {
    setSearchText, // Changed from setSearchTerm
    setSelectedType, // Changed from setSelectedTypes
    setDateRange,
    setValueRange,
    toggleCategory,
    clearFilters,
    resetToDefaults,
    toggleVisibility,
    setShowPositiveOnly,
    setShowNegativeOnly,
    resetAll,
  };

  return {
    filters,
    actions,
    filteredData,
    isFiltered,
  };
};