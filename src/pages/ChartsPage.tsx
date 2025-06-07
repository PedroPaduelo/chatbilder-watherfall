import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedChartsManager } from '../components/shared/SavedChartsManager';
import { SavedChart } from '../services/databaseService';
import { useNotifications } from '../hooks/useNotifications';

const ChartsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifySuccess } = useNotifications();

  const handleSelectChart = (chart: SavedChart) => {
    navigate(`/charts/${chart.id}`);
    notifySuccess('Gráfico carregado', `"${chart.name}" foi aberto para visualização`);
  };

  const handleEditChart = (chart: SavedChart) => {
    navigate(`/charts/${chart.id}/edit`);
    notifySuccess('Modo de edição', `Editando "${chart.name}"`);
  };

  return (
    <div>
      <SavedChartsManager
        onSelectChart={handleSelectChart}
        onEditChart={handleEditChart}
      />
    </div>
  );
};

export default ChartsPage;