import type { 
  SankeySettings, 
  SankeyData, 
  ProcessedSankeyNode, 
  ProcessedSankeyLink,
  SankeyNode,
  SankeyLink,
  SankeyDataValidator,
  SankeyMetrics
} from '../types';

// ============================================================================
// DEFAULT CONFIGURATIONS
// ============================================================================

export const defaultSankeySettings: SankeySettings = {
  // Base ChartSettings properties
  showValues: true,
  showGridlines: false,
  showAxes: false,
  accentColor: '#6366F1',
  primaryColor: '#374151',
  backgroundColor: '#ffffff',
  title: 'Sankey Diagram',
  areaOpacity: 0.3,
  lineWidth: 2,
  categoryLabelRotation: 0,
  labelSettings: {
    categoryFontSize: 12,
    categoryFontColor: '#374151',
    categoryFontWeight: 'normal',
    valueFontSize: 10,
    valueFontColor: '#374151',
    valueFontWeight: 'normal',
    segmentLabelFontSize: 9,
    segmentLabelFontColor: '#374151',
    segmentLabelFontWeight: 'normal'
  },
  chartDimensions: {
    width: 1000,
    height: 600,
    autoResize: true,
    aspectRatio: 'auto'
  },
  valuePrefix: '',
  valueSuffix: '',

  // Layout configuration
  layout: {
    algorithm: 'default',
    nodeWidth: 40,
    nodeMinHeight: 60,
    nodeSpacing: 30,
    levelSpacing: 150,
    iterations: 15,
    alpha: 0.8,
    alignType: 'justify',
    sortNodes: 'descending',
    levelDistribution: 'automatic'
  },

  // Visual styling
  nodeStyle: {
    fill: '#6366F1',
    stroke: '#4F46E5',
    strokeWidth: 1,
    opacity: 0.9,
    borderRadius: 4,
    gradient: {
      enabled: true,
      direction: 'vertical',
      stops: [
        { offset: 0, color: '#6366F1', opacity: 1 },
        { offset: 1, color: '#4F46E5', opacity: 0.8 }
      ]
    },
    shadow: {
      enabled: true,
      color: 'rgba(0, 0, 0, 0.15)',
      blur: 6,
      offsetX: 0,
      offsetY: 3
    }
  },

  linkStyle: {
    fill: '#94A3B8',
    stroke: 'none',
    strokeWidth: 0,
    opacity: 0.7,
    curvature: 0.6,
    gradient: {
      enabled: true,
      fromSource: true
    }
  },

  labelStyle: {
    fontSize: 12,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontWeight: 'normal',
    color: '#374151',
    background: {
      enabled: false,
      color: '#ffffff',
      padding: 4,
      borderRadius: 2
    },
    shadow: {
      enabled: false,
      color: 'rgba(0, 0, 0, 0.1)',
      blur: 2
    }
  },

  // Color system
  colors: {
    baseline: '#6366F1',
    increase: '#10B981',
    decrease: '#EF4444',
    subtotal: '#8B5CF6',
    total: '#1F2937',
    mode: 'categorical',
    palette: [
      '#2563EB', '#7C3AED', '#DC2626', '#059669', '#D97706',
      '#7C2D12', '#1F2937', '#374151', '#4338CA', '#0891B2'
    ],
    nodeColorBy: 'level',
    linkColorBy: 'source',
    scaleType: 'linear',
    opacity: {
      node: 0.9,
      link: 0.7,
      hover: {
        node: 1.0,
        link: 0.9
      }
    }
  },

  // Animation system
  animation: {
    enabled: true,
    duration: 750,
    easing: 'easeInOut',
    staggerDelay: 50,
    entrance: {
      nodes: 'fade',
      links: 'draw'
    },
    hover: {
      nodes: 'scale',
      links: 'highlight'
    },
    transition: {
      layout: true,
      data: true
    }
  },

  // Interaction system
  interaction: {
    enabled: true,
    pan: {
      enabled: true,
      mouseButton: 'left',
      touchGestures: true
    },
    zoom: {
      enabled: true,
      wheel: true,
      pinch: true,
      minScale: 0.1,
      maxScale: 10,
      center: 'cursor'
    },
    selection: {
      enabled: true,
      mode: 'single',
      highlightConnected: true,
      dimUnselected: true
    },
    hover: {
      enabled: true,
      highlightConnected: true,
      showTooltip: true,
      delay: 200
    },
    drag: {
      enabled: false,
      nodes: false,
      constrainToLevel: true,
      snapToGrid: false,
      gridSize: 10
    }
  },

  // Tooltip system
  tooltip: {
    enabled: true,
    follow: true,
    delay: 200,
    template: {
      node: '<strong>{{name}}</strong><br/>Valor: {{value}}<br/>Nível: {{level}}',
      link: '<strong>{{source}}</strong> → <strong>{{target}}</strong><br/>Valor: {{value}}'
    },
    style: {
      backgroundColor: '#1F2937',
      borderColor: '#374151',
      borderWidth: 1,
      borderRadius: 6,
      padding: 12,
      fontSize: 12,
      fontColor: '#F9FAFB',
      maxWidth: 300,
      shadow: true
    },
    position: 'auto',
    offset: { x: 10, y: 10 }
  },

  // Accessibility
  accessibility: {
    enabled: true,
    announceChanges: true,
    keyboardNavigation: true,
    focusRing: {
      enabled: true,
      color: '#3B82F6',
      width: 2
    },
    labels: {
      chart: 'Diagrama Sankey interativo',
      node: (node: SankeyNode) => `Nó ${node.name} com valor ${node.value}`,
      link: (link: SankeyLink) => `Conexão de ${link.source} para ${link.target} com valor ${link.value}`
    },
    descriptions: {
      chart: 'Diagrama de fluxo mostrando conexões entre diferentes entidades',
      summary: (data: SankeyData) => `${data.nodes.length} nós e ${data.links.length} conexões`
    }
  },

  // Display options
  display: {
    showNodeLabels: true,
    showNodeValues: true,
    showLinkValues: false,
    valueFormat: 'number',
    compactMode: false,
    responsiveBreakpoints: {
      mobile: 480,
      tablet: 768,
      desktop: 1024
    }
  },

  // Data processing
  dataProcessing: {
    aggregateSmallValues: false,
    smallValueThreshold: 0.01,
    aggregateLabel: 'Outros',
    sortLinks: 'value',
    filterMinValue: 0
  }
};

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const sankeyColorPalettes = {
  default: [
    '#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B',
    '#10B981', '#06B6D4', '#84CC16', '#F97316', '#6B7280'
  ],
  categorical: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ],
  warm: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
  ],
  cool: [
    '#74B9FF', '#0984E3', '#6C5CE7', '#A29BFE', '#00B894',
    '#00CEC9', '#2D3436', '#636E72', '#81ECEC', '#55A3FF'
  ],
  pastel: [
    '#FFD93D', '#6BCF7F', '#4D96FF', '#9775FA', '#FF8CC8',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'
  ]
};

