import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { NotificationContainer } from '../components/Notification';
import ThemeSelector from '../components/ThemeSelector';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';

const Layout: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleNewChart = () => {
    navigate('/charts/new');
  };

  const handleNewDashboard = () => {
    navigate('/dashboards/new');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300 ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <Navigation 
          onNewChart={handleNewChart}
          onNewDashboard={handleNewDashboard}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sistema Online</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          
          <main className="flex-1 overflow-auto p-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Theme Selector - Fixed position */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-1">
          <ThemeSelector />
        </div>
      </div>

      {/* Notifications */}
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </div>
  );
};

export default Layout;