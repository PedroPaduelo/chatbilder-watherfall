import React from 'react';
import type { SankeyLinksProps } from '../types';
import { getLinkGradientColors } from '../utils';

const SankeyLinks: React.FC<SankeyLinksProps> = ({
  links,
  settings,
  hoveredElement,
  onLinkHover,
  onMouseLeave
}) => {
  // Criar gradientes únicos para cada link se necessário
  const gradients = links.map((link, index) => {
    if (!settings.linkGradient) return null;
    
    const sourceIndex = link.sourceNode.index;
    const targetIndex = link.targetNode.index;
    const { sourceColor, targetColor } = getLinkGradientColors(
      link, 
      settings, 
      (idx) => settings.customColors[idx % settings.customColors.length] || '#3B82F6',
      sourceIndex,
      targetIndex
    );
    
    const gradientId = `gradient-${index}`;
    
    return (
      <linearGradient key={gradientId} id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={sourceColor} />
        <stop offset="100%" stopColor={targetColor} />
      </linearGradient>
    );
  });

  return (
    <>
      {/* Definições de gradientes */}
      {settings.linkGradient && (
        <defs>
          {gradients}
        </defs>
      )}
      
      <g className="sankey-links">
        {links.map((link, index) => {
          const linkId = `link-${link.sourceNode.id}-${link.targetNode.id}`;
          const isHovered = hoveredElement === linkId;
          const isConnectedToHoveredNode = hoveredElement && (
            hoveredElement === `node-${link.sourceNode.id}` ||
            hoveredElement === `node-${link.targetNode.id}`
          );
          
          const linkOpacity = isHovered ? settings.linkHoverOpacity :
            hoveredElement && !isConnectedToHoveredNode ? settings.linkOpacity * 0.2 :
            settings.linkOpacity;

          // Determinar cor do link
          let linkFill: string;
          if (settings.linkGradient && settings.linkColorMode === 'gradient') {
            linkFill = `url(#gradient-${index})`;
          } else {
            const sourceIndex = link.sourceNode.index;
            const targetIndex = link.targetNode.index;
            const { sourceColor } = getLinkGradientColors(
              link, 
              settings, 
              (idx) => settings.customColors[idx % settings.customColors.length] || '#3B82F6',
              sourceIndex,
              targetIndex
            );
            linkFill = sourceColor;
          }

          return (
            <path
              key={linkId}
              d={link.path}
              fill={linkFill}
              opacity={linkOpacity}
              stroke="none"
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                filter: isHovered ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' : 'none'
              }}
              onMouseEnter={(e) => onLinkHover(e, link)}
              onMouseLeave={onMouseLeave}
            />
          );
        })}
      </g>
    </>
  );
};

export default SankeyLinks;