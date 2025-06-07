import type { ChartSettings } from '../../../../types';

// ============================================================================
// CORE DATA STRUCTURES
// ============================================================================

export interface SankeyNode {
  id: string;
  name: string;
  category?: string;
  value?: number;
  color?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// ============================================================================
// PROCESSED DATA FOR RENDERING
// ============================================================================

export interface ProcessedSankeyNode extends SankeyNode {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  level: number;
  sourceLinks: ProcessedSankeyLink[];
  targetLinks: ProcessedSankeyLink[];
  index: number;
  dy: number; // height of each node
}

export interface ProcessedSankeyLink extends SankeyLink {
  sourceNode: ProcessedSankeyNode;
  targetNode: ProcessedSankeyNode;
  sy0: number; // source y0
  sy1: number; // source y1
  ty0: number; // target y0
  ty1: number; // target y1
  width: number;
  path: string;
  index: number;
}

// ============================================================================
// INTERACTION & STATE
// ============================================================================

export interface SankeyTransform {
  x: number;
  y: number;
  scale: number;
}

export interface SankeyTooltip {
  show: boolean;
  x: number;
  y: number;
  content: string;
  type: 'node' | 'link';
  data?: SankeyNode | SankeyLink;
}

export interface SankeySelection {
  type: 'node' | 'link' | null;
  id: string | null;
  highlighted: string[];
}

// ============================================================================
// ANIMATION SYSTEM
// ============================================================================

export interface SankeyAnimationConfig {
  enabled: boolean;
  duration: number;
  easing: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' | 'bounce';
  staggerDelay: number;
  entrance: {
    nodes: 'fade' | 'scale' | 'slide' | 'none';
    links: 'fade' | 'draw' | 'flow' | 'none';
  };
  hover: {
    nodes: 'scale' | 'glow' | 'none';
    links: 'highlight' | 'thicken' | 'none';
  };
  transition: {
    layout: boolean;
    data: boolean;
  };
}

// ============================================================================
// STYLING SYSTEM
// ============================================================================

export interface SankeyNodeStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  borderRadius: number;
  gradient?: {
    enabled: boolean;
    direction: 'vertical' | 'horizontal';
    stops: Array<{ offset: number; color: string; opacity?: number }>;
  };
  shadow?: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export interface SankeyLinkStyle {
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  curvature: number;
  gradient?: {
    enabled: boolean;
    fromSource: boolean;
  };
}

export interface SankeyLabelStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold' | 'bolder' | 'lighter';
  color: string;
  background?: {
    enabled: boolean;
    color: string;
    padding: number;
    borderRadius: number;
  };
  shadow?: {
    enabled: boolean;
    color: string;
    blur: number;
  };
}

// ============================================================================
// LAYOUT ALGORITHMS
// ============================================================================

export type SankeyLayoutAlgorithm = 'default' | 'optimized' | 'circular' | 'hierarchical';

export interface SankeyLayoutConfig {
  algorithm: SankeyLayoutAlgorithm;
  nodeWidth: number;
  nodeMinHeight: number;
  nodeSpacing: number;
  levelSpacing: number;
  iterations: number;
  alpha: number; // relaxation parameter
  alignType: 'left' | 'right' | 'center' | 'justify';
  sortNodes: 'none' | 'ascending' | 'descending' | 'alphabetical';
  levelDistribution: 'automatic' | 'manual';
  manualLevels?: Record<string, number>;
}

// ============================================================================
// COLOR SYSTEM
// ============================================================================

export type SankeyColorMode = 'categorical' | 'sequential' | 'diverging' | 'custom';

export interface SankeyColorConfig {
  baseline: string;
  increase: string;
  decrease: string;
  subtotal: string;
  total: string;
  mode: SankeyColorMode;
  palette: string[];
  nodeColorBy: 'index' | 'level' | 'value' | 'category' | 'custom';
  linkColorBy: 'source' | 'target' | 'gradient' | 'value' | 'custom';
  scaleType: 'linear' | 'log' | 'sqrt';
  customMapping?: Record<string, string>;
  opacity: {
    node: number;
    link: number;
    hover: {
      node: number;
      link: number;
    };
  };
}

// ============================================================================
// INTERACTION SYSTEM
// ============================================================================

export interface SankeyInteractionConfig {
  enabled: boolean;
  pan: {
    enabled: boolean;
    mouseButton: 'left' | 'right' | 'middle';
    touchGestures: boolean;
  };
  zoom: {
    enabled: boolean;
    wheel: boolean;
    pinch: boolean;
    minScale: number;
    maxScale: number;
    center: 'cursor' | 'viewport';
  };
  selection: {
    enabled: boolean;
    mode: 'single' | 'multiple';
    highlightConnected: boolean;
    dimUnselected: boolean;
  };
  hover: {
    enabled: boolean;
    highlightConnected: boolean;
    showTooltip: boolean;
    delay: number;
  };
  drag: {
    enabled: boolean;
    nodes: boolean;
    constrainToLevel: boolean;
    snapToGrid: boolean;
    gridSize: number;
  };
}

// ============================================================================
// TOOLTIP SYSTEM
// ============================================================================

