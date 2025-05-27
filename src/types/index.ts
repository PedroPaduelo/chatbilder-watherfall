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

export interface ChartSettings {
  barWidth: number;
  barSpacing: number;
  borderRadius: number;
  showConnectors: boolean;
  showValues: boolean;
  showCategories: boolean;
  showSegmentLabels: boolean;
  valuePrefix: string;
  valueSuffix: string;
  showGridlines: boolean;
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