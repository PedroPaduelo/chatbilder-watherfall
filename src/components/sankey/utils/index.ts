import type { SankeySettings, SankeyData, ProcessedSankeyNode, ProcessedSankeyLink } from '../types';

// Configurações padrão do Sankey
export const defaultSankeySettings: SankeySettings = {
  // Base ChartSettings properties
  barWidth: 60,
  barSpacing: 20,
  showConnectors: false, // Not applicable for Sankey
  showValues: true,
  showCategories: false, // Not applicable for Sankey  
  showSegmentLabels: false, // Not applicable for Sankey
  categoryLabelRotation: 0,
  valuePrefix: '',
  valueSuffix: '',
  showGridlines: false, // Not needed for Sankey
  showAxes: false, // Not applicable for Sankey
  accentColor: '#6366F1',
  primaryColor: '#374151',
  backgroundColor: '#ffffff',
  title: 'Sankey Diagram',
  areaOpacity: 0.3,
  lineWidth: 2,
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
    width: 900,
    height: 500,
    autoResize: true,
    aspectRatio: 'auto'
  },
  colors: {
    baseline: '#6366F1',
    increase: '#10B981',
    decrease: '#EF4444',
    subtotal: '#8B5CF6',
    total: '#1F2937'
  },
  
  // Sankey-specific properties
  nodeWidth: 15,
  nodeMinHeight: 20,
  nodeSpacing: 30,
  nodeBorderRadius: 2,
  nodeOpacity: 0.9,
  
  // Configurações dos links
  linkOpacity: 0.5,
  linkCurvature: 0.5,
  linkHoverOpacity: 0.8,
  linkGradient: true,
  linkColorMode: 'gradient',
  
  // Layout
  iterations: 5,
  spacingRatio: 0.7,
  minSpacing: 30,
  compressionThreshold: 0.9,
  
  // Visual
  showNodeLabels: true,
  showNodeValues: true,
  showTooltips: true,
  animationDuration: 300,
  
  // Cores
  colorScheme: 'default',
  customColors: [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
  ],
  
  // Tipografia
  labelFontSize: 11,
  labelFontWeight: 'normal',
  labelColor: '#374151',
  valueFontSize: 9,
  valueColor: '#ffffff'
};

// Paleta de cores para nós
export const sankeyColorPalettes = {
  default: [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
  ],
  categorical: [
    '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
    '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
  ],
  gradient: [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]
};

