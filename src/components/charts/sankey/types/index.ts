import type { ChartSettings } from '../../../../types';

// Tipos base para o Sankey
export interface SankeyNode {
  id: string;
  name: string;
  category?: string;
  value?: number;
  color?: string;
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

// Nós processados para renderização
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
}

// Links processados para renderização
export interface ProcessedSankeyLink extends SankeyLink {
  sourceNode: ProcessedSankeyNode;
  targetNode: ProcessedSankeyNode;
  sy0: number;
  sy1: number;
  ty0: number;
  ty1: number;
  width: number;
  path: string;
}

// Transform para zoom e pan
export interface SankeyTransform {
  x: number;
  y: number;
  scale: number;
}

// Tooltip específico do Sankey
export interface SankeyTooltip {
  show: boolean;
  x: number;
  y: number;
  content: string;
  type: 'node' | 'link';
}

// Configurações específicas do Sankey
export interface SankeySettings extends ChartSettings {
  // Configurações dos nós
  nodeWidth: number;
  nodeMinHeight: number;
  nodeSpacing: number;
  nodeBorderRadius: number;
  nodeOpacity: number;
  
  // Configurações dos links
  linkOpacity: number;
  linkCurvature: number;
  linkHoverOpacity: number;
  linkGradient: boolean;
  linkColorMode: 'source' | 'target' | 'gradient' | 'custom';
  
  // Layout
  iterations: number;
  spacingRatio: number;
  minSpacing: number;
  compressionThreshold: number;
  
  // Visual
  showNodeLabels: boolean;
  showNodeValues: boolean;
  showTooltips: boolean;
  animationDuration: number;
  
  // Cores
  colorScheme: 'default' | 'categorical' | 'gradient' | 'custom';
  customColors: string[];
  
  // Tipografia
  labelFontSize: number;
  labelFontWeight: 'normal' | 'bold' | 'bolder';
  labelColor: string;
  valueFontSize: number;
  valueColor: string;
}

// Props do componente principal
export interface SankeyChartProps {
  data: SankeyData;
  settings: SankeySettings;
  width?: number;
  height?: number;
}

// Props dos componentes internos
export interface SankeyNodesProps {
  nodes: ProcessedSankeyNode[];
  settings: SankeySettings;
  hoveredElement: string | null;
  onNodeHover: (event: React.MouseEvent, node: ProcessedSankeyNode) => void;
  onMouseLeave: () => void;
  getNodeColor: (index: number) => string;
}

export interface SankeyLinksProps {
  links: ProcessedSankeyLink[];
  settings: SankeySettings;
  hoveredElement: string | null;
  onLinkHover: (event: React.MouseEvent, link: ProcessedSankeyLink) => void;
  onMouseLeave: () => void;
}

export interface SankeyTooltipProps {
  tooltip: SankeyTooltip;
}

export interface SankeyControlsProps {
  transform: SankeyTransform;
  onTransformChange: (transform: SankeyTransform) => void;
  onReset: () => void;
}