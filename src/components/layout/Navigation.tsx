import React, { useState } from 'react';
import { 
  BarChart3, 
  LayoutDashboard, 
  Plus,
  Home,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  HelpCircle,
  Sparkles
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
    <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col shadow-sm`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!sidebarCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chart Builder
            </h1>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 hover:scale-105"
          title={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
          aria-label={sidebarCollapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-400 shadow-sm border border-blue-200 dark:border-blue-800'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={20} className={`transition-all duration-200 ${
                  item.active ? 'text-blue-600 dark:text-blue-400' : 'group-hover:scale-110'
                }`} />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {item.active && !sidebarCollapsed && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Actions */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Ações Rápidas
          </div>
          <button
            onClick={onNewChart}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Plus size={16} />
            <span className="font-medium">Novo Gráfico</span>
          </button>
          <button
            onClick={onNewDashboard}
            className="w-full flex items-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            <Plus size={16} />
            <span className="font-medium">Novo Dashboard</span>
          </button>
        </div>
      )}

      {/* Help Section */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group">
            <HelpCircle size={20} className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="text-sm font-medium">Ajuda & Suporte</span>
          </button>
        </div>
      )}

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
              <User size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Usuário</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">user@example.com</p>
            </div>
            <button 
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Configurações"
            >
              <Settings size={14} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        ) : (
          <button
            className="w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group"
            title="Perfil do usuário"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <User size={16} className="text-white" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default Navigation;