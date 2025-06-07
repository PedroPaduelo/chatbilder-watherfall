import React from 'react';
import type { SankeyTooltipProps } from '../types';

const SankeyTooltip: React.FC<SankeyTooltipProps> = ({ tooltip }) => {
  if (!tooltip.show) return null;

  return (
    <div
      className="absolute z-50 bg-gray-800 text-white text-xs rounded-lg shadow-lg pointer-events-none"
      style={{
        left: tooltip.x,
        top: tooltip.y,
        transform: 'translate(-50%, -100%)',
        maxWidth: '280px',
        padding: '8px 12px'
      }}
    >
      <div className="whitespace-pre-line leading-relaxed">
        {tooltip.content}
      </div>
      
      {/* Seta do tooltip */}
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '6px solid #1f2937'
        }}
      />
    </div>
  );
};

export default SankeyTooltip;