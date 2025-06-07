import React from 'react';
import type { SankeyLabelsProps } from '../types';

const SankeyLabels: React.FC<SankeyLabelsProps> = ({
  nodes,
  settings
}) => {
  if (!settings.display.showNodeLabels && !settings.display.showNodeValues) {
    return null;
  }

  const formatValue = (value: number): string => {
    switch (settings.display.valueFormat) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return new Intl.NumberFormat('pt-BR', { 
          style: 'currency', 
          currency: 'BRL' 
        }).format(value);
      case 'custom':
        return settings.display.customValueFormat ? 
          settings.display.customValueFormat(value) : 
          value.toLocaleString();
      default:
        return value.toLocaleString();
    }
  };

  return (
    <g className="sankey-labels">
      {nodes.map((node) => {
        const labelX = node.x + node.width / 2;
        const labelY = node.y + node.height / 2;
        
        return (
          <g key={`label-${node.id}`}>
            {/* Node label */}
            {settings.display.showNodeLabels && (
              <text
                x={labelX}
                y={labelY - (settings.display.showNodeValues ? 6 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={settings.labelStyle.fontSize}
                fontFamily={settings.labelStyle.fontFamily}
                fontWeight={settings.labelStyle.fontWeight}
                fill={settings.labelStyle.color}
                className="select-none pointer-events-none"
              >
                {node.name}
              </text>
            )}
            
            {/* Node value */}
            {settings.display.showNodeValues && (
              <text
                x={labelX}
                y={labelY + (settings.display.showNodeLabels ? 6 : 0)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={settings.labelStyle.fontSize - 2}
                fontFamily={settings.labelStyle.fontFamily}
                fontWeight="normal"
                fill={settings.labelStyle.color}
                opacity={0.8}
                className="select-none pointer-events-none"
              >
                {formatValue(node.value)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default SankeyLabels;