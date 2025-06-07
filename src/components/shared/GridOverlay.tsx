import React from 'react';

interface GridOverlayProps {
  gridSize: { width: number; height: number };
  cellSize: number;
  isDragging: boolean;
  draggedChart?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  } | null;
  highlightedArea?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

const GridOverlay: React.FC<GridOverlayProps> = ({
  gridSize,
  cellSize,
  isDragging,
  draggedChart,
  highlightedArea
}) => {
  if (!isDragging) return null;

  const gridLines = [];
  
  // Linhas verticais
  for (let i = 0; i <= gridSize.width; i++) {
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={i * cellSize}
        y1={0}
        x2={i * cellSize}
        y2={gridSize.height * cellSize}
        stroke="#3b82f6"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }
  
  // Linhas horizontais
  for (let i = 0; i <= gridSize.height; i++) {
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={i * cellSize}
        x2={gridSize.width * cellSize}
        y2={i * cellSize}
        stroke="#3b82f6"
        strokeWidth={1}
        opacity={0.3}
      />
    );
  }

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10"
      width={gridSize.width * cellSize}
      height={gridSize.height * cellSize}
    >
      {/* Grid lines */}
      {gridLines}
      
      {/* Highlighted area */}
      {highlightedArea && (
        <rect
          x={highlightedArea.x * cellSize}
          y={highlightedArea.y * cellSize}
          width={highlightedArea.width * cellSize}
          height={highlightedArea.height * cellSize}
          fill="#3b82f6"
          fillOpacity={0.1}
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="5,5"
        />
      )}
      
      {/* Dragged chart preview */}
      {draggedChart && (
        <rect
          x={draggedChart.position.x * cellSize}
          y={draggedChart.position.y * cellSize}
          width={draggedChart.size.width * cellSize}
          height={draggedChart.size.height * cellSize}
          fill="#3b82f6"
          fillOpacity={0.2}
          stroke="#3b82f6"
          strokeWidth={2}
          rx={8}
        />
      )}
    </svg>
  );
};

export default GridOverlay;