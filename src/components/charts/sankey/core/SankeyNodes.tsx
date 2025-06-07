import React from 'react';
import type { SankeyNodesProps } from '../types';

const SankeyNodes: React.FC<SankeyNodesProps> = ({
  nodes,
  settings,
  selection,
  onNodeClick,
  onNodeHover,
  getNodeColor
}) => {
  return (
    <g className="sankey-nodes">
      {nodes.map((node) => {
        const isSelected = selection.type === 'node' && selection.id === node.id;
        const isHighlighted = selection.highlighted.includes(node.id);
        const opacity = isSelected || isHighlighted 
          ? settings.colors.opacity.hover.node 
          : settings.colors.opacity.node;

        return (
          <rect
            key={node.id}
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            fill={getNodeColor(node)}
            stroke={settings.nodeStyle.stroke}
            strokeWidth={settings.nodeStyle.strokeWidth}
            opacity={opacity}
            rx={settings.nodeStyle.borderRadius}
            ry={settings.nodeStyle.borderRadius}
            filter={settings.nodeStyle.shadow?.enabled ? 'url(#drop-shadow)' : undefined}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => onNodeHover(node, e)}
            onMouseLeave={() => onNodeHover(null)}
            onClick={(e) => onNodeClick(node, e)}
            role={settings.accessibility.enabled ? "button" : undefined}
            aria-label={settings.accessibility.enabled ? settings.accessibility.labels.node(node) : undefined}
            tabIndex={settings.accessibility.enabled ? 0 : undefined}
          />
        );
      })}
    </g>
  );
};

export default SankeyNodes;