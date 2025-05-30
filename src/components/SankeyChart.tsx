import React, { useMemo, useState, useRef } from 'react';
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
  const svgRef = useRef<SVGSVGElement>(null);

  const margin = { top: 40, right: 60, bottom: 40, left: 60 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const processedData = useMemo(() => {
    if (!data.nodes.length || !data.links.length) {
      return { nodes: [], links: [] };
    }

    // Criar mapa de nós
    const nodeMap = new Map<string, ProcessedNode>();
    
    data.nodes.forEach(node => {
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

    // Calcular níveis (colunas) dos nós
    const calculateLevels = () => {
      const levels = new Map<string, number>();
      const visited = new Set<string>();
      
      const visit = (nodeId: string): number => {
        if (visited.has(nodeId)) {
          return levels.get(nodeId) || 0;
        }
        
        visited.add(nodeId);
        const node = nodeMap.get(nodeId)!;
        
        if (node.targetLinks.length === 0) {
          levels.set(nodeId, 0);
          return 0;
        }
        
        let maxLevel = -1;
        node.targetLinks.forEach(link => {
          const sourceLevel = visit(link.source);
          maxLevel = Math.max(maxLevel, sourceLevel);
        });
        
        const level = maxLevel + 1;
        levels.set(nodeId, level);
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
    const heightScale = (chartHeight * 0.8) / totalValue;

    // Calcular alturas dos nós
    nodes.forEach(node => {
      node.height = Math.max(8, node.value * heightScale);
    });

    // Posicionar nós horizontalmente
    const levelWidth = chartWidth / (maxLevel + 1);
    nodesByLevel.forEach((levelNodes, level) => {
      const x = level * levelWidth + levelWidth / 2 - 7.5; // Centro do nó
      levelNodes.forEach(node => {
        node.x = x;
      });
    });

    // Posicionar nós verticalmente
    const positionVertically = () => {
      // Posicionamento inicial
      nodesByLevel.forEach(levelNodes => {
        const totalHeight = levelNodes.reduce((sum, node) => sum + node.height, 0);
        const spacing = Math.max(10, (chartHeight - totalHeight) / (levelNodes.length + 1));
        
        let currentY = spacing;
        levelNodes.forEach(node => {
          node.y = currentY;
          currentY += node.height + spacing;
        });
      });

      // Otimização iterativa
      for (let iteration = 0; iteration < 8; iteration++) {
        // Ajustar baseado nos targets (da esquerda para direita)
        for (let level = 0; level < nodesByLevel.length - 1; level++) {
          nodesByLevel[level].forEach(node => {
            if (node.sourceLinks.length > 0) {
              const weightedY = node.sourceLinks.reduce((sum, link) => {
                return sum + (link.targetNode.y + link.targetNode.height / 2) * link.value;
              }, 0);
              const totalWeight = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
              
              if (totalWeight > 0) {
                const idealY = weightedY / totalWeight - node.height / 2;
                node.y = (node.y + idealY) * 0.6 + idealY * 0.4;
              }
            }
          });
        }

        // Ajustar baseado nos sources (da direita para esquerda)
        for (let level = nodesByLevel.length - 1; level > 0; level--) {
          nodesByLevel[level].forEach(node => {
            if (node.targetLinks.length > 0) {
              const weightedY = node.targetLinks.reduce((sum, link) => {
                return sum + (link.sourceNode.y + link.sourceNode.height / 2) * link.value;
              }, 0);
              const totalWeight = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
              
              if (totalWeight > 0) {
                const idealY = weightedY / totalWeight - node.height / 2;
                node.y = (node.y + idealY) * 0.6 + idealY * 0.4;
              }
            }
          });
        }

        // Resolver sobreposições
        nodesByLevel.forEach(levelNodes => {
          levelNodes.sort((a, b) => a.y - b.y);
          
          for (let i = 1; i < levelNodes.length; i++) {
            const current = levelNodes[i];
            const previous = levelNodes[i - 1];
            const minGap = 5;
            
            if (current.y < previous.y + previous.height + minGap) {
              current.y = previous.y + previous.height + minGap;
            }
          }
        });
      }

      // Garantir que todos os nós estão dentro dos limites
      nodes.forEach(node => {
        node.y = Math.max(0, Math.min(chartHeight - node.height, node.y));
      });
    };

    positionVertically();

    // Calcular posições dos links
    const calculateLinkPositions = () => {
      // Ordenar links para minimizar cruzamentos
      nodes.forEach(node => {
        node.sourceLinks.sort((a, b) => (a.targetNode.y + a.targetNode.height / 2) - (b.targetNode.y + b.targetNode.height / 2));
        node.targetLinks.sort((a, b) => (a.sourceNode.y + a.sourceNode.height / 2) - (b.sourceNode.y + b.sourceNode.height / 2));
      });

      // Calcular posições Y dos links nos nós source
      nodes.forEach(node => {
        let sy = node.y;
        node.sourceLinks.forEach(link => {
          link.sy0 = sy;
          link.width = link.value * heightScale;
          link.sy1 = sy + link.width;
          sy = link.sy1;
        });
      });

      // Calcular posições Y dos links nos nós target
      nodes.forEach(node => {
        let ty = node.y;
        node.targetLinks.forEach(link => {
          link.ty0 = ty;
          link.ty1 = ty + link.width;
          ty = link.ty1;
        });
      });
    };

    calculateLinkPositions();

    // Gerar caminhos dos links
    links.forEach(link => {
      const x0 = link.sourceNode.x + link.sourceNode.width;
      const x1 = link.targetNode.x;
      const y0 = link.sy0;
      const y1 = link.sy1;
      const y2 = link.ty0;
      const y3 = link.ty1;
      
      const curvature = 0.5;
      const xi = (x1 - x0) * curvature;
      
      link.path = `
        M${x0},${y0}
        C${x0 + xi},${y0} ${x1 - xi},${y2} ${x1},${y2}
        L${x1},${y3}
        C${x1 - xi},${y3} ${x0 + xi},${y1} ${x0},${y1}
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

  const handleNodeHover = (event: React.MouseEvent, node: ProcessedNode, index: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    setHoveredElement(node.id);
    setTooltip({
      show: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      content: `${node.name}\nValue: ${node.value.toLocaleString()}\nLevel: ${node.level}\nConnections: ${node.sourceLinks.length + node.targetLinks.length}`,
      type: 'node',
    });
  };

  const handleLinkHover = (event: React.MouseEvent, link: ProcessedLink) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    setHoveredElement(`${link.source}-${link.target}`);
    setTooltip({
      show: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      content: `${link.sourceNode.name} → ${link.targetNode.name}\nFlow: ${link.value.toLocaleString()}\nPercentage: ${((link.value / link.sourceNode.value) * 100).toFixed(1)}%`,
      type: 'link',
    });
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
    setTooltip(prev => ({ ...prev, show: false }));
  };

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
                  onMouseEnter={(e) => handleNodeHover(e, node, index)}
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

      {/* Legenda */}
      <div className="absolute top-3 right-3 bg-white/95 rounded-lg p-2 text-xs text-gray-600 shadow-sm border">
        <div className="font-semibold mb-1">Sankey Flow</div>
        <div>• Width = Flow value</div>
        <div>• Hover for details</div>
      </div>
    </div>
  );
};

export default SankeyChart;