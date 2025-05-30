import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import type { SankeyData, SankeyNode, SankeyLink, ChartSettings } from '../types';

interface SankeyChartProps {
  data: SankeyData;
  settings: ChartSettings;
  width?: number;
  height?: number;
}

interface ProcessedNode extends SankeyNode {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  level: number;
  sourceLinks: ProcessedLink[];
  targetLinks: ProcessedLink[];
  index: number; // Para ordenação estável
}

interface ProcessedLink extends SankeyLink {
  sourceNode: ProcessedNode;
  targetNode: ProcessedNode;
  sy0: number;
  sy1: number;
  ty0: number;
  ty1: number;
  width: number;
  path: string;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  settings,
  width = 900,
  height = 500,
}) => {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
    type: 'node' | 'link';
  }>({ show: false, x: 0, y: 0, content: '', type: 'node' });

  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transform, setTransform] = useState<Transform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const processedData = useMemo(() => {
    if (!data.nodes.length || !data.links.length) {
      return { nodes: [], links: [] };
    }

    setIsAnimating(true);
    
    // Usar timeout para mostrar loading state brevemente
    setTimeout(() => setIsAnimating(false), 300);

    // Criar mapa de nós
    const nodeMap = new Map<string, ProcessedNode>();
    
    data.nodes.forEach((node, index) => {
      nodeMap.set(node.id, {
        ...node,
        x: 0,
        y: 0,
        width: 15,
        height: 0,
        value: 0,
        level: 0,
        sourceLinks: [],
        targetLinks: [],
        index,
      });
    });

    const nodes = Array.from(nodeMap.values());
    const links: ProcessedLink[] = [];

    // Processar links
    data.links.forEach(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (!sourceNode || !targetNode) return;

      const processedLink: ProcessedLink = {
        ...link,
        sourceNode,
        targetNode,
        sy0: 0,
        sy1: 0,
        ty0: 0,
        ty1: 0,
        width: 0,
        path: '',
      };

      sourceNode.sourceLinks.push(processedLink);
      targetNode.targetLinks.push(processedLink);
      links.push(processedLink);
    });

    // Calcular valores dos nós
    nodes.forEach(node => {
      const inValue = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
      const outValue = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
      node.value = Math.max(inValue, outValue) || 1;
    });

    // Calcular níveis (colunas) dos nós com detecção de ciclos
    const calculateLevels = () => {
      const levels = new Map<string, number>();
      const visiting = new Set<string>();
      const visited = new Set<string>();
      
      const visit = (nodeId: string): number => {
        if (visiting.has(nodeId)) {
          // Ciclo detectado - usar nível baseado na posição no array
          console.warn(`Cycle detected involving node: ${nodeId}`);
          const node = nodeMap.get(nodeId)!;
          return node.index % 3; // Distribuir em 3 níveis como fallback
        }
        
        if (visited.has(nodeId)) {
          return levels.get(nodeId) || 0;
        }
        
        visiting.add(nodeId);
        const node = nodeMap.get(nodeId)!;
        
        if (node.targetLinks.length === 0) {
          levels.set(nodeId, 0);
          visiting.delete(nodeId);
          visited.add(nodeId);
          return 0;
        }
        
        let maxLevel = -1;
        node.targetLinks.forEach(link => {
          const sourceLevel = visit(link.source);
          maxLevel = Math.max(maxLevel, sourceLevel);
        });
        
        const level = maxLevel + 1;
        levels.set(nodeId, level);
        visiting.delete(nodeId);
        visited.add(nodeId);
        return level;
      };

      nodes.forEach(node => visit(node.id));
      return levels;
    };

    const levels = calculateLevels();
    nodes.forEach(node => {
      node.level = levels.get(node.id) || 0;
    });

    // Agrupar nós por nível
    const nodesByLevel: ProcessedNode[][] = [];
    const maxLevel = Math.max(...nodes.map(n => n.level));
    
    for (let i = 0; i <= maxLevel; i++) {
      nodesByLevel[i] = nodes.filter(n => n.level === i);
    }

    // Calcular escala de altura
    const totalValue = Math.max(...nodes.map(n => n.value));
    const heightScale = (chartHeight * 0.7) / totalValue; // Reduzir para dar mais espaço

    // Calcular alturas dos nós
    nodes.forEach(node => {
      node.height = Math.max(12, node.value * heightScale); // Altura mínima maior
    });

    // Posicionar nós horizontalmente
    const levelWidth = Math.max(80, chartWidth / (nodesByLevel.length)); // Largura mínima ajustada
    nodesByLevel.forEach((levelNodes, level) => {
      const x = level * levelWidth + levelWidth / 2 - 7.5;
      levelNodes.forEach(node => {
        node.x = x;
      });
    });

    // Nova lógica de posicionamento vertical para ocupar toda a altura
    const positionVertically = () => {
      nodesByLevel.forEach(levelNodes => {
        // Ordenar nós por valor para estabilidade
        levelNodes.sort((a, b) => b.value - a.value || a.index - b.index);
        const totalNodeHeight = levelNodes.reduce((sum, node) => sum + node.height, 0);
        const n = levelNodes.length;
        let spacing = 0;
        if (n > 1) {
          spacing = (chartHeight - totalNodeHeight) / (n - 1);
        } else {
          // Se só tem um nó, centraliza
          spacing = 0;
        }
        let currentY = 0;
        levelNodes.forEach((node, i) => {
          // Se só tem um nó, centraliza
          if (n === 1) {
            node.y = (chartHeight - node.height) / 2;
          } else {
            node.y = currentY;
            currentY += node.height + spacing;
          }
        });
      });

      // Otimização iterativa para resolver sobreposições
      const maxIterations = 20;
      const alpha = 0.5; // Fator de amortecimento ajustado para convergência mais suave

      for (let iteration = 0; iteration < maxIterations; iteration++) {
        let totalMovement = 0;

        // Ajustar baseado nos targets (esquerda para direita)
        for (let level = 0; level < nodesByLevel.length - 1; level++) {
          nodesByLevel[level].forEach(node => {
            if (node.sourceLinks.length > 0) {
              const weightedY = node.sourceLinks.reduce((sum, link) => {
                return sum + (link.targetNode.y + link.targetNode.height / 2) * link.value;
              }, 0);
              const totalWeight = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);

              if (totalWeight > 0) {
                const idealY = weightedY / totalWeight - node.height / 2;
                const oldY = node.y;
                node.y = node.y + (idealY - node.y) * alpha;
                totalMovement += Math.abs(node.y - oldY);
              }
            }
          });
        }

        // Ajustar baseado nos sources (direita para esquerda)
        for (let level = nodesByLevel.length - 1; level > 0; level--) {
          nodesByLevel[level].forEach(node => {
            if (node.targetLinks.length > 0) {
              const weightedY = node.targetLinks.reduce((sum, link) => {
                return sum + (link.sourceNode.y + link.sourceNode.height / 2) * link.value;
              }, 0);
              const totalWeight = node.targetLinks.reduce((sum, link) => sum + link.value, 0);

              if (totalWeight > 0) {
                const idealY = weightedY / totalWeight - node.height / 2;
                const oldY = node.y;
                node.y = node.y + (idealY - node.y) * alpha;
                totalMovement += Math.abs(node.y - oldY);
              }
            }
          });
        }

        // Resolver sobreposições
        nodesByLevel.forEach(levelNodes => {
          levelNodes.sort((a, b) => a.y - b.y);

          const minGap = 12; // Espaçamento mínimo ajustado
          for (let i = 1; i < levelNodes.length; i++) {
            const current = levelNodes[i];
            const previous = levelNodes[i - 1];
            const requiredY = previous.y + previous.height + minGap;

            if (current.y < requiredY) {
              current.y = requiredY;
            }
          }
        });

        // Garantir limites
        nodes.forEach(node => {
          node.y = Math.max(5, Math.min(chartHeight - node.height - 5, node.y));
        });

        // Parar se o movimento for mínimo
        if (totalMovement < 1) {
          break;
        }
      }
    };

    positionVertically();

    // Calcular posições dos links com melhor alinhamento
    const calculateLinkPositions = () => {
      // Ordenar links para minimizar cruzamentos
      nodes.forEach(node => {
        node.sourceLinks.sort((a, b) => (a.targetNode.y + a.targetNode.height / 2) - (b.targetNode.y + b.targetNode.height / 2));
        node.targetLinks.sort((a, b) => (a.sourceNode.y + a.sourceNode.height / 2) - (b.sourceNode.y + b.sourceNode.height / 2));
      });

      // Calcular posições Y dos links nos nós source com melhor distribuição
      nodes.forEach(node => {
        if (node.sourceLinks.length === 0) return;
        
        const totalLinkWidth = node.sourceLinks.reduce((sum, link) => sum + link.value * heightScale, 0);
        const availableHeight = node.height;
        const padding = Math.max(1, (availableHeight - totalLinkWidth) / 2);
        
        let sy = node.y + padding;
        node.sourceLinks.forEach(link => {
          link.sy0 = sy;
          link.width = Math.max(1, link.value * heightScale);
          link.sy1 = sy + link.width;
          sy = link.sy1;
        });
      });

      // Calcular posições Y dos links nos nós target com melhor distribuição
      nodes.forEach(node => {
        if (node.targetLinks.length === 0) return;
        
        const totalLinkWidth = node.targetLinks.reduce((sum, link) => sum + link.value * heightScale, 0);
        const availableHeight = node.height;
        const padding = Math.max(1, (availableHeight - totalLinkWidth) / 2);
        
        let ty = node.y + padding;
        node.targetLinks.forEach(link => {
          link.ty0 = ty;
          link.ty1 = ty + link.width;
          ty = link.ty1;
        });
      });
    };

    calculateLinkPositions();

    // Gerar caminhos dos links com curvas melhoradas
    links.forEach(link => {
      const x0 = link.sourceNode.x + link.sourceNode.width;
      const x1 = link.targetNode.x;
      const sy0 = link.sy0;
      const sy1 = link.sy1;
      const ty0 = link.ty0;
      const ty1 = link.ty1;
      
      // Calcular curvatura adaptativa baseada na distância
      const distance = x1 - x0;
      const curvature = Math.min(0.6, Math.max(0.3, distance / 200));
      const xi = distance * curvature;
      
      // Usar curvas cúbicas de Bézier mais suaves
      link.path = `
        M${x0},${sy0}
        C${x0 + xi},${sy0} ${x1 - xi},${ty0} ${x1},${ty0}
        L${x1},${ty1}
        C${x1 - xi},${ty1} ${x0 + xi},${sy1} ${x0},${sy1}
        Z
      `.replace(/\s+/g, ' ').trim();
    });

    return { nodes, links };
  }, [data, chartWidth, chartHeight]);

  // Paleta de cores
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
  ];

  const getNodeColor = (index: number) => colors[index % colors.length];

  // Função para posicionamento inteligente do tooltip
  const getTooltipPosition = useCallback((mouseX: number, mouseY: number, tooltipWidth = 250, tooltipHeight = 80) => {
    if (!svgRef.current) return { x: mouseX + 10, y: mouseY - 10 };

    const rect = svgRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    
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
  }, []);

  const handleNodeHover = useCallback((event: React.MouseEvent, node: ProcessedNode) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const position = getTooltipPosition(mouseX, mouseY);

    setHoveredElement(node.id);
    
    // Calcular estatísticas do nó
    const totalInFlow = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
    const totalOutFlow = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
    const efficiency = totalOutFlow > 0 ? ((totalOutFlow / totalInFlow) * 100).toFixed(1) : '100.0';
    
    const content = [
      `📍 ${node.name}`,
      `💰 Value: ${node.value.toLocaleString()}`,
      `📊 Level: ${node.level + 1}`,
      totalInFlow > 0 && `⬇️ In-flow: ${totalInFlow.toLocaleString()}`,
      totalOutFlow > 0 && `⬆️ Out-flow: ${totalOutFlow.toLocaleString()}`,
      totalInFlow > 0 && totalOutFlow > 0 && `⚡ Efficiency: ${efficiency}%`,
      `🔗 Connections: ${node.sourceLinks.length + node.targetLinks.length}`,
    ].filter(Boolean).join('\n');

    setTooltip({
      show: true,
      x: position.x,
      y: position.y,
      content,
      type: 'node',
    });
  }, [getTooltipPosition]);

  const handleLinkHover = useCallback((event: React.MouseEvent, link: ProcessedLink) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const position = getTooltipPosition(mouseX, mouseY);

    setHoveredElement(`${link.source}-${link.target}`);
    
    // Calcular estatísticas do link
    const sourcePercentage = ((link.value / link.sourceNode.value) * 100).toFixed(1);
    const targetPercentage = link.targetNode.value > 0 ? 
      ((link.value / link.targetNode.value) * 100).toFixed(1) : '100.0';
    
    const content = [
      `🔄 ${link.sourceNode.name} → ${link.targetNode.name}`,
      `💸 Flow: ${link.value.toLocaleString()}`,
      `📈 From source: ${sourcePercentage}%`,
      `📉 To target: ${targetPercentage}%`,
      `🎯 Flow efficiency: ${(Math.min(+sourcePercentage, +targetPercentage)).toFixed(1)}%`,
    ].join('\n');

    setTooltip({
      show: true,
      x: position.x,
      y: position.y,
      content,
      type: 'link',
    });
  }, [getTooltipPosition]);

  const handleMouseLeave = () => {
    setHoveredElement(null);
    setTooltip(prev => ({ ...prev, show: false }));
  };

  // Funções para zoom e pan
  const handleWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    
    const scaleAmount = -event.deltaY * 0.002;
    setTransform(prev => {
      const newScale = Math.min(Math.max(prev.scale + scaleAmount, 0.5), 3);
      return {
        x: prev.x,
        y: prev.y,
        scale: newScale,
      };
    });
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return;

    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging) return;

    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;

    setTransform(prev => ({
      x: prev.x + dx / prev.scale,
      y: prev.y + dy / prev.scale,
      scale: prev.scale,
    }));

    setDragStart({ x: event.clientX, y: event.clientY });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    svgElement.addEventListener('wheel', handleWheel);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      svgElement.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleWheel, handleMouseMove, handleMouseUp]);

  if (!processedData.nodes.length) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Sankey Diagram</h3>
          <p className="text-gray-500">Import data with nodes and links to visualize flows</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        {/* Definir gradientes */}
        <defs>
          {processedData.links.map((link, index) => {
            const sourceIndex = processedData.nodes.findIndex(n => n.id === link.source);
            const targetIndex = processedData.nodes.findIndex(n => n.id === link.target);
            const sourceColor = getNodeColor(sourceIndex);
            const targetColor = getNodeColor(targetIndex);
            
            return (
              <linearGradient
                key={`gradient-${index}`}
                id={`gradient-${index}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor={sourceColor} stopOpacity="0.6" />
                <stop offset="100%" stopColor={targetColor} stopOpacity="0.4" />
              </linearGradient>
            );
          })}
          
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.3"/>
          </filter>
        </defs>

        {/* Título */}
        {settings.title && (
          <text
            x={width / 2}
            y={margin.top / 2}
            textAnchor="middle"
            className="text-lg font-bold fill-gray-800"
          >
            {settings.title}
          </text>
        )}

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <g 
            transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Renderizar links */}
            {processedData.links.map((link, index) => {
              const isHovered = hoveredElement === `${link.source}-${link.target}`;
              const isConnected = hoveredElement === link.source || hoveredElement === link.target;
              
              return (
                <path
                  key={`link-${index}`}
                  d={link.path}
                  fill={`url(#gradient-${index})`}
                  fillOpacity={isHovered ? 0.8 : isConnected ? 0.6 : 0.5}
                  stroke="none"
                  className="cursor-pointer transition-all duration-200"
                  style={{
                    filter: isHovered ? 'url(#shadow)' : 'none',
                  }}
                  onMouseEnter={(e) => handleLinkHover(e, link)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}

            {/* Renderizar nós */}
            {processedData.nodes.map((node, index) => {
              const isHovered = hoveredElement === node.id;
              const isConnected = processedData.links.some(link => 
                (link.source === node.id || link.target === node.id) && 
                hoveredElement === `${link.source}-${link.target}`
              );
              
              return (
                <g key={`node-${node.id}`}>
                  <rect
                    x={node.x}
                    y={node.y}
                    width={node.width}
                    height={node.height}
                    fill={getNodeColor(index)}
                    fillOpacity={isHovered ? 1 : isConnected ? 0.8 : 0.9}
                    rx="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: isHovered ? 'url(#shadow)' : 'none',
                      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                      transformOrigin: 'center',
                    }}
                    onMouseEnter={(e) => handleNodeHover(e, node)}
                    onMouseLeave={handleMouseLeave}
                  />
                  
                  {/* Label do nó */}
                  <text
                    x={node.level === 0 ? node.x - 8 : node.x + node.width + 8}
                    y={node.y + node.height / 2}
                    dy="0.35em"
                    textAnchor={node.level === 0 ? "end" : "start"}
                    fontSize="11"
                    fontWeight="500"
                    fill="#374151"
                    className="pointer-events-none select-none"
                  >
                    {node.name}
                  </text>
                  
                  {/* Valor do nó (se houver espaço) */}
                  {node.height > 20 && (
                    <text
                      x={node.x + node.width / 2}
                      y={node.y + node.height / 2}
                      dy="0.35em"
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="600"
                      fill="white"
                      className="pointer-events-none select-none"
                    >
                      {node.value}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className={`absolute z-10 px-3 py-2 text-sm rounded-lg shadow-lg pointer-events-none ${
            tooltip.type === 'node' 
              ? 'bg-gray-900 text-white' 
              : 'bg-blue-900 text-blue-100'
          }`}
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translateY(-100%)',
            maxWidth: '250px',
          }}
        >
          <div className="whitespace-pre-line font-medium">
            {tooltip.content}
          </div>
        </div>
      )}

      {/* Controles de Zoom e Reset */}
      <div className="absolute top-3 left-3 bg-white/95 rounded-lg p-2 shadow-sm border space-y-1">
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 3) }))}
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={() => setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.5) }))}
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold"
          title="Zoom Out"
        >
          −
        </button>
        <button
          onClick={() => setTransform({ x: 0, y: 0, scale: 1 })}
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs"
          title="Reset View"
        >
          ⌂
        </button>
        <div className="text-xs text-gray-500 text-center pt-1">
          {Math.round(transform.scale * 100)}%
        </div>
      </div>

      {/* Legenda melhorada */}
      <div className="absolute top-3 right-3 bg-white/95 rounded-lg p-3 text-xs text-gray-600 shadow-sm border">
        <div className="font-semibold mb-2 text-sm">Sankey Flow</div>
        <div className="space-y-1">
          <div>• 🖱️ Drag to pan</div>
          <div>• 🔄 Scroll to zoom</div>
          <div>• 📏 Width = Flow value</div>
          <div>• 🎯 Hover for details</div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Nodes: {processedData.nodes.length} | Links: {processedData.links.length}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-20">
          <svg className="animate-spin h-8 w-8 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v16a8 8 0 01-8-8zm16 0a8 8 0 01-8 8V4a8 8 0 018 8z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};

export default SankeyChart;