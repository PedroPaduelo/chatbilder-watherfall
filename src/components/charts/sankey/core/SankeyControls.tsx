import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from 'lucide-react';
import type { SankeyControlsProps } from '../types';

const SankeyControls: React.FC<SankeyControlsProps> = ({
  transform,
  onZoomIn,
  onZoomOut,
  onReset,
  onFitToView
}) => {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
      <button
        onClick={onZoomIn}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Zoom In (Ctrl/Cmd + +)"
        aria-label="Aumentar zoom"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      
      <button
        onClick={onZoomOut}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Zoom Out (Ctrl/Cmd + -)"
        aria-label="Diminuir zoom"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      
      <button
        onClick={onFitToView}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Fit to View (Ctrl/Cmd + F)"
        aria-label="Ajustar à tela"
      >
        <Maximize className="w-4 h-4" />
      </button>
      
      <button
        onClick={onReset}
        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        title="Reset View (Ctrl/Cmd + R)"
        aria-label="Resetar visualização"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      
      {/* Zoom level indicator */}
      <div className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400 text-center border-t border-gray-200 dark:border-gray-600">
        {Math.round(transform.scale * 100)}%
      </div>
    </div>
  );
};

export default SankeyControls;