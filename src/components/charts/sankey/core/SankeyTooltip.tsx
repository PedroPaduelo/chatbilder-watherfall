import React from 'react';
import type { SankeyTooltipProps } from '../types';

const SankeyTooltip: React.FC<SankeyTooltipProps> = ({
  tooltip,
  settings
}) => {
  if (!tooltip.show || !settings.enabled) {
    return null;
  }

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        backgroundColor: settings.style.backgroundColor,
        border: `${settings.style.borderWidth}px solid ${settings.style.borderColor}`,
        borderRadius: settings.style.borderRadius,
        padding: settings.style.padding,
        fontSize: settings.style.fontSize,
        color: settings.style.fontColor,
        maxWidth: settings.style.maxWidth,
        boxShadow: settings.style.shadow ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
        transform: 'translate(-50%, -100%)',
        transformOrigin: 'bottom center'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: tooltip.content }}
        className="whitespace-nowrap"
      />
      
      {/* Tooltip arrow */}
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${settings.style.backgroundColor}`
        }}
      />
    </div>
  );
};

export default SankeyTooltip;