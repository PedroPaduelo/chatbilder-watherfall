import React, { useState } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Plus,
  Home,
  ChevronLeft,
  ChevronRight,
  Settings,
  User
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface NavigationProps {
  onNewChart: () => void;
  onNewDashboard: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onNewChart,
  onNewDashboard,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      id: 'home',
      label: 'Início',
      icon: Home,
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'charts',
      label: 'Gráficos',
      icon: BarChart3,
      path: '/charts',
      active: location.pathname.startsWith('/charts')
    },
    {
      id: 'dashboards',
      label: 'Dashboards',
      icon: LayoutDashboard,
      path: '/dashboards',
      active: location.pathname.startsWith('/dashboards')
    }
  ];

  return (
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-200 flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Chart Builder</h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
              <Link
                to={item.path}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={20} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
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
      )}

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Usuário</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
            </div>
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
              <Settings size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ) : (
          <button
            className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Perfil do usuário"
          >
            <User size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        )}
      </div>
    </div>
  );
};