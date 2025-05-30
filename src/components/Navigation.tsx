import React, { useState } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Plus,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { SavedChartsManager } from './SavedChartsManager';
import { DashboardsManager } from './DashboardsManager';
import { DashboardBuilder } from './DashboardBuilder';
import { Dashboard, SavedChart } from '../services/databaseService';

type ViewMode = 'charts' | 'dashboard-list' | 'dashboard-edit' | 'dashboard-view';

interface NavigationProps {
  onSelectChart?: (chart: SavedChart) => void;
  onCreateChart?: () => void;
  currentChartData?: {
    name: string;
    description?: string;
    chartType: string;
    data: any;
    settings: any;
    tags?: string[];
  };
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onNewChart: () => void;
  onNewDashboard: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onSelectChart,
  currentChartData,
  onViewChange,
  onNewChart,
  onNewDashboard,
  currentView,
}) => {
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);
  const [editingDashboardId, setEditingDashboardId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelectDashboard = (dashboard: Dashboard) => {
    setSelectedDashboard(dashboard);
    onViewChange('dashboard-view');
  };

  const handleEditDashboard = (dashboardId: string) => {
    setEditingDashboardId(dashboardId);
    onViewChange('dashboard-edit');
  };

  const handleCloseDashboard = () => {
    setSelectedDashboard(null);
    setEditingDashboardId(null);
    onViewChange('dashboard-list');
  };

  const getViewTitle = (): string => {
    switch (currentView) {
      case 'charts':
        return 'Gráficos Salvos';
      case 'dashboard-list':
        return 'Dashboards';
      case 'dashboard-edit':
        return 'Editando Dashboard';
      case 'dashboard-view':
        return 'Visualizando Dashboard';
      default:
        return 'Gráficos Salvos';
    }
  };

  const navigationItems = [
    {
      id: 'charts',
      label: 'Gráficos',
      icon: BarChart3,
      active: currentView === 'charts'
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: LayoutDashboard,
      active: ['dashboard-list', 'dashboard-edit', 'dashboard-view'].includes(currentView)
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'charts':
        return (
          <SavedChartsManager
            onSelectChart={onSelectChart}
            currentChartData={currentChartData}
            onNewChart={onNewChart}
          />
        );
      case 'dashboard-list':
        return (
          <DashboardsManager
            onSelectDashboard={handleSelectDashboard}
            onEditDashboard={handleEditDashboard}
            onNewDashboard={onNewDashboard}
          />
        );
      case 'dashboard-edit':
        return editingDashboardId ? (
          <DashboardBuilder
            dashboardId={editingDashboardId}
            onClose={handleCloseDashboard}
          />
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhum dashboard selecionado para edição
          </div>
        );
      case 'dashboard-view':
        return selectedDashboard ? (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedDashboard.name}</h2>
              <button
                onClick={handleCloseDashboard}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
            {selectedDashboard.description && (
              <p className="text-gray-600 mb-6">{selectedDashboard.description}</p>
            )}
            <div className="grid gap-6">
              {selectedDashboard.charts?.map((chart, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">{chart.name}</h3>
                  {chart.description && (
                    <p className="text-gray-600 mb-4">{chart.description}</p>
                  )}
                  {/* Chart rendering would go here */}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Nenhum dashboard selecionado
          </div>
        );
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            View não encontrada
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-50 border-r border-gray-200 transition-all duration-200 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'charts') {
                      onViewChange('charts');
                    } else if (item.id === 'dashboards') {
                      onViewChange('dashboard-list');
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon size={20} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Quick Actions */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="space-y-2">
              <button
                onClick={onNewChart}
                className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span>Novo Gráfico</span>
              </button>
              <button
                onClick={onNewDashboard}
                className="w-full flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus size={16} />
                <span>Novo Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              {getViewTitle()}
            </h2>
            {(currentView === 'dashboard-edit' || currentView === 'dashboard-view') && (
              <button
                onClick={handleCloseDashboard}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Home size={16} />
                Voltar
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};