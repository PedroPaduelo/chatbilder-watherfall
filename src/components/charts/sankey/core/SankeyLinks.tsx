import React from 'react';
import type { SankeyLinksProps } from '../types';

const SankeyLinks: React.FC<SankeyLinksProps> = ({
  links,
  settings,
  selection,
  onLinkClick,
  onLinkHover,
  getLinkColor
}) => {
  return (
    <g className="sankey-links">
      {links.map((link) => {
        const linkId = `${link.source}-${link.target}`;
        const isSelected = selection.type === 'link' && selection.id === linkId;
        const isHighlighted = selection.highlighted.includes(link.sourceNode.id) || 
                             selection.highlighted.includes(link.targetNode.id);
        const opacity = isSelected || isHighlighted 
          ? settings.colors.opacity.hover.link 
          : settings.colors.opacity.link;

        return (
          <path
            key={linkId}
            d={link.path}
            fill={getLinkColor(link)}
            stroke="none"
            opacity={opacity}
            strokeWidth={link.width}
            className="cursor-pointer transition-all duration-200"
            onMouseEnter={(e) => onLinkHover(link, e)}
            onMouseLeave={() => onLinkHover(null)}
            onClick={(e) => onLinkClick(link, e)}
            role={settings.accessibility.enabled ? "button" : undefined}
            aria-label={settings.accessibility.enabled ? settings.accessibility.labels.link(link) : undefined}
            tabIndex={settings.accessibility.enabled ? 0 : undefined}
          />
        );
      })}
    </g>
  );
};

export default SankeyLinks;