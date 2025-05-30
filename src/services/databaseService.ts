// Serviço de banco de dados IndexedDB para persistência de gráficos e dashboards
export interface SavedChart {
  id: string;
  name: string;
  description?: string;
  chartType: string;
  data: any;
  settings: any;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  charts: DashboardChart[];
  layout: DashboardLayout;
  createdAt: Date;
  updatedAt: Date;
  isPublic?: boolean;
}

export interface DashboardChart {
  chartId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  title?: string;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gap: number;
}

class DatabaseService {
  private dbName = 'ChartBuilderDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store para gráficos salvos
        if (!db.objectStoreNames.contains('charts')) {
          const chartsStore = db.createObjectStore('charts', { keyPath: 'id' });
          chartsStore.createIndex('chartType', 'chartType', { unique: false });
          chartsStore.createIndex('createdAt', 'createdAt', { unique: false });
          chartsStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
        }

        // Store para dashboards
        if (!db.objectStoreNames.contains('dashboards')) {
          const dashboardsStore = db.createObjectStore('dashboards', { keyPath: 'id' });
          dashboardsStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Store para configurações globais
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Métodos para Charts
  async saveChart(chart: SavedChart): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['charts'], 'readwrite');
    const store = transaction.objectStore('charts');
    
    chart.updatedAt = new Date();
    if (!chart.createdAt) chart.createdAt = new Date();
    
    return new Promise((resolve, reject) => {
      const request = store.put(chart);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getChart(id: string): Promise<SavedChart | null> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['charts'], 'readonly');
    const store = transaction.objectStore('charts');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllCharts(): Promise<SavedChart[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['charts'], 'readonly');
    const store = transaction.objectStore('charts');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteChart(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['charts'], 'readwrite');
    const store = transaction.objectStore('charts');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async searchCharts(filters: {
    chartType?: string;
    tags?: string[];
    dateRange?: { start: Date; end: Date };
  }): Promise<SavedChart[]> {
    const allCharts = await this.getAllCharts();
    
    return allCharts.filter(chart => {
      if (filters.chartType && chart.chartType !== filters.chartType) return false;
      if (filters.tags && !filters.tags.some(tag => chart.tags?.includes(tag))) return false;
      if (filters.dateRange) {
        const created = new Date(chart.createdAt);
        if (created < filters.dateRange.start || created > filters.dateRange.end) return false;
      }
      return true;
    });
  }

  // Métodos para Dashboards
  async saveDashboard(dashboard: Dashboard): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['dashboards'], 'readwrite');
    const store = transaction.objectStore('dashboards');
    
    dashboard.updatedAt = new Date();
    if (!dashboard.createdAt) dashboard.createdAt = new Date();
    
    return new Promise((resolve, reject) => {
      const request = store.put(dashboard);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDashboard(id: string): Promise<Dashboard | null> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['dashboards'], 'readonly');
    const store = transaction.objectStore('dashboards');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllDashboards(): Promise<Dashboard[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['dashboards'], 'readonly');
    const store = transaction.objectStore('dashboards');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteDashboard(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['dashboards'], 'readwrite');
    const store = transaction.objectStore('dashboards');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Métodos para configurações
  async saveSetting(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['settings'], 'readwrite');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getSetting(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['settings'], 'readonly');
    const store = transaction.objectStore('settings');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result?.value);
      request.onerror = () => reject(request.error);
    });
  }

  // Utilitários
  async exportDatabase(): Promise<any> {
    const charts = await this.getAllCharts();
    const dashboards = await this.getAllDashboards();
    
    return {
      charts,
      dashboards,
      exportedAt: new Date(),
      version: this.version
    };
  }

  async importDatabase(data: any): Promise<void> {
    if (data.charts) {
      for (const chart of data.charts) {
        await this.saveChart(chart);
      }
    }
    
    if (data.dashboards) {
      for (const dashboard of data.dashboards) {
        await this.saveDashboard(dashboard);
      }
    }
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['charts', 'dashboards', 'settings'], 'readwrite');
    
    await Promise.all([
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('charts').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('dashboards').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise<void>((resolve, reject) => {
        const request = transaction.objectStore('settings').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
    ]);
  }
}

export const databaseService = new DatabaseService();