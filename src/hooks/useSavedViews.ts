import { useState, useEffect, useCallback } from 'react';
import type { SavedView, SavedViewPreview, DataRow, ChartSettings } from '../types';

const STORAGE_KEY = 'waterfall-chart-saved-views';

export interface UseSavedViewsReturn {
  savedViews: SavedViewPreview[];
  saveView: (name: string, description: string, data: DataRow[], settings: ChartSettings, thumbnail?: string) => Promise<void>;
  loadView: (id: string) => Promise<SavedView | null>;
  deleteView: (id: string) => Promise<void>;
  updateView: (id: string, name: string, description: string, data: DataRow[], settings: ChartSettings, thumbnail?: string) => Promise<void>;
  duplicateView: (id: string, newName: string) => Promise<void>;
  exportView: (id: string) => Promise<void>;
  importViews: (viewsJson: string) => Promise<number>;
  clearAllViews: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useSavedViews = (): UseSavedViewsReturn => {
  const [savedViews, setSavedViews] = useState<SavedViewPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load views from localStorage on mount
  useEffect(() => {
    loadSavedViews();
  }, []);

  const loadSavedViews = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const views: SavedView[] = JSON.parse(stored);
        const previews: SavedViewPreview[] = views.map(view => ({
          id: view.id,
          name: view.name,
          description: view.description,
          createdAt: new Date(view.createdAt),
          updatedAt: new Date(view.updatedAt),
          dataCount: view.data.length,
          thumbnail: view.thumbnail
        }));
        setSavedViews(previews.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()));
      }
    } catch (error) {
      console.error('Error loading saved views:', error);
      setError('Failed to load saved views');
    }
  }, []);

  const saveView = useCallback(async (
    name: string, 
    description: string, 
    data: DataRow[], 
    settings: ChartSettings,
    thumbnail?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const existingViews: SavedView[] = stored ? JSON.parse(stored) : [];

      const newView: SavedView = {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim(),
        data: JSON.parse(JSON.stringify(data)), // Deep clone
        settings: JSON.parse(JSON.stringify(settings)), // Deep clone
        createdAt: new Date(),
        updatedAt: new Date(),
        thumbnail
      };

      const updatedViews = [...existingViews, newView];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedViews));
      
      loadSavedViews();
    } catch (error) {
      console.error('Error saving view:', error);
      setError('Failed to save view');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadSavedViews]);

  const loadView = useCallback(async (id: string): Promise<SavedView | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const views: SavedView[] = JSON.parse(stored);
      const view = views.find(v => v.id === id);
      
      if (view) {
        // Convert date strings back to Date objects
        view.createdAt = new Date(view.createdAt);
        view.updatedAt = new Date(view.updatedAt);
      }
      
      return view || null;
    } catch (error) {
      console.error('Error loading view:', error);
      setError('Failed to load view');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteView = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const views: SavedView[] = JSON.parse(stored);
      const updatedViews = views.filter(v => v.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedViews));
      
      loadSavedViews();
    } catch (error) {
      console.error('Error deleting view:', error);
      setError('Failed to delete view');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadSavedViews]);

  const updateView = useCallback(async (
    id: string,
    name: string,
    description: string,
    data: DataRow[],
    settings: ChartSettings,
    thumbnail?: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) throw new Error('No saved views found');

      const views: SavedView[] = JSON.parse(stored);
      const viewIndex = views.findIndex(v => v.id === id);
      
      if (viewIndex === -1) throw new Error('View not found');

      views[viewIndex] = {
        ...views[viewIndex],
        name: name.trim(),
        description: description.trim(),
        data: JSON.parse(JSON.stringify(data)),
        settings: JSON.parse(JSON.stringify(settings)),
        updatedAt: new Date(),
        thumbnail
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
      loadSavedViews();
    } catch (error) {
      console.error('Error updating view:', error);
      setError('Failed to update view');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadSavedViews]);

  const duplicateView = useCallback(async (id: string, newName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const view = await loadView(id);
      if (!view) throw new Error('View not found');

      await saveView(newName, view.description || '', view.data, view.settings, view.thumbnail);
    } catch (error) {
      console.error('Error duplicating view:', error);
      setError('Failed to duplicate view');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadView, saveView]);

  const exportView = useCallback(async (id: string) => {
    try {
      const view = await loadView(id);
      if (!view) throw new Error('View not found');

      const exportData = {
        view,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `waterfall-view-${view.name.replace(/[^a-zA-Z0-9]/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting view:', error);
      setError('Failed to export view');
      throw error;
    }
  }, [loadView]);

  const importViews = useCallback(async (viewsJson: string): Promise<number> => {
    setIsLoading(true);
    setError(null);

    try {
      const importData = JSON.parse(viewsJson);
      let viewsToImport: SavedView[] = [];

      // Handle different import formats
      if (importData.view && importData.version) {
        // Single view export format
        viewsToImport = [importData.view];
      } else if (Array.isArray(importData)) {
        // Array of views
        viewsToImport = importData;
      } else {
        throw new Error('Invalid import format');
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      const existingViews: SavedView[] = stored ? JSON.parse(stored) : [];

      // Generate new IDs to avoid conflicts
      const processedViews = viewsToImport.map(view => ({
        ...view,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      const updatedViews = [...existingViews, ...processedViews];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedViews));
      
      loadSavedViews();
      return processedViews.length;
    } catch (error) {
      console.error('Error importing views:', error);
      setError('Failed to import views');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [loadSavedViews]);

  const clearAllViews = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      localStorage.removeItem(STORAGE_KEY);
      setSavedViews([]);
    } catch (error) {
      console.error('Error clearing views:', error);
      setError('Failed to clear views');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    savedViews,
    saveView,
    loadView,
    deleteView,
    updateView,
    duplicateView,
    exportView,
    importViews,
    clearAllViews,
    isLoading,
    error
  };
};