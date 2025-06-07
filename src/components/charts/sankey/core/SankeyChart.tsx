import React, { useRef, useEffect, useCallback } from 'react';
import type { SankeyChartProps } from '../types';
import { useSankey } from '../hooks';
import { getNodeColor, getLinkColor, generateNodeTooltip, generateLinkTooltip, getOptimalTooltipPosition } from '../utils';
import SankeyNodes from './SankeyNodes';
import SankeyLinks from './SankeyLinks';
import SankeyLabels from './SankeyLabels';
import SankeyTooltip from './SankeyTooltip';
import SankeyControls from './SankeyControls';

const SankeyChart: React.FC<SankeyChartProps> = ({
  data,
  settings,
  width = 900,
  height = 500,
  onNodeClick,
  onLinkClick,
  onSelectionChange,
  onTransformChange,
  className = '',
  style = {}
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the comprehensive Sankey hook
  const sankey = useSankey(data, settings, width, height);

  // Notify parent components of changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(sankey.selection);
    }
  }, [sankey.selection, onSelectionChange]);

  useEffect(() => {
    if (onTransformChange) {
      onTransformChange(sankey.transform);
    }
  }, [sankey.transform, onTransformChange]);

  // Color functions
  const getNodeColorCallback = useCallback((node: any) => getNodeColor(node, settings), [settings]);
  const getLinkColorCallback = useCallback((link: any) => getLinkColor(link, settings), [settings]);

  // Event handlers
  const handleNodeClick = useCallback((node: any, event: React.MouseEvent) => {
    if (settings.interaction.selection.enabled) {
      sankey.selectNode(node.id);
    }
    if (onNodeClick) {
      onNodeClick(node, event);
    }
  }, [settings.interaction.selection.enabled, sankey.selectNode, onNodeClick]);

  const handleLinkClick = useCallback((link: any, event: React.MouseEvent) => {
    if (settings.interaction.selection.enabled) {
      sankey.selectLink(`${link.source}-${link.target}`);
    }
    if (onLinkClick) {
      onLinkClick(link, event);
    }
  }, [settings.interaction.selection.enabled, sankey.selectLink, onLinkClick]);

  const handleNodeHover = useCallback((node: any | null, event?: React.MouseEvent) => {
    if (!settings.interaction.hover.enabled) return;

    if (node && event) {
      // Show tooltip
      if (settings.tooltip.enabled) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          const mouseX = event.clientX - containerRect.left;
          const mouseY = event.clientY - containerRect.top;
          
          const { x, y } = getOptimalTooltipPosition(
            mouseX,
            mouseY,
            width,
            height,
            settings.tooltip.style.maxWidth,
            100,
            settings.tooltip.offset
          );

          const content = generateNodeTooltip(node, settings.tooltip.template.node);
          sankey.showTooltip(content, x, y, 'node', node);
        }
      }

      // Highlight connected nodes if enabled
      if (settings.interaction.hover.highlightConnected) {
        sankey.highlightConnected(node.id, sankey.nodes, sankey.links);
      }
    } else {
      sankey.hideTooltip();
      if (settings.interaction.selection.enabled) {
        sankey.clearSelection();
      }
    }
  }, [
    settings.interaction.hover.enabled,
    settings.interaction.hover.highlightConnected,
    settings.tooltip.enabled,
    settings.tooltip.template.node,
    settings.tooltip.style.maxWidth,
    settings.tooltip.offset,
    width,
    height,
    sankey.showTooltip,
    sankey.hideTooltip,
    sankey.highlightConnected,
    sankey.clearSelection,
    sankey.nodes,
    sankey.links
  ]);

  const handleLinkHover = useCallback((link: any | null, event?: React.MouseEvent) => {
    if (!settings.interaction.hover.enabled) return;

    if (link && event) {
      // Show tooltip
      if (settings.tooltip.enabled) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          const mouseX = event.clientX - containerRect.left;
          const mouseY = event.clientY - containerRect.top;
          
          const { x, y } = getOptimalTooltipPosition(
            mouseX,
            mouseY,
            width,
            height,
            settings.tooltip.style.maxWidth,
            80,
            settings.tooltip.offset
          );

          const content = generateLinkTooltip(link, settings.tooltip.template.link);
          sankey.showTooltip(content, x, y, 'link', link);
        }
      }
    } else {
      sankey.hideTooltip();
    }
  }, [
    settings.interaction.hover.enabled,
    settings.tooltip.enabled,
    settings.tooltip.template.link,
    settings.tooltip.style.maxWidth,
    settings.tooltip.offset,
    width,
    height,
    sankey.showTooltip,
    sankey.hideTooltip
  ]);

  // Zoom and pan handlers
  const handleWheel = useCallback((event: React.WheelEvent) => {
    if (!settings.interaction.zoom.enabled || !settings.interaction.zoom.wheel) return;

    event.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newScale = sankey.transform.scale * zoomFactor;
    
    if (settings.interaction.zoom.center === 'cursor') {
      sankey.zoom(newScale, mouseX, mouseY);
    } else {
      sankey.zoom(newScale);
    }
  }, [
    settings.interaction.zoom.enabled,
    settings.interaction.zoom.wheel,
    settings.interaction.zoom.center,
    sankey.transform.scale,
    sankey.zoom
  ]);

  // Touch and mouse pan handlers
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!settings.interaction.pan.enabled) return;
    
    const startX = event.clientX;
    const startY = event.clientY;
    const startTransform = sankey.transform;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      sankey.setTransform({
        ...startTransform,
        x: startTransform.x + deltaX,
        y: startTransform.y + deltaY
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [settings.interaction.pan.enabled, sankey.transform, sankey.setTransform]);

  // Keyboard navigation
  useEffect(() => {
    if (!settings.accessibility.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            sankey.reset();
          }
          break;
        case 'f':
        case 'F':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            sankey.fitToView(sankey.nodes, width, height);
          }
          break;
        case '+':
        case '=':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            sankey.zoom(sankey.transform.scale * 1.2);
          }
          break;
        case '-':
        case '_':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            sankey.zoom(sankey.transform.scale / 1.2);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    settings.accessibility.keyboardNavigation,
    sankey.reset,
    sankey.fitToView,
    sankey.zoom,
    sankey.transform.scale,
    sankey.nodes,
    width,
    height
  ]);

  // Start entrance animation
  useEffect(() => {
    if (settings.animation.enabled && sankey.nodes.length > 0) {
      sankey.startAnimation();
    }
  }, [settings.animation.enabled, sankey.nodes.length, sankey.startAnimation]);

  // Render empty state if no valid data
  if (!sankey.validation.isValid || sankey.nodes.length === 0) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}
        style={{ width, height, ...style }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-lg font-medium mb-2">Nenhum dado para exibir</div>
          <div className="text-sm">
            {sankey.validation.errors.length > 0 ? (
              <div>
                <div className="mb-2">Erros encontrados:</div>
                <ul className="text-left space-y-1">
                  {sankey.validation.errors.slice(0, 3).map((error, index) => (
                    <li key={index} className="text-red-600 dark:text-red-400">• {error}</li>
                  ))}
                  {sankey.validation.errors.length > 3 && (
                    <li className="text-gray-500">...e mais {sankey.validation.errors.length - 3} erros</li>
                  )}
                </ul>
              </div>
            ) : (
              'Carregue dados válidos para visualizar o diagrama Sankey'
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative select-none ${className}`}
      style={{ width, height, ...style }}
      role={settings.accessibility.enabled ? "img" : undefined}
      aria-label={settings.accessibility.enabled ? settings.accessibility.labels.chart : undefined}
      aria-describedby={settings.accessibility.enabled ? "sankey-description" : undefined}
    >
      {/* Accessibility description */}
      {settings.accessibility.enabled && (
        <div id="sankey-description" className="sr-only">
          {settings.accessibility.descriptions.chart}
          {settings.accessibility.descriptions.summary(data)}
        </div>
      )}

      {/* Main SVG */}
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        style={{ backgroundColor: settings.backgroundColor }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        {/* Definitions for gradients and filters */}
        <defs>
          {/* Gradients for links */}
          {settings.linkStyle.gradient?.enabled && sankey.links.map(link => (
            <linearGradient
              key={`gradient-${link.sourceNode.id}-${link.targetNode.id}`}
              id={`gradient-${link.sourceNode.id}-${link.targetNode.id}`}
              x1="0%" y1="0%" x2="100%" y2="0%"
            >
              <stop 
                offset="0%" 
                stopColor={getNodeColor(link.sourceNode, settings)} 
                stopOpacity={settings.colors.opacity.link}
              />
              <stop 
                offset="100%" 
                stopColor={getNodeColor(link.targetNode, settings)} 
                stopOpacity={settings.colors.opacity.link}
              />
            </linearGradient>
          ))}

          {/* Drop shadow filter */}
          {settings.nodeStyle.shadow?.enabled && (
            <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow
                dx={settings.nodeStyle.shadow.offsetX}
                dy={settings.nodeStyle.shadow.offsetY}
                stdDeviation={settings.nodeStyle.shadow.blur}
                floodColor={settings.nodeStyle.shadow.color}
              />
            </filter>
          )}

          {/* Focus ring for accessibility */}
          {settings.accessibility.enabled && settings.accessibility.focusRing.enabled && (
            <filter id="focus-ring">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation={settings.accessibility.focusRing.width}
                floodColor={settings.accessibility.focusRing.color}
              />
            </filter>
          )}
        </defs>

        {/* Chart title */}
        {settings.title && (
          <text
            x={width / 2}
            y={20}
            textAnchor="middle"
            fontSize="18"
            fontWeight="600"
            fill={settings.primaryColor}
            className="select-none"
          >
            {settings.title}
          </text>
        )}

        {/* Main chart group with transform */}
        <g
          transform={`translate(${sankey.transform.x}, ${sankey.transform.y}) scale(${sankey.transform.scale})`}
          style={{
            transition: settings.animation.enabled ? `transform ${settings.animation.duration}ms ${settings.animation.easing}` : 'none'
          }}
        >
          {/* Links (render first so they appear behind nodes) */}
          <SankeyLinks
            links={sankey.links}
            settings={settings}
            selection={sankey.selection}
            transform={sankey.transform}
            onLinkClick={handleLinkClick}
            onLinkHover={handleLinkHover}
            getLinkColor={getLinkColorCallback}
          />

          {/* Nodes */}
          <SankeyNodes
            nodes={sankey.nodes}
            settings={settings}
            selection={sankey.selection}
            transform={sankey.transform}
            onNodeClick={handleNodeClick}
            onNodeHover={handleNodeHover}
            getNodeColor={getNodeColorCallback}
          />

          {/* Labels */}
          {(settings.display.showNodeLabels || settings.display.showNodeValues) && (
            <SankeyLabels
              nodes={sankey.nodes}
              settings={settings}
              transform={sankey.transform}
            />
          )}
        </g>
      </svg>

      {/* Controls */}
      {settings.interaction.enabled && (
        <SankeyControls
          transform={sankey.transform}
          settings={settings}
          onTransformChange={sankey.setTransform}
          onReset={sankey.reset}
          onZoomIn={() => sankey.zoom(sankey.transform.scale * 1.2)}
          onZoomOut={() => sankey.zoom(sankey.transform.scale / 1.2)}
          onFitToView={() => sankey.fitToView(sankey.nodes, width, height)}
        />
      )}

      {/* Tooltip */}
      <SankeyTooltip 
        tooltip={sankey.tooltip} 
        settings={settings.tooltip}
      />

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs text-gray-500 bg-white/80 p-2 rounded">
          Nodes: {sankey.metrics.nodeCount} | Links: {sankey.metrics.linkCount}
        </div>
      )}
    </div>
  );
};

export default SankeyChart;