// ============================================================================
// DATA VALIDATION
// ============================================================================

export function validateSankeyData(data: SankeyData): SankeyDataValidator {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic structure validation
  if (!data || typeof data !== 'object') {
    errors.push('Dados inválidos: estrutura de dados não encontrada');
    return { isValid: false, errors, warnings };
  }

  if (!Array.isArray(data.nodes)) {
    errors.push('Dados inválidos: propriedade "nodes" deve ser um array');
  }

  if (!Array.isArray(data.links)) {
    errors.push('Dados inválidos: propriedade "links" deve ser um array');
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Node validation
  const nodeIds = new Set<string>();
  data.nodes.forEach((node, index) => {
    if (!node.id) {
      errors.push(`Nó ${index}: ID é obrigatório`);
    } else if (nodeIds.has(node.id)) {
      errors.push(`Nó ${index}: ID "${node.id}" duplicado`);
    } else {
      nodeIds.add(node.id);
    }

    if (!node.name) {
      warnings.push(`Nó ${index}: Nome não definido`);
    }

    if (node.value !== undefined && (typeof node.value !== 'number' || node.value < 0)) {
      warnings.push(`Nó ${index}: Valor deve ser um número positivo`);
    }
  });

  // Link validation
  data.links.forEach((link, index) => {
    if (!link.source) {
      errors.push(`Link ${index}: Source é obrigatório`);
    } else if (!nodeIds.has(link.source)) {
      errors.push(`Link ${index}: Source "${link.source}" não encontrado nos nós`);
    }

    if (!link.target) {
      errors.push(`Link ${index}: Target é obrigatório`);
    } else if (!nodeIds.has(link.target)) {
      errors.push(`Link ${index}: Target "${link.target}" não encontrado nos nós`);
    }

    if (link.source === link.target) {
      warnings.push(`Link ${index}: Self-loop detectado (source = target)`);
    }

    if (typeof link.value !== 'number' || link.value <= 0) {
      errors.push(`Link ${index}: Valor deve ser um número positivo`);
    }
  });

  // Check for isolated nodes
  const connectedNodes = new Set<string>();
  data.links.forEach(link => {
    connectedNodes.add(link.source);
    connectedNodes.add(link.target);
  });

  data.nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) {
      warnings.push(`Nó "${node.name}" (${node.id}) está isolado (sem conexões)`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

// ============================================================================
// DATA METRICS
// ============================================================================

export function calculateSankeyMetrics(data: SankeyData): SankeyMetrics {
  const nodeValues = data.nodes.map(n => n.value || 0).filter(v => v > 0);
  const linkValues = data.links.map(l => l.value).filter(v => v > 0);

  // Calculate levels
  const levels = new Map<string, number>();
  const visited = new Set<string>();
  
  const calculateLevel = (nodeId: string, level = 0): number => {
    if (levels.has(nodeId)) return levels.get(nodeId)!;
    if (visited.has(nodeId)) return level; // Avoid cycles
    
    visited.add(nodeId);
    
    const incomingLinks = data.links.filter(l => l.target === nodeId);
    if (incomingLinks.length === 0) {
      levels.set(nodeId, level);
      return level;
    }
    
    const maxSourceLevel = Math.max(
      ...incomingLinks.map(l => calculateLevel(l.source, level))
    );
    
    const nodeLevel = maxSourceLevel + 1;
    levels.set(nodeId, nodeLevel);
    return nodeLevel;
  };

  data.nodes.forEach(node => calculateLevel(node.id));

  return {
    nodeCount: data.nodes.length,
    linkCount: data.links.length,
    levelCount: Math.max(...Array.from(levels.values())) + 1,
    totalValue: linkValues.reduce((sum, v) => sum + v, 0),
    averageNodeValue: nodeValues.length > 0 ? nodeValues.reduce((sum, v) => sum + v, 0) / nodeValues.length : 0,
    maxNodeValue: nodeValues.length > 0 ? Math.max(...nodeValues) : 0,
    minNodeValue: nodeValues.length > 0 ? Math.min(...nodeValues) : 0,
    averageLinkValue: linkValues.length > 0 ? linkValues.reduce((sum, v) => sum + v, 0) / linkValues.length : 0,
    maxLinkValue: linkValues.length > 0 ? Math.max(...linkValues) : 0,
    minLinkValue: linkValues.length > 0 ? Math.min(...linkValues) : 0
  };
}

// ============================================================================
// LAYOUT ALGORITHM
// ============================================================================

export function processSankeyData(
  data: SankeyData,
  width: number,
  height: number,
  settings: SankeySettings
): { nodes: ProcessedSankeyNode[]; links: ProcessedSankeyLink[] } {
  const { layout } = settings;
  
  // Step 1: Calculate node levels
  const levels = calculateNodeLevels(data);
  const maxLevel = Math.max(...Array.from(levels.values()));
  
  // Step 2: Create processed nodes
  const processedNodes: ProcessedSankeyNode[] = data.nodes.map((node, index) => ({
    ...node,
    x: 0,
    y: 0,
    width: layout.nodeWidth,
    height: layout.nodeMinHeight,
    value: 0,
    level: levels.get(node.id) || 0,
    sourceLinks: [],
    targetLinks: [],
    index,
    dy: 0
  }));

  // Step 3: Calculate node values (sum of connected links)
  processedNodes.forEach(node => {
    const incomingValue = data.links
      .filter(l => l.target === node.id)
      .reduce((sum, l) => sum + l.value, 0);
    const outgoingValue = data.links
      .filter(l => l.source === node.id)
      .reduce((sum, l) => sum + l.value, 0);
    
    node.value = Math.max(incomingValue, outgoingValue, node.value || 0);
  });

  // Step 4: Create processed links
  const processedLinks: ProcessedSankeyLink[] = data.links.map((link, index) => {
    const sourceNode = processedNodes.find(n => n.id === link.source)!;
    const targetNode = processedNodes.find(n => n.id === link.target)!;
    
    return {
      ...link,
      sourceNode,
      targetNode,
      sy0: 0,
      sy1: 0,
      ty0: 0,
      ty1: 0,
      width: 0,
      path: '',
      index
    };
  });

  // Step 5: Update node references
  processedNodes.forEach(node => {
    node.sourceLinks = processedLinks.filter(l => l.source === node.id);
    node.targetLinks = processedLinks.filter(l => l.target === node.id);
  });

  // Step 6: Calculate positions
  calculateNodePositions(processedNodes, processedLinks, width, height, maxLevel, settings);
  
  // Step 7: Calculate link paths
  calculateLinkPaths(processedLinks, settings);

  return { nodes: processedNodes, links: processedLinks };
}

function calculateNodeLevels(data: SankeyData): Map<string, number> {
  const levels = new Map<string, number>();
  const visited = new Set<string>();
  
  const calculateLevel = (nodeId: string): number => {
    if (levels.has(nodeId)) return levels.get(nodeId)!;
    if (visited.has(nodeId)) return 0; // Avoid cycles
    
    visited.add(nodeId);
    
    const incomingLinks = data.links.filter(l => l.target === nodeId);
    if (incomingLinks.length === 0) {
      levels.set(nodeId, 0);
      return 0;
    }
    
    const maxSourceLevel = Math.max(
      ...incomingLinks.map(l => calculateLevel(l.source))
    );
    
    const nodeLevel = maxSourceLevel + 1;
    levels.set(nodeId, nodeLevel);
    return nodeLevel;
  };

  data.nodes.forEach(node => calculateLevel(node.id));
  return levels;
}

function calculateNodePositions(
  nodes: ProcessedSankeyNode[],
  links: ProcessedSankeyLink[],
  width: number,
  height: number,
  maxLevel: number,
  settings: SankeySettings
) {
  const { layout } = settings;
  // Usar margens menores para maximizar espaço
  const margin = { top: 20, right: 30, bottom: 20, left: 30 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  
  // Group nodes by level
  const nodesByLevel: ProcessedSankeyNode[][] = [];
  for (let level = 0; level <= maxLevel; level++) {
    nodesByLevel[level] = nodes.filter(n => n.level === level);
  }

  // Calculate node values based on maximum flow through them
  nodes.forEach(node => {
    const inFlow = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
    const outFlow = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
    node.value = Math.max(inFlow, outFlow, node.value || 0);
  });

  // Calculate maximum flow per level to determine scale
  const levelFlows = nodesByLevel.map(levelNodes => 
    levelNodes.reduce((sum, node) => sum + node.value, 0)
  );
  const maxLevelFlow = Math.max(...levelFlows);
  
  // Use 85% of height for nodes, leaving space for spacing
  const availableHeight = chartHeight * 0.85;
  const flowScale = availableHeight / maxLevelFlow;

  // Calculate node heights with minimum size guarantee
  nodes.forEach(node => {
    const scaledHeight = node.value * flowScale;
    node.height = Math.max(layout.nodeMinHeight, scaledHeight);
    node.dy = node.height;
  });

  // Position nodes horizontally - distribute evenly across width
  if (maxLevel > 0) {
    const levelSpacing = chartWidth / (maxLevel + 1);
    nodesByLevel.forEach((levelNodes, level) => {
      const x = margin.left + (level + 0.5) * levelSpacing - layout.nodeWidth / 2;
      levelNodes.forEach(node => {
        node.x = Math.max(margin.left, Math.min(x, width - margin.right - layout.nodeWidth));
      });
    });
  } else {
    nodes.forEach(node => {
      node.x = margin.left + chartWidth / 2 - layout.nodeWidth / 2;
    });
  }

  // Position nodes vertically - maximize spacing
  nodesByLevel.forEach(levelNodes => {
    if (levelNodes.length === 0) return;
    
    // Sort nodes by value (largest at top)
    levelNodes.sort((a, b) => b.value - a.value);
    
    const totalNodeHeight = levelNodes.reduce((sum, n) => sum + n.height, 0);
    const availableSpace = chartHeight - totalNodeHeight;
    const spacing = Math.max(layout.nodeSpacing, availableSpace / (levelNodes.length + 1));
    
    let currentY = margin.top + spacing;
    levelNodes.forEach(node => {
      node.y = currentY;
      currentY += node.height + spacing;
    });
  });

  // Enhanced relaxation with more aggressive positioning
  for (let i = 0; i < layout.iterations; i++) {
    const alpha = layout.alpha * (1 - i / layout.iterations * 0.5); // Slower decay for more movement
    relaxLeftToRight(nodesByLevel, links, alpha);
    relaxRightToLeft(nodesByLevel, links, alpha);
    
    // Gentle collision resolution to not undo relaxation
    if (i % 3 === 0) { // Only every 3rd iteration
      resolveCollisions(nodesByLevel, layout.nodeSpacing);
    }
  }
}

function relaxLeftToRight(
  nodesByLevel: ProcessedSankeyNode[][],
  _links: ProcessedSankeyLink[],
  alpha: number
) {
  nodesByLevel.forEach(levelNodes => {
    levelNodes.forEach(node => {
      if (node.targetLinks.length === 0) return;
      
      const weightedY = node.targetLinks.reduce((sum, link) => {
        const sourceY = link.sourceNode.y + link.sourceNode.height / 2;
        return sum + sourceY * link.value;
      }, 0);
      
      const totalValue = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
      const targetY = weightedY / totalValue - node.height / 2;
      
      node.y += (targetY - node.y) * alpha;
    });
  });
}

function relaxRightToLeft(
  nodesByLevel: ProcessedSankeyNode[][],
  _links: ProcessedSankeyLink[],
  alpha: number
) {
  for (let level = nodesByLevel.length - 1; level >= 0; level--) {
    nodesByLevel[level].forEach(node => {
      if (node.sourceLinks.length === 0) return;
      
      const weightedY = node.sourceLinks.reduce((sum, link) => {
        const targetY = link.targetNode.y + link.targetNode.height / 2;
        return sum + targetY * link.value;
      }, 0);
      
      const totalValue = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
      const targetY = weightedY / totalValue - node.height / 2;
      
      node.y += (targetY - node.y) * alpha;
    });
  }
}

function resolveCollisions(nodesByLevel: ProcessedSankeyNode[][], minSpacing: number) {
  nodesByLevel.forEach(levelNodes => {
    if (levelNodes.length <= 1) return;
    
    // Sort by current Y position
    levelNodes.sort((a, b) => a.y - b.y);
    
    // Resolve overlaps by pushing nodes down
    for (let i = 1; i < levelNodes.length; i++) {
      const current = levelNodes[i];
      const previous = levelNodes[i - 1];
      
      const minY = previous.y + previous.height + minSpacing;
      if (current.y < minY) {
        current.y = minY;
      }
    }
  });
}

function calculateLinkPaths(links: ProcessedSankeyLink[], settings: SankeySettings) {
  const { linkStyle } = settings;
  
  // Group links by source and target nodes for proper stacking
  const sourceGroups = new Map<string, ProcessedSankeyLink[]>();
  const targetGroups = new Map<string, ProcessedSankeyLink[]>();
  
  links.forEach(link => {
    const sourceId = link.sourceNode.id;
    const targetId = link.targetNode.id;
    
    if (!sourceGroups.has(sourceId)) {
      sourceGroups.set(sourceId, []);
    }
    if (!targetGroups.has(targetId)) {
      targetGroups.set(targetId, []);
    }
    
    sourceGroups.get(sourceId)!.push(link);
    targetGroups.get(targetId)!.push(link);
  });
  
  // Sort links within each group by value (largest first for better visual hierarchy)
  sourceGroups.forEach(links => links.sort((a, b) => b.value - a.value));
  targetGroups.forEach(links => links.sort((a, b) => b.value - a.value));
  
  // Calculate link widths proportional to their values - MUCH larger
  links.forEach(link => {
    const { sourceNode, targetNode } = link;
    
    // Calculate proportional width based on node height and flow value
    const flowRatio = link.value / Math.max(sourceNode.value, targetNode.value);
    const nodeHeight = Math.min(sourceNode.height, targetNode.height);
    
    // Make links much more prominent - use 98% of node height and ensure minimum width
    const calculatedWidth = flowRatio * nodeHeight * 0.98;
    link.width = Math.max(8, calculatedWidth); // Minimum 8px width for visibility
  });
  
  // Position links on source nodes with center alignment
  sourceGroups.forEach((nodeLinks) => {
    const sourceNode = nodeLinks[0].sourceNode;
    const totalLinkHeight = nodeLinks.reduce((sum, link) => sum + link.width, 0);
    const startY = sourceNode.y + (sourceNode.height - totalLinkHeight) / 2;
    
    let currentY = startY;
    nodeLinks.forEach(link => {
      link.sy0 = currentY;
      link.sy1 = currentY + link.width;
      currentY += link.width;
    });
  });
  
  // Position links on target nodes with center alignment
  targetGroups.forEach((nodeLinks) => {
    const targetNode = nodeLinks[0].targetNode;
    const totalLinkHeight = nodeLinks.reduce((sum, link) => sum + link.width, 0);
    const startY = targetNode.y + (targetNode.height - totalLinkHeight) / 2;
    
    let currentY = startY;
    nodeLinks.forEach(link => {
      link.ty0 = currentY;
      link.ty1 = currentY + link.width;
      currentY += link.width;
    });
  });
  
  // Generate paths with professional curves
  links.forEach(link => {
    const { sourceNode, targetNode } = link;
    
    const sourceX = sourceNode.x + sourceNode.width;
    const targetX = targetNode.x;
    
    // Create path for the full link shape (not just center line)
    link.path = generateAdvancedLinkPath(
      sourceX, link.sy0, link.sy1,
      targetX, link.ty0, link.ty1,
      linkStyle.curvature
    );
  });
}

function generateAdvancedLinkPath(
  sourceX: number,
  sourceY0: number,
  sourceY1: number,
  targetX: number,
  targetY0: number,
  targetY1: number,
  curvature: number
): string {
  // Calculate control points for smooth bezier curves
  const xi = (sourceX + targetX) / 2;
  const x1 = sourceX + (xi - sourceX) * curvature;
  const x2 = targetX - (targetX - xi) * curvature;
  
  // Create a path that represents the full width of the link
  const path = [
    `M${sourceX},${sourceY0}`, // Move to top of source
    `C${x1},${sourceY0} ${x2},${targetY0} ${targetX},${targetY0}`, // Curve to top of target
    `L${targetX},${targetY1}`, // Line down to bottom of target
    `C${x2},${targetY1} ${x1},${sourceY1} ${sourceX},${sourceY1}`, // Curve back to bottom of source
    'Z' // Close path
  ].join(' ');
  
  return path;
}


// ============================================================================
// COLOR UTILITIES
// ============================================================================

export function getNodeColor(node: ProcessedSankeyNode, settings: SankeySettings): string {
  const { colors } = settings;
  
  switch (colors.nodeColorBy) {
    case 'index':
      return colors.palette[node.index % colors.palette.length];
    case 'level':
      return colors.palette[node.level % colors.palette.length];
    case 'value':
      return getValueBasedColor(node.value, settings);
    case 'category':
      return node.category ? 
        colors.customMapping?.[node.category] || colors.palette[0] : 
        colors.palette[0];
    case 'custom':
      return node.color || colors.palette[0];
    default:
      return colors.palette[0];
  }
}

export function getLinkColor(link: ProcessedSankeyLink, settings: SankeySettings): string {
  const { colors } = settings;
  
  switch (colors.linkColorBy) {
    case 'source':
      return getNodeColor(link.sourceNode, settings);
    case 'target':
      return getNodeColor(link.targetNode, settings);
    case 'gradient':
      return `url(#gradient-${link.sourceNode.id}-${link.targetNode.id})`;
    case 'value':
      return getValueBasedColor(link.value, settings);
    case 'custom':
      return link.color || colors.palette[0];
    default:
      return getNodeColor(link.sourceNode, settings);
  }
}

function getValueBasedColor(value: number, settings: SankeySettings): string {
  const { colors } = settings;
  const palette = colors.palette;
  
  // This is a simplified version - you could implement more sophisticated color scaling
  const normalizedValue = value / 100; // Assuming max value of 100 for normalization
  const index = Math.min(Math.floor(normalizedValue * palette.length), palette.length - 1);
  return palette[index];
}

// ============================================================================
// TOOLTIP UTILITIES
// ============================================================================

export function generateNodeTooltip(node: ProcessedSankeyNode, template?: string): string {
  const defaultTemplate = '<strong>{{name}}</strong><br/>Valor: {{value}}<br/>Nível: {{level}}';
  const tmpl = template || defaultTemplate;
  
  return tmpl
    .replace(/\{\{name\}\}/g, node.name)
    .replace(/\{\{value\}\}/g, node.value.toLocaleString())
    .replace(/\{\{level\}\}/g, node.level.toString())
    .replace(/\{\{category\}\}/g, node.category || 'N/A');
}

export function generateLinkTooltip(link: ProcessedSankeyLink, template?: string): string {
  const defaultTemplate = '<strong>{{source}}</strong> → <strong>{{target}}</strong><br/>Valor: {{value}}';
  const tmpl = template || defaultTemplate;
  
  return tmpl
    .replace(/\{\{source\}\}/g, link.sourceNode.name)
    .replace(/\{\{target\}\}/g, link.targetNode.name)
    .replace(/\{\{value\}\}/g, link.value.toLocaleString());
}

export function getOptimalTooltipPosition(
  mouseX: number,
  mouseY: number,
  containerWidth: number,
  containerHeight: number,
  tooltipWidth: number,
  tooltipHeight: number,
  offset = { x: 10, y: 10 }
): { x: number; y: number } {
  let x = mouseX + offset.x;
  let y = mouseY + offset.y;
  
  // Adjust if tooltip goes off-screen
  if (x + tooltipWidth > containerWidth) {
    x = mouseX - tooltipWidth - offset.x;
  }
  
  if (y + tooltipHeight > containerHeight) {
    y = mouseY - tooltipHeight - offset.y;
  }
  
  // Ensure tooltip stays within bounds
  x = Math.max(0, Math.min(x, containerWidth - tooltipWidth));
  y = Math.max(0, Math.min(y, containerHeight - tooltipHeight));
  
  return { x, y };
}

// ============================================================================
// SAMPLE DATA GENERATOR
// ============================================================================

export function generateSampleSankeyData(): SankeyData {
  return {
    nodes: [
      { id: 'A', name: 'Fonte A', category: 'entrada', value: 100 },
      { id: 'B', name: 'Fonte B', category: 'entrada', value: 80 },
      { id: 'C', name: 'Fonte C', category: 'entrada', value: 60 },
      { id: 'X', name: 'Processo X', category: 'processo', value: 120 },
      { id: 'Y', name: 'Processo Y', category: 'processo', value: 80 },
      { id: 'Z', name: 'Processo Z', category: 'processo', value: 40 },
      { id: '1', name: 'Saída 1', category: 'saida', value: 80 },
      { id: '2', name: 'Saída 2', category: 'saida', value: 100 },
      { id: '3', name: 'Saída 3', category: 'saida', value: 60 }
    ],
    links: [
      { source: 'A', target: 'X', value: 60 },
      { source: 'A', target: 'Y', value: 40 },
      { source: 'B', target: 'X', value: 50 },
      { source: 'B', target: 'Z', value: 30 },
      { source: 'C', target: 'Y', value: 40 },
      { source: 'C', target: 'Z', value: 20 },
      { source: 'X', target: '1', value: 40 },
      { source: 'X', target: '2', value: 70 },
      { source: 'Y', target: '2', value: 30 },
      { source: 'Y', target: '3', value: 50 },
      { source: 'Z', target: '3', value: 50 }
    ]
  };
}