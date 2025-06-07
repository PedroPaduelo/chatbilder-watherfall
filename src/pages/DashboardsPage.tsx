import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardsManager } from '../components/dashboard/DashboardsManager';
import { Dashboard } from '../services/databaseService';
import { useNotifications } from '../hooks/useNotifications';

const DashboardsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifySuccess } = useNotifications();

  const handleSelectDashboard = (dashboard: Dashboard) => {
    navigate(`/dashboards/${dashboard.id}`);
    notifySuccess('Dashboard carregado', `"${dashboard.name}" foi aberto para visualização`);
  };

  const handleEditDashboard = (dashboardId: string) => {
    navigate(`/dashboards/${dashboardId}/edit`);
    notifySuccess('Modo de edição', 'Editando dashboard');
  };

  const handleCreateDashboard = () => {
    navigate('/dashboards/new');
  };

  return (
    <div>
      <DashboardsManager
        onSelectDashboard={handleSelectDashboard}
        onEditDashboard={handleEditDashboard}
        onCreateDashboard={handleCreateDashboard}
      />
    </div>
  );
};

export default DashboardsPage;