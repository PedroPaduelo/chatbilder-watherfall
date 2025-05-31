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
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex h-screen">
        {/* Navigation Sidebar */}
        <Navigation 
          onNewChart={handleNewChart}
          onNewDashboard={handleNewDashboard}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Theme Selector - Fixed position */}
      <div className="fixed bottom-6 right-6 z-40">
        <ThemeSelector />
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