export interface SankeyTooltipConfig {
  enabled: boolean;
  follow: boolean;
  delay: number;
  template: {
    node: string;
    link: string;
  };
  style: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
    fontSize: number;
    fontColor: string;
    maxWidth: number;
    shadow: boolean;
  };
  position: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  offset: { x: number; y: number };
}

// ============================================================================
// ACCESSIBILITY
// ============================================================================

export interface SankeyAccessibilityConfig {
  enabled: boolean;
  announceChanges: boolean;
  keyboardNavigation: boolean;
  focusRing: {
    enabled: boolean;
    color: string;
    width: number;
  };
  labels: {
    chart: string;
    node: (node: SankeyNode) => string;
    link: (link: SankeyLink) => string;
  };
  descriptions: {
    chart: string;
    summary: (data: SankeyData) => string;
  };
}

// ============================================================================
// MAIN SETTINGS INTERFACE
// ============================================================================

export interface SankeySettings extends Omit<ChartSettings, 'barWidth' | 'barSpacing' | 'showConnectors' | 'showCategories' | 'showSegmentLabels'> {
  // Layout configuration
  layout: SankeyLayoutConfig;
  
  // Visual styling
  nodeStyle: SankeyNodeStyle;
  linkStyle: SankeyLinkStyle;
  labelStyle: SankeyLabelStyle;
  
  // Color system
  colors: SankeyColorConfig;
  
  // Animation system
  animation: SankeyAnimationConfig;
  
  // Interaction system
  interaction: SankeyInteractionConfig;
  
  // Tooltip system
  tooltip: SankeyTooltipConfig;
  
  // Accessibility
  accessibility: SankeyAccessibilityConfig;
  
  // Display options
  display: {
    showNodeLabels: boolean;
    showNodeValues: boolean;
    showLinkValues: boolean;
    valueFormat: 'number' | 'percentage' | 'currency' | 'custom';
    customValueFormat?: (value: number) => string;
    compactMode: boolean;
    responsiveBreakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
  };
  
  // Data processing
  dataProcessing: {
    aggregateSmallValues: boolean;
    smallValueThreshold: number;
    aggregateLabel: string;
    sortLinks: 'none' | 'value' | 'alphabetical';
    filterMinValue: number;
  };
}

// ============================================================================
// COMPONENT PROPS
// ============================================================================

export interface SankeyChartProps {
  data: SankeyData;
  settings: SankeySettings;
  width?: number;
  height?: number;
  onNodeClick?: (node: SankeyNode, event: React.MouseEvent) => void;
  onLinkClick?: (link: SankeyLink, event: React.MouseEvent) => void;
  onSelectionChange?: (selection: SankeySelection) => void;
  onTransformChange?: (transform: SankeyTransform) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface SankeyNodesProps {
  nodes: ProcessedSankeyNode[];
  settings: SankeySettings;
  selection: SankeySelection;
  transform: SankeyTransform;
  onNodeClick: (node: ProcessedSankeyNode, event: React.MouseEvent) => void;
  onNodeHover: (node: ProcessedSankeyNode | null, event?: React.MouseEvent) => void;
  getNodeColor: (node: ProcessedSankeyNode) => string;
}

export interface SankeyLinksProps {
  links: ProcessedSankeyLink[];
  settings: SankeySettings;
  selection: SankeySelection;
  transform: SankeyTransform;
  onLinkClick: (link: ProcessedSankeyLink, event: React.MouseEvent) => void;
  onLinkHover: (link: ProcessedSankeyLink | null, event?: React.MouseEvent) => void;
  getLinkColor: (link: ProcessedSankeyLink) => string;
}

export interface SankeyLabelsProps {
  nodes: ProcessedSankeyNode[];
  settings: SankeySettings;
  transform: SankeyTransform;
}

export interface SankeyTooltipProps {
  tooltip: SankeyTooltip;
  settings: SankeyTooltipConfig;
}

export interface SankeyControlsProps {
  transform: SankeyTransform;
  settings: SankeySettings;
  onTransformChange: (transform: SankeyTransform) => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToView: () => void;
}

export interface SankeyConfigProps {
  settings: SankeySettings;
  onSettingsChange: (settings: SankeySettings) => void;
  onReset: () => void;
  onPresetApply: (preset: string) => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface SankeyDataValidator {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SankeyMetrics {
  nodeCount: number;
  linkCount: number;
  levelCount: number;
  totalValue: number;
  averageNodeValue: number;
  maxNodeValue: number;
  minNodeValue: number;
  averageLinkValue: number;
  maxLinkValue: number;
  minLinkValue: number;
}

export interface SankeyExportOptions {
  format: 'svg' | 'png' | 'pdf' | 'json' | 'csv';
  quality?: number;
  resolution?: number;
  includeStyles?: boolean;
  backgroundColor?: string;
}

// ============================================================================
// PRESET CONFIGURATIONS
// ============================================================================

export interface SankeyPreset {
  id: string;
  name: string;
  description: string;
  settings: Partial<SankeySettings>;
  preview?: string;
}

export interface SankeyTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
}