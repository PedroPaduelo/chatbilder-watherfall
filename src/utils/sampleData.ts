import type { DataRow, ChartType, SankeyData } from '../types';
import { generateSampleWaterfallData } from '../components/charts/waterfall';

// Dados de exemplo para Waterfall Chart - usando gerador modular
export const waterfallSampleData: DataRow[] = generateSampleWaterfallData();

// Dados de exemplo para Stacked Bar Chart
export const stackedBarSampleData: DataRow[] = [
  {
    id: '1',
    category: 'Q1 2024',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Produto A', valor: 30000, cor: '#ef4444' },
      { categoria: 'Produto B', valor: 25000, cor: '#10b981' },
      { categoria: 'Produto C', valor: 20000, cor: '#f59e0b' }
    ]
  },
  {
    id: '2',
    category: 'Q2 2024',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Produto A', valor: 35000, cor: '#ef4444' },
      { categoria: 'Produto B', valor: 30000, cor: '#10b981' },
      { categoria: 'Produto C', valor: 22000, cor: '#f59e0b' }
    ]
  },
  {
    id: '3',
    category: 'Q3 2024',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Produto A', valor: 40000, cor: '#ef4444' },
      { categoria: 'Produto B', valor: 28000, cor: '#10b981' },
      { categoria: 'Produto C', valor: 25000, cor: '#f59e0b' }
    ]
  },
  {
    id: '4',
    category: 'Q4 2024',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Produto A', valor: 45000, cor: '#ef4444' },
      { categoria: 'Produto B', valor: 32000, cor: '#10b981' },
      { categoria: 'Produto C', valor: 28000, cor: '#f59e0b' }
    ]
  }
];

// Dados de exemplo para Line Chart
export const lineChartSampleData: DataRow[] = [
  {
    id: '1',
    category: 'Janeiro',
    value: 65000,
    type: 'baseline',
    color: '#3b82f6'
  },
  {
    id: '2',
    category: 'Fevereiro',
    value: 72000,
    type: 'baseline',
    color: '#3b82f6'
  },
  {
    id: '3',
    category: 'Março',
    value: 68000,
    type: 'baseline',
    color: '#3b82f6'
  },
  {
    id: '4',
    category: 'Abril',
    value: 75000,
    type: 'baseline',
    color: '#3b82f6'
  },
  {
    id: '5',
    category: 'Maio',
    value: 82000,
    type: 'baseline',
    color: '#3b82f6'
  },
  {
    id: '6',
    category: 'Junho',
    value: 88000,
    type: 'baseline',
    color: '#3b82f6'
  }
];

// Dados de exemplo para Area Chart
export const areaChartSampleData: DataRow[] = [
  {
    id: '1',
    category: 'Semana 1',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Desktop', valor: 12000, cor: '#3b82f6' },
      { categoria: 'Mobile', valor: 8000, cor: '#10b981' },
      { categoria: 'Tablet', valor: 3000, cor: '#f59e0b' }
    ]
  },
  {
    id: '2',
    category: 'Semana 2',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Desktop', valor: 14000, cor: '#3b82f6' },
      { categoria: 'Mobile', valor: 9500, cor: '#10b981' },
      { categoria: 'Tablet', valor: 3500, cor: '#f59e0b' }
    ]
  },
  {
    id: '3',
    category: 'Semana 3',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Desktop', valor: 13500, cor: '#3b82f6' },
      { categoria: 'Mobile', valor: 11000, cor: '#10b981' },
      { categoria: 'Tablet', valor: 4000, cor: '#f59e0b' }
    ]
  },
  {
    id: '4',
    category: 'Semana 4',
    value: 0,
    type: 'baseline',
    color: '#3b82f6',
    segments: [
      { categoria: 'Desktop', valor: 16000, cor: '#3b82f6' },
      { categoria: 'Mobile', valor: 12500, cor: '#10b981' },
      { categoria: 'Tablet', valor: 4500, cor: '#f59e0b' }
    ]
  }
];

// Dados de exemplo para Sankey Chart
export const sankeySampleData: SankeyData = {
  nodes: [
    { id: 'source1', name: 'Tráfego Orgânico', color: '#10b981' },
    { id: 'source2', name: 'Tráfego Pago', color: '#3b82f6' },
    { id: 'source3', name: 'Redes Sociais', color: '#8b5cf6' },
    { id: 'middle1', name: 'Landing Page', color: '#f59e0b' },
    { id: 'middle2', name: 'Página Produto', color: '#ef4444' },
    { id: 'target1', name: 'Conversões', color: '#059669' },
    { id: 'target2', name: 'Abandono', color: '#dc2626' }
  ],
  links: [
    { source: 'source1', target: 'middle1', value: 5000, color: '#10b981' },
    { source: 'source1', target: 'middle2', value: 3000, color: '#10b981' },
    { source: 'source2', target: 'middle1', value: 4000, color: '#3b82f6' },
    { source: 'source2', target: 'middle2', value: 2000, color: '#3b82f6' },
    { source: 'source3', target: 'middle1', value: 2000, color: '#8b5cf6' },
    { source: 'source3', target: 'middle2', value: 1500, color: '#8b5cf6' },
    { source: 'middle1', target: 'target1', value: 7000, color: '#059669' },
    { source: 'middle1', target: 'target2', value: 4000, color: '#dc2626' },
    { source: 'middle2', target: 'target1', value: 4000, color: '#059669' },
    { source: 'middle2', target: 'target2', value: 2500, color: '#dc2626' }
  ]
};

// Função para obter dados de exemplo baseado no tipo de gráfico
export const getSampleDataForChartType = (chartType: ChartType): DataRow[] => {
  switch (chartType) {
    case 'waterfall':
      return waterfallSampleData;
    case 'stacked-bar':
      return stackedBarSampleData;
    case 'line':
      return lineChartSampleData;
    case 'area':
      return areaChartSampleData;
    case 'sankey':
      // Para Sankey, retornamos dados vazios pois usa estrutura diferente
      return [];
    default:
      return waterfallSampleData;
  }
};

// Função para obter dados de exemplo do Sankey
export const getSankeySampleData = (): SankeyData => {
  return sankeySampleData;
};

// Descrições dos dados de exemplo
export const sampleDataDescriptions = {
  waterfall: 'Exemplo mostra o fluxo de receita de uma empresa, começando com receita inicial, adicionando vendas online e físicas, subtraindo custos operacionais e marketing para chegar ao total final.',
  'stacked-bar': 'Exemplo mostra vendas trimestrais de três produtos (A, B, C) ao longo de 2024, permitindo comparar tanto o desempenho total quanto individual de cada produto.',
  line: 'Exemplo mostra a evolução mensal de vendas ao longo de 6 meses, ideal para visualizar tendências e sazonalidade.',
  area: 'Exemplo mostra tráfego semanal por dispositivo (Desktop, Mobile, Tablet), com áreas empilhadas que mostram a composição total.',
  sankey: 'Exemplo mostra o fluxo de tráfego web desde as fontes (orgânico, pago, redes sociais) até as conversões finais, passando por páginas intermediárias.'
};