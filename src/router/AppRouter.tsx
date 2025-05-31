import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/Layout';
import HomePage from '../pages/HomePage';
import ChartsPage from '../pages/ChartsPage';
import ChartCreatorPage from '../pages/ChartCreatorPage';
import ChartViewerPage from '../pages/ChartViewerPage';
import DashboardsPage from '../pages/DashboardsPage';
import DashboardCreatorPage from '../pages/DashboardCreatorPage';
import DashboardViewerPage from '../pages/DashboardViewerPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'charts',
        element: <ChartsPage />,
      },
      {
        path: 'charts/new',
        element: <ChartCreatorPage />,
      },
      {
        path: 'charts/:id',
        element: <ChartViewerPage />,
      },
      {
        path: 'charts/:id/edit',
        element: <ChartCreatorPage />,
      },
      {
        path: 'dashboards',
        element: <DashboardsPage />,
      },
      {
        path: 'dashboards/new',
        element: <DashboardCreatorPage />,
      },
      {
        path: 'dashboards/:id',
        element: <DashboardViewerPage />,
      },
      {
        path: 'dashboards/:id/edit',
        element: <DashboardCreatorPage />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;