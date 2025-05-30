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
  start: number;
  end: number;
  type: 'baseline' | 'increase' | 'decrease' | 'subtotal' | 'total';
  color?: string;
  segments?: StackedSegment[];
  originalData: DataRow;
}

export interface RechartsSegmentData {
  name: string;
  [key: string]: string | number; // Dynamic keys for each segment
}

export interface ChartSettings {
  barWidth: number;
  barSpacing: number;
  borderRadius: number;
  showConnectors: boolean;
  showValues: boolean;
  showCategories: boolean;
  showSegmentLabels: boolean;
  categoryLabelRotation: number; // Ângulo de rotação em graus (0, 45, 90, etc.)
  valuePrefix: string;
  valueSuffix: string;
  showGridlines: boolean;
  showAxes: boolean; // Nova opção para mostrar/ocultar eixos
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

// Saved View System Types
export interface SavedView {
  id: string;
  name: string;
  description?: string;
  data: DataRow[];
  settings: ChartSettings;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string; // Base64 da miniatura
}

export interface SavedViewPreview {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  dataCount: number;
  thumbnail?: string;
}