// Função para validar dados do Sankey
export const validateSankeyData = (data: SankeyData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Verificar se há nós
  if (!data.nodes || data.nodes.length === 0) {
    errors.push('Dados devem conter pelo menos um nó');
  }

  // Verificar se há links
  if (!data.links || data.links.length === 0) {
    errors.push('Dados devem conter pelo menos um link');
  }

  // Verificar estrutura dos nós
  data.nodes.forEach((node, index) => {
    if (!node.id) {
      errors.push(`Nó ${index + 1} deve ter um ID`);
    }
    if (!node.name) {
      errors.push(`Nó ${index + 1} deve ter um nome`);
    }
  });

  // Verificar estrutura dos links
  const nodeIds = new Set(data.nodes.map(node => node.id));
  data.links.forEach((link, index) => {
    if (!link.source) {
      errors.push(`Link ${index + 1} deve ter um nó de origem`);
    } else if (!nodeIds.has(link.source)) {
      errors.push(`Link ${index + 1}: nó de origem '${link.source}' não encontrado`);
    }
    
    if (!link.target) {
      errors.push(`Link ${index + 1} deve ter um nó de destino`);
    } else if (!nodeIds.has(link.target)) {
      errors.push(`Link ${index + 1}: nó de destino '${link.target}' não encontrado`);
    }
    
    if (typeof link.value !== 'number' || link.value <= 0) {
      errors.push(`Link ${index + 1} deve ter um valor numérico positivo`);
    }
  });

  // Verificar ciclos simples
  const checkForSimpleCycles = () => {
    const visited = new Set<string>();
    const path = new Set<string>();
    
    const hasCycle = (nodeId: string): boolean => {
      if (path.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      path.add(nodeId);
      
      const outgoingLinks = data.links.filter(link => link.source === nodeId);
      for (const link of outgoingLinks) {
        if (hasCycle(link.target)) return true;
      }
      
      path.delete(nodeId);
      return false;
    };
    
    for (const node of data.nodes) {
      if (!visited.has(node.id) && hasCycle(node.id)) {
        errors.push('Detectado ciclo nos dados - isso pode causar problemas no layout');
        break;
      }
    }
  };

  if (data.nodes.length > 0 && data.links.length > 0) {
    checkForSimpleCycles();
  }

  return { isValid: errors.length === 0, errors };
};

// Função para calcular estatísticas do diagrama
export const calculateSankeyStats = (nodes: ProcessedSankeyNode[], links: ProcessedSankeyLink[]) => {
  const totalFlow = links.reduce((sum, link) => sum + link.value, 0);
  const maxNodeValue = Math.max(...nodes.map(node => node.value));
  const minNodeValue = Math.min(...nodes.map(node => node.value));
  const avgNodeValue = nodes.reduce((sum, node) => sum + node.value, 0) / nodes.length;
  
  const levels = Math.max(...nodes.map(node => node.level)) + 1;
  const nodesByLevel = Array.from({ length: levels }, (_, i) => 
    nodes.filter(node => node.level === i).length
  );
  
  const sourceNodes = nodes.filter(node => node.targetLinks.length === 0).length;
  const targetNodes = nodes.filter(node => node.sourceLinks.length === 0).length;
  const intermediateNodes = nodes.length - sourceNodes - targetNodes;
  
  return {
    totalFlow,
    nodeCount: nodes.length,
    linkCount: links.length,
    levels,
    nodesByLevel,
    sourceNodes,
    targetNodes,
    intermediateNodes,
    maxNodeValue,
    minNodeValue,
    avgNodeValue: Math.round(avgNodeValue * 100) / 100
  };
};

// Função para gerar tooltip de nó
export const generateNodeTooltip = (node: ProcessedSankeyNode): string => {
  const totalInFlow = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
  const totalOutFlow = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
  const efficiency = totalOutFlow > 0 ? ((totalOutFlow / totalInFlow) * 100).toFixed(1) : '100.0';
  
  return [
    `📍 ${node.name}`,
    `💰 Value: ${node.value.toLocaleString()}`,
    `📊 Level: ${node.level + 1}`,
    totalInFlow > 0 && `⬇️ In-flow: ${totalInFlow.toLocaleString()}`,
    totalOutFlow > 0 && `⬆️ Out-flow: ${totalOutFlow.toLocaleString()}`,
    totalInFlow > 0 && totalOutFlow > 0 && `⚡ Efficiency: ${efficiency}%`,
    `🔗 Connections: ${node.sourceLinks.length + node.targetLinks.length}`,
  ].filter(Boolean).join('\n');
};

// Função para gerar tooltip de link
export const generateLinkTooltip = (link: ProcessedSankeyLink): string => {
  const sourcePercentage = ((link.value / link.sourceNode.value) * 100).toFixed(1);
  const targetPercentage = link.targetNode.value > 0 ? 
    ((link.value / link.targetNode.value) * 100).toFixed(1) : '100.0';
  
  return [
    `🔄 ${link.sourceNode.name} → ${link.targetNode.name}`,
    `💸 Flow: ${link.value.toLocaleString()}`,
    `📈 From source: ${sourcePercentage}%`,
    `📉 To target: ${targetPercentage}%`,
    `🎯 Flow efficiency: ${(Math.min(+sourcePercentage, +targetPercentage)).toFixed(1)}%`,
  ].join('\n');
};

// Função para otimizar posicionamento de tooltip
export const getOptimalTooltipPosition = (
  mouseX: number, 
  mouseY: number, 
  containerWidth: number, 
  containerHeight: number,
  tooltipWidth = 250, 
  tooltipHeight = 80
) => {
  let x = mouseX + 15;
  let y = mouseY - 15;
  
  // Ajustar horizontalmente se sair da tela
  if (x + tooltipWidth > containerWidth) {
    x = mouseX - tooltipWidth - 15;
  }
  
  // Ajustar verticalmente se sair da tela
  if (y - tooltipHeight < 0) {
    y = mouseY + 15;
  } else if (y > containerHeight - tooltipHeight) {
    y = containerHeight - tooltipHeight - 10;
  }
  
  return { x: Math.max(10, x), y: Math.max(10, y) };
};

// Função para obter cor do nó baseada no esquema
export const getNodeColor = (index: number, settings: SankeySettings): string => {
  const paletteMap = {
    default: sankeyColorPalettes.default,
    categorical: sankeyColorPalettes.categorical,
    gradient: sankeyColorPalettes.gradient
  };
  
  const palette = paletteMap[settings.colorScheme as keyof typeof paletteMap] || sankeyColorPalettes.default;
  
  if (settings.colorScheme === 'custom' && settings.customColors && settings.customColors.length > 0) {
    return settings.customColors[index % settings.customColors.length];
  }
  
  return palette[index % palette.length];
};

// Função para processar dados brutos do Sankey
export const processRawSankeyData = (rawData: any): { data: SankeyData; validation: { isValid: boolean; errors: string[]; warnings: string[] } } => {
  const validation = { isValid: true, errors: [] as string[], warnings: [] as string[] };
  
  if (!rawData) {
    validation.isValid = false;
    validation.errors.push('Dados não fornecidos');
    return { data: { nodes: [], links: [] }, validation };
  }

  const nodes: any[] = [];
  const links: any[] = [];

  try {
    // Se for um array, assumir que são links no formato source,target,value
    if (Array.isArray(rawData)) {
      const nodeIds = new Set<string>();
      
      rawData.forEach((row, index) => {
        if (typeof row === 'object' && row.source && row.target && row.value !== undefined) {
          nodeIds.add(String(row.source));
          nodeIds.add(String(row.target));
          links.push({
            source: String(row.source),
            target: String(row.target),
            value: Number(row.value) || 0
          });
        } else {
          validation.warnings.push(`Linha ${index + 1}: formato inválido, ignorando`);
        }
      });

      // Criar nós a partir dos IDs únicos
      Array.from(nodeIds).forEach(id => {
        nodes.push({ id, name: id });
      });

    } else if (rawData.nodes && rawData.links) {
      // Formato direto com nodes e links
      if (Array.isArray(rawData.nodes)) {
        rawData.nodes.forEach((node: any) => {
          if (node.id) {
            nodes.push({
              id: String(node.id),
              name: String(node.name || node.id)
            });
          }
        });
      }

      if (Array.isArray(rawData.links)) {
        rawData.links.forEach((link: any) => {
          if (link.source && link.target && link.value !== undefined) {
            links.push({
              source: String(link.source),
              target: String(link.target),
              value: Number(link.value) || 0
            });
          }
        });
      }
    }

    if (nodes.length === 0) {
      validation.isValid = false;
      validation.errors.push('Nenhum nó válido encontrado');
    }

    if (links.length === 0) {
      validation.isValid = false;
      validation.errors.push('Nenhum link válido encontrado');
    }

  } catch (error) {
    validation.isValid = false;
    validation.errors.push(`Erro ao processar dados: ${error}`);
  }

  return { data: { nodes, links }, validation };
};

// Função para calcular cores de gradiente para links
export const getLinkGradientColors = (
  link: ProcessedSankeyLink, 
  settings: SankeySettings, 
  getNodeColor: (index: number) => string,
  sourceIndex: number,
  targetIndex: number
): { sourceColor: string; targetColor: string } => {
  switch (settings.linkColorMode) {
    case 'source':
      const sourceColor = getNodeColor(sourceIndex);
      return { sourceColor, targetColor: sourceColor };
    
    case 'target':
      const targetColor = getNodeColor(targetIndex);
      return { sourceColor: targetColor, targetColor };
    
    case 'gradient':
      return {
        sourceColor: getNodeColor(sourceIndex),
        targetColor: getNodeColor(targetIndex)
      };
    
    case 'custom':
      return {
        sourceColor: link.color || '#3B82F6',
        targetColor: link.color || '#3B82F6'
      };
    
    default:
      return {
        sourceColor: getNodeColor(sourceIndex),
        targetColor: getNodeColor(targetIndex)
      };
  }
};