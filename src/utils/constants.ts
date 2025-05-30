import type { ChartSettings, DataRow, SankeySettings } from '../types';

// Default settings
export const defaultSettings: ChartSettings = {
  barWidth: 60,
  barSpacing: 20,
  showConnectors: true,
  showValues: true,
  showCategories: true,
  showSegmentLabels: true,
  categoryLabelRotation: 0, // Sem rotação por padrão
  valuePrefix: '',
  valueSuffix: '',
  showGridlines: true,
  showAxes: true, // Eixos visíveis por padrão
  accentColor: '#3B82F6', // Cor principal para gráficos de linha e área
  primaryColor: '#374151', // Cor primária para elementos gerais
  backgroundColor: '#ffffff', // Cor de fundo
  title: '', // Título opcional do gráfico
  // Add missing properties for area and line charts
  areaOpacity: 0.3,
  lineWidth: 2,
  // New label customization settings
  labelSettings: {
    categoryFontSize: 12,
    categoryFontColor: '#374151',
    categoryFontWeight: 'normal',
    valueFontSize: 14,
    valueFontColor: '#111827',
    valueFontWeight: 'bold',
    segmentLabelFontSize: 10,
    segmentLabelFontColor: '#FFFFFF',
    segmentLabelFontWeight: 'normal',
  },
  // Chart dimensions settings
  chartDimensions: {
    width: 900,
    height: 500,
    autoResize: true,
    aspectRatio: 'auto',
  },
  colors: {
    baseline: '#4B5563',
    increase: '#10B981',
    decrease: '#EF4444',
    subtotal: '#3B82F6',
    total: '#6366F1'
  }
};

// Initial data with stacked segments
export const initialData: DataRow[] = [
  { 
    id: '1', 
    category: 'Initial', 
    value: 0.60, 
    type: 'baseline',
    segments: [
      { categoria: 'Base A', valor: 0.35, cor: '#4B5563' },
      { categoria: 'Base B', valor: 0.25, cor: '#6B7280' }
    ]
  },
  { id: '2', category: 'Atraso', value: 0.02, type: 'increase' },
  { id: '3', category: 'Consumer', value: 0.02, type: 'increase' },
  { id: '4', category: 'Driver', value: 0.02, type: 'increase' },
  { id: '5', category: 'Estorno', value: -0.02, type: 'decrease' },
  { 
    id: '6', 
    category: 'MTG', 
    value: 0.64, 
    type: 'total',
    segments: [
      { categoria: 'MTG A', valor: 0.40, cor: '#6366F1' },
      { categoria: 'MTG B', valor: 0.24, cor: '#8B5CF6' }
    ]
  }
];

// UI Constants
export const UI_CONSTANTS = {
  CHART: {
    DEFAULT_WIDTH: 900,
    DEFAULT_HEIGHT: 500,
    MIN_SEGMENT_HEIGHT: 20,
    GRID_VALUES: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    TRANSITION_DURATION: '0.2s',
  },
  COLORS: {
    GRID_LINE: '#9CA3AF',
    AXIS: '#374151',
    CONNECTOR_LINE: '#9CA3AF',
    TOOLTIP_BG: '#1F2937',
    HOVER_OPACITY: 0.8,
  },
  SPACING: {
    LABEL_OFFSET: 5,
    TOOLTIP_OFFSET: 10,
    SEGMENT_LABEL_MIN_HEIGHT: 20,
  },
  FILES: {
    SUPPORTED_EXTENSIONS: ['csv', 'xlsx', 'xls'],
    DEFAULT_FILENAMES: {
      PNG: 'waterfall-chart.png',
      SVG: 'waterfall-chart.svg',
      JSON: 'waterfall-chart-data.json',
      HTML: 'waterfall-chart.html',
      CSV: 'waterfall-chart-data.csv',
    },
  },
  NOTIFICATIONS: {
    DEFAULT_DURATION: 5000,
    ERROR_DURATION: 0, // Don't auto-close errors
  },
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_BAR_WIDTH: 10,
  MAX_BAR_WIDTH: 200,
  MIN_BAR_SPACING: 0,
  MAX_BAR_SPACING: 100,
  MIN_FONT_SIZE: 8,
  MAX_FONT_SIZE: 32,
  MIN_BORDER_RADIUS: 0,
  MAX_BORDER_RADIUS: 20,
} as const;

// Default Sankey-specific settings
export const defaultSankeySettings: SankeySettings = {
  // Node settings
  nodeWidth: 15,
  nodeMinHeight: 15,
  nodeSpacing: 30,
  nodeBorderRadius: 2,
  nodeOpacity: 0.9,
  
  // Link settings
  linkOpacity: 0.5,
  linkCurvature: 0.5,
  linkGradient: true,
  linkHoverOpacity: 0.8,
  
  // Layout settings
  iterations: 5,
  spacingRatio: 0.7,
  minSpacing: 30,
  compressionThreshold: 0.9,
  
  // Visual settings
  showNodeLabels: true,
  showNodeValues: true,
  showTooltips: true,
  animationDuration: 300,
  
  // Color settings
  colorScheme: 'default',
  customColors: [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
  ],
  linkColorMode: 'gradient',
  
  // Typography
  labelFontSize: 11,
  labelFontWeight: 'normal',
  labelColor: '#374151',
  valueFontSize: 9,
  valueColor: '#FFFFFF',
};