import React, { useMemo, useState } from 'react';
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
}

interface ProcessedLink extends SankeyLink {
  sourceNode: ProcessedNode;
  targetNode: ProcessedNode;
  y0: number;
  y1: number;
  sourceY: number;
  targetY: number;
  path: string;
}

const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  settings,
  width = 800,
  height = 400,
}) => {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
  }>({ show: false, x: 0, y: 0, content: '' });

  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const processedData = useMemo(() => {
    if (!data.nodes.length || !data.links.length) {
      return { nodes: [], links: [] };
    }

    // Calculate node values (sum of incoming/outgoing links)
    const nodeValues = new Map<string, number>();
    data.links.forEach(link => {
      const sourceValue = nodeValues.get(link.source) || 0;
      const targetValue = nodeValues.get(link.target) || 0;
      nodeValues.set(link.source, Math.max(sourceValue, link.value));
      nodeValues.set(link.target, targetValue + link.value);
    });

    // Determine node levels (columns)
    const levels = new Map<string, number>();
    const visited = new Set<string>();
    
    // Start with source nodes (nodes that don't appear as targets)
    const sourceNodes = data.nodes.filter(node => 
      !data.links.some(link => link.target === node.id)
    );

    const assignLevel = (nodeId: string, level: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      levels.set(nodeId, Math.max(levels.get(nodeId) || 0, level));
      
      // Assign next level to target nodes
      data.links
        .filter(link => link.source === nodeId)
        .forEach(link => assignLevel(link.target, level + 1));
    };

    sourceNodes.forEach(node => assignLevel(node.id, 0));
    
    // Handle remaining nodes
    data.nodes.forEach(node => {
      if (!levels.has(node.id)) {
        levels.set(node.id, 0);
      }
    });

    const maxLevel = Math.max(...Array.from(levels.values()));
    const nodeWidth = 20;
    const levelWidth = innerWidth / (maxLevel + 1);

    // Group nodes by level
    const nodesByLevel = new Map<number, SankeyNode[]>();
    data.nodes.forEach(node => {
      const level = levels.get(node.id) || 0;
      if (!nodesByLevel.has(level)) {
        nodesByLevel.set(level, []);
      }
      nodesByLevel.get(level)!.push(node);
    });

    // Calculate total value for scaling
    const maxValue = Math.max(...Array.from(nodeValues.values()));

    // Calculate node positions
    const processedNodes: ProcessedNode[] = [];
    
    nodesByLevel.forEach((levelNodes, level) => {
      let currentY = 0;
      const spacing = 20;
      
      levelNodes.forEach((node) => {
        const value = nodeValues.get(node.id) || 0;
        const nodeHeight = Math.max(20, (value / maxValue) * (innerHeight * 0.6));
        
        processedNodes.push({
          ...node,
          x: level * levelWidth + levelWidth / 2 - nodeWidth / 2,
          y: currentY + spacing,
          width: nodeWidth,
          height: nodeHeight,
          value,
        });
        
        currentY += nodeHeight + spacing;
      });
    });

    // Create node lookup
    const nodeMap = new Map<string, ProcessedNode>();
    processedNodes.forEach(node => nodeMap.set(node.id, node));

    // Calculate link positions and create paths
    const processedLinks: ProcessedLink[] = [];
    
    // Track vertical positions for each node's connections
    const nodeConnections = new Map<string, { source: number; target: number }>();
    processedNodes.forEach(node => {
      nodeConnections.set(node.id, { source: 0, target: 0 });
    });

    data.links.forEach(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (!sourceNode || !targetNode) return;

      const linkHeight = (link.value / maxValue) * (innerHeight * 0.6);
      
      const sourceConnections = nodeConnections.get(link.source)!;
      const targetConnections = nodeConnections.get(link.target)!;
      
      const linkSourceY = sourceNode.y + sourceConnections.source;
      const linkTargetY = targetNode.y + targetConnections.target;
      
      // Calculate path for curved link
      const sourceX = sourceNode.x + sourceNode.width;
      const targetX = targetNode.x;
      const centerSourceY = linkSourceY + linkHeight / 2;
      const centerTargetY = linkTargetY + linkHeight / 2;
      
      // Create curved path
      const controlPoint1X = sourceX + (targetX - sourceX) / 3;
      const controlPoint2X = targetX - (targetX - sourceX) / 3;
      
      const path = `
        M ${sourceX} ${centerSourceY - linkHeight / 2}
        C ${controlPoint1X} ${centerSourceY - linkHeight / 2},
          ${controlPoint2X} ${centerTargetY - linkHeight / 2},
          ${targetX} ${centerTargetY - linkHeight / 2}
        L ${targetX} ${centerTargetY + linkHeight / 2}
        C ${controlPoint2X} ${centerTargetY + linkHeight / 2},
          ${controlPoint1X} ${centerSourceY + linkHeight / 2},
          ${sourceX} ${centerSourceY + linkHeight / 2}
        Z
      `.replace(/\s+/g, ' ').trim();

      processedLinks.push({
        ...link,
        sourceNode,
        targetNode,
        y0: linkSourceY,
        y1: linkTargetY,
        sourceY: linkSourceY,
        targetY: linkTargetY,
        path: path.trim(),
      });

      // Update connection positions
      sourceConnections.source += linkHeight + 2;
      targetConnections.target += linkHeight + 2;
    });

    return { nodes: processedNodes, links: processedLinks };
  }, [data, innerWidth, innerHeight]);

  const handleNodeMouseEnter = (event: React.MouseEvent, node: ProcessedNode) => {
    setTooltip({
      show: true,
      x: event.clientX,
      y: event.clientY,
      content: `${node.name}: ${node.value.toFixed(2)}`,
    });
  };

  const handleLinkMouseEnter = (event: React.MouseEvent, link: ProcessedLink) => {
    setTooltip({
      show: true,
      x: event.clientX,
      y: event.clientY,
      content: `${link.sourceNode.name} → ${link.targetNode.name}: ${link.value.toFixed(2)}`,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  };

  if (!data.nodes.length || !data.links.length) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center p-8">
          <div className="text-4xl text-gray-400 mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Dados do Sankey Vazios
          </h3>
          <p className="text-gray-500">
            Importe dados com nós e ligações para visualizar o diagrama
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <svg
        width={width}
        height={height}
        className="overflow-visible"
        style={{ background: settings.backgroundColor || '#ffffff' }}
      >
        {/* Chart title */}
        {settings.title && (
          <text
            x={width / 2}
            y={margin.top / 2}
            textAnchor="middle"
            className="text-lg font-semibold"
            fill={settings.primaryColor || '#374151'}
          >
            {settings.title}
          </text>
        )}

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Render links first (behind nodes) */}
          {processedData.links.map((link, index) => (
            <path
              key={`link-${index}`}
              d={link.path}
              fill={link.color || settings.accentColor || '#60A5FA'}
              fillOpacity={0.6}
              stroke="none"
              className="cursor-pointer transition-opacity hover:opacity-80"
              onMouseEnter={(e) => handleLinkMouseEnter(e, link)}
              onMouseLeave={handleMouseLeave}
            />
          ))}

          {/* Render nodes */}
          {processedData.nodes.map((node) => (
            <g key={`node-${node.id}`}>
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={node.height}
                fill={node.color || settings.primaryColor || '#374151'}
                className="cursor-pointer transition-colors hover:opacity-80"
                onMouseEnter={(e) => handleNodeMouseEnter(e, node)}
                onMouseLeave={handleMouseLeave}
              />
              <text
                x={node.x + node.width + 8}
                y={node.y + node.height / 2}
                dy="0.35em"
                fontSize="12"
                fill={settings.primaryColor || '#374151'}
                className="pointer-events-none"
              >
                {node.name}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="absolute z-10 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10,
            transform: 'translate(-50%, -100%)',
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default SankeyChart;