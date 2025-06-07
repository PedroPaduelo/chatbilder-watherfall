import React, { useState, useCallback } from 'react';
import type { 
  SankeyChartProps, 
  SankeyTooltip as SankeyTooltipType, 
  ProcessedSankeyNode, 
  ProcessedSankeyLink 
} from '../types';
import { useSankeyData, useSankeyLayout } from '../hooks';
import { 
  generateNodeTooltip, 
  generateLinkTooltip, 
  getOptimalTooltipPosition,
  getNodeColor
} from '../utils';
import SankeyNodes from './SankeyNodes';
import SankeyLinks from './SankeyLinks';
import SankeyTooltip from './SankeyTooltip';

const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  settings,
  width = 900,
  height = 500
}) => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<SankeyTooltipType>({
    show: false,
    x: 0,
    y: 0,
    content: '',
    type: 'node'
  });

  // Calcular dimensões do gráfico
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // Processar dados usando hooks customizados
  const processedData = useSankeyData(data, chartWidth, chartHeight);
  const { nodes, links } = useSankeyLayout(
    processedData.nodesByLevel ? processedData : { 
      nodes: processedData.nodes, 
      links: processedData.links, 
      nodesByLevel: [], 
      maxLevel: 0 
    }, 
    chartHeight, 
    settings
  );

  // Função para lidar com hover de nós
  const handleNodeHover = useCallback((event: React.MouseEvent, node: ProcessedSankeyNode) => {
    if (!settings.showTooltips) return;

    // const rect = event.currentTarget.getBoundingClientRect();
    const containerRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    
    if (!containerRect) return;

    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    const { x, y } = getOptimalTooltipPosition(
      mouseX, 
      mouseY, 
      width, 
      height, 
      280, 
      120
    );

    setHoveredElement(`node-${node.id}`);
    setTooltip({
      show: true,
      x,
      y,
      content: generateNodeTooltip(node),
      type: 'node'
    });
  }, [settings.showTooltips, width, height]);

  // Função para lidar com hover de links
  const handleLinkHover = useCallback((event: React.MouseEvent, link: ProcessedSankeyLink) => {
    if (!settings.showTooltips) return;

    const containerRect = event.currentTarget.closest('svg')?.getBoundingClientRect();
    
    if (!containerRect) return;

    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    const { x, y } = getOptimalTooltipPosition(
      mouseX, 
      mouseY, 
      width, 
      height, 
      280, 
      100
    );

    setHoveredElement(`link-${link.sourceNode.id}-${link.targetNode.id}`);
    setTooltip({
      show: true,
      x,
      y,
      content: generateLinkTooltip(link),
      type: 'link'
    });
  }, [settings.showTooltips, width, height]);

  // Função para lidar com mouse leave
  const handleMouseLeave = useCallback(() => {
    setHoveredElement(null);
    setTooltip(prev => ({ ...prev, show: false }));
  }, []);

  // Função para obter cor do nó
  const getNodeColorCallback = useCallback((index: number) => 
    getNodeColor(index, settings), [settings]);

  // Se não há dados válidos
  if (!nodes.length || !links.length) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200"
        style={{ width, height }}
      >
        <div className="text-center text-gray-500">
          <div className="text-lg font-medium mb-2">Nenhum dado para exibir</div>
          <div className="text-sm">Carregue dados válidos para visualizar o diagrama Sankey</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ background: 'transparent' }}
      >
        {/* Título do gráfico */}
        {settings.title && (
          <text
            x={width / 2}
            y={15}
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fill="#374151"
          >
            {settings.title}
          </text>
        )}

        {/* Área principal do gráfico */}
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Renderizar links primeiro (para ficarem atrás dos nós) */}
          <SankeyLinks
            links={links}
            settings={settings}
            hoveredElement={hoveredElement}
            onLinkHover={handleLinkHover}
            onMouseLeave={handleMouseLeave}
          />

          {/* Renderizar nós */}
          <SankeyNodes
            nodes={nodes}
            settings={settings}
            hoveredElement={hoveredElement}
            onNodeHover={handleNodeHover}
            onMouseLeave={handleMouseLeave}
            getNodeColor={getNodeColorCallback}
          />
        </g>
      </svg>

      {/* Tooltip */}
      <SankeyTooltip tooltip={tooltip} />
    </div>
  );
};

export default SankeyChart;