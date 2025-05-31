import React from 'react';
import type { SankeyNodesProps } from '../types';

const SankeyNodes: React.FC<SankeyNodesProps> = ({
  nodes,
  settings,
  hoveredElement,
  onNodeHover,
  onMouseLeave,
  getNodeColor
}) => {
  return (
    <g className="sankey-nodes">
      {nodes.map((node, index) => {
        const isHovered = hoveredElement === `node-${node.id}`;
        const isConnected = hoveredElement && (
          hoveredElement.startsWith('link-') && (
            hoveredElement.includes(`-${node.id}-`) || 
            hoveredElement.includes(`-${node.id}`)
          )
        );
        
        const nodeOpacity = isHovered ? 1 : 
          hoveredElement && !isConnected ? settings.nodeOpacity * 0.3 : 
          settings.nodeOpacity;

        return (
          <g key={node.id} className="sankey-node">
            {/* Nó principal */}
            <rect
              x={node.x}
              y={node.y}
              width={settings.nodeWidth}
              height={node.height}
              fill={getNodeColor(index)}
              opacity={nodeOpacity}
              rx={settings.nodeBorderRadius}
              ry={settings.nodeBorderRadius}
              stroke={isHovered ? '#ffffff' : 'none'}
              strokeWidth={isHovered ? 2 : 0}
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                filter: isHovered ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' : 'none'
              }}
              onMouseEnter={(e) => onNodeHover(e, node)}
              onMouseLeave={onMouseLeave}
            />
            
            {/* Rótulo do nó */}
            {settings.showNodeLabels && (
              <text
                x={node.x + settings.nodeWidth + 8}
                y={node.y + node.height / 2}
                dy="0.35em"
                fontSize={settings.labelFontSize}
                fontWeight={settings.labelFontWeight}
                fill={settings.labelColor}
                opacity={nodeOpacity}
                style={{
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s ease'
                }}
              >
                {node.name}
              </text>
            )}
            
            {/* Valor do nó */}
            {settings.showNodeValues && node.height > 20 && (
              <text
                x={node.x + settings.nodeWidth / 2}
                y={node.y + node.height / 2}
                dy="0.35em"
                textAnchor="middle"
                fontSize={settings.valueFontSize}
                fontWeight="bold"
                fill={settings.valueColor}
                opacity={nodeOpacity}
                style={{
                  pointerEvents: 'none',
                  transition: 'opacity 0.2s ease'
                }}
              >
                {node.value.toLocaleString()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default SankeyNodes;