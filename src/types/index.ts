export interface StackedSegment {
  categoria: string;
  valor: number;
  cor: string;
}

export interface DataRow {
  id: string;
  category: string;
  value: number;
  type: 'baseline' | 'increase' | 'decrease' | 'subtotal' | 'total';
  color?: string;
  group?: string;
  isSubtotal?: boolean;
  segments?: StackedSegment[];
}

export interface ProcessedDataRow extends DataRow {
  start: number;
  end: number;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  processedSegments?: ProcessedSegment[];
}

export interface ProcessedSegment extends StackedSegment {
  y: number;
  height: number;
}

// New Recharts-compatible data interfaces
export interface RechartsDataPoint {
  name: string;
  value: number;
  originalValue: number; // Preserve original category value
  start: number;
  end: number;
  type: 'baseline' | 'increase' | 'decrease' | 'subtotal' | 'total';
  color?: string;
  segments?: StackedSegment[];
  originalData: DataRow;
  id?: string;
}

export interface RechartsSegmentData {
  name: string;
  [key: string]: string | number; // Dynamic keys for each segment
}

export interface ChartSettings {
  barWidth: number;
  barSpacing: number;
  showConnectors: boolean;
  showValues: boolean;
  showCategories: boolean;
  showSegmentLabels: boolean;
  categoryLabelRotation: number; // Ângulo de rotação em graus (0, 45, 90, etc.)
  valuePrefix: string;
  valueSuffix: string;
  showGridlines: boolean;
  showAxes: boolean; // Nova opção para mostrar/ocultar eixos
  accentColor: string; // Cor principal para gráficos de linha e área
  primaryColor: string; // Cor primária para elementos gerais
  backgroundColor: string; // Cor de fundo
  title?: string; // Título opcional do gráfico
  // New label customization settings
  labelSettings: {
    categoryFontSize: number;
    categoryFontColor: string;
    categoryFontWeight: 'normal' | 'bold' | 'bolder';
    valueFontSize: number;
    valueFontColor: string;
    valueFontWeight: 'normal' | 'bold' | 'bolder';
    segmentLabelFontSize: number;
    segmentLabelFontColor: string;
    segmentLabelFontWeight?: 'normal' | 'bold' | 'bolder';
  };
  // Chart dimensions settings
  chartDimensions: {
    width: number;
    height: number;
    autoResize: boolean;
    aspectRatio: 'auto' | '16:9' | '4:3' | '1:1' | 'custom';
  };
  colors: {
    baseline: string;
    increase: string;
    decrease: string;
    subtotal: string;
    total: string;
  };
  // Configurações específicas do Sankey (opcionais)
  sankeySettings?: SankeySettings;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// Chart Types
export type ChartType = 'waterfall' | 'sankey' | 'stacked-bar' | 'line' | 'area';

export interface ChartTypeConfig {
  id: ChartType;
  name: string;
  description: string;
  icon: string;
  supportedFeatures: {
    stackedSegments: boolean;
    connectors: boolean;
    values: boolean;
    categories: boolean;
    gridlines: boolean;
    axes: boolean;
    colors: boolean;
    annotations: boolean;
  };
}

// Sankey specific types
export interface SankeyNode {
  id: string;
  name: string;
  color?: string;
  level?: number;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Sankey-specific configuration settings
export interface SankeySettings {
  // Node settings
  nodeWidth: number;
  nodeMinHeight: number;
  nodeSpacing: number;
  nodeBorderRadius: number;
  nodeOpacity: number;
  
  // Link settings
  linkOpacity: number;
  linkCurvature: number;
  linkGradient: boolean;
  linkHoverOpacity: number;
  
  // Layout settings
  iterations: number;
  spacingRatio: number;
  minSpacing: number;
  compressionThreshold: number;
  
  // Visual settings
  showNodeLabels: boolean;
  showNodeValues: boolean;
  showTooltips: boolean;
  animationDuration: number;
  
  // Color settings
  colorScheme: 'default' | 'categorical' | 'gradient' | 'custom';
  customColors: string[];
  linkColorMode: 'source' | 'target' | 'gradient' | 'custom';
  
  // Typography
  labelFontSize: number;
  labelFontWeight: 'normal' | 'bold' | 'bolder';
  labelColor: string;
  valueFontSize: number;
  valueColor: string;
}

// Generic chart data interface
export interface ChartData {
  type: ChartType;
  waterfall?: DataRow[];
  sankey?: SankeyData;
  stackedBar?: DataRow[];
  line?: DataRow[];
  area?: DataRow[];
}

// Saved View System Types
export interface SavedView {
  id: string;
  name: string;
  description?: string;
  data: ChartData;
  settings: ChartSettings;
  chartType: ChartType;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

export interface SavedViewPreview {
  id: string;
  name: string;
  description?: string;
  chartType: ChartType;
  createdAt: Date;
  updatedAt: Date;
  dataCount: number;
  thumbnail?: string;
}