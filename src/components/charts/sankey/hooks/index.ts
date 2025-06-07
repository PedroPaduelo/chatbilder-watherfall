import { useState, useEffect, useMemo, useCallback } from 'react';
import type { 
  SankeyData, 
  SankeySettings, 
  ProcessedSankeyNode, 
  ProcessedSankeyLink,
  SankeySelection,
  SankeyTransform,
  SankeyTooltip
} from '../types';
import { 
  processSankeyData, 
  validateSankeyData, 
  calculateSankeyMetrics,
  defaultSankeySettings 
} from '../utils';

// ============================================================================
// DATA PROCESSING HOOK
// ============================================================================

export function useSankeyData(
  data: SankeyData,
  width: number,
  height: number,
  settings: SankeySettings = defaultSankeySettings
) {
  return useMemo(() => {
    // Validate data first
    const validation = validateSankeyData(data);
    if (!validation.isValid) {
      console.warn('Sankey data validation failed:', validation.errors);
      return { nodes: [], links: [] };
    }

    // Process data for rendering
    return processSankeyData(data, width, height, settings);
  }, [data, width, height, settings]);
}

// ============================================================================
// SELECTION MANAGEMENT HOOK
// ============================================================================

export function useSankeySelection() {
  const [selection, setSelection] = useState<SankeySelection>({
    type: null,
    id: null,
    highlighted: []
  });

  const selectNode = useCallback((nodeId: string) => {
    setSelection(prev => ({
      type: 'node',
      id: nodeId,
      highlighted: prev.id === nodeId ? [] : [nodeId]
    }));
  }, []);

  const selectLink = useCallback((linkId: string) => {
    setSelection(prev => ({
      type: 'link',
      id: linkId,
      highlighted: prev.id === linkId ? [] : [linkId]
    }));
  }, []);

  const clearSelection = useCallback(() => {
    setSelection({
      type: null,
      id: null,
      highlighted: []
    });
  }, []);

  const highlightConnected = useCallback((
    nodeId: string, 
    nodes: ProcessedSankeyNode[], 
    _links: ProcessedSankeyLink[]
  ) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const connectedNodes = new Set<string>([nodeId]);
    const connectedLinks = new Set<string>();

    // Add source and target nodes
    node.sourceLinks.forEach(link => {
      connectedNodes.add(link.targetNode.id);
      connectedLinks.add(`${link.source}-${link.target}`);
    });

    node.targetLinks.forEach(link => {
      connectedNodes.add(link.sourceNode.id);
      connectedLinks.add(`${link.source}-${link.target}`);
    });

    setSelection({
      type: 'node',
      id: nodeId,
      highlighted: Array.from(connectedNodes)
    });
  }, []);

  return {
    selection,
    selectNode,
    selectLink,
    clearSelection,
    highlightConnected
  };
}

// ============================================================================
// TRANSFORM/ZOOM/PAN HOOK
// ============================================================================

export function useSankeyTransform() {
  const [transform, setTransform] = useState<SankeyTransform>({
    x: 0,
    y: 0,
    scale: 1
  });

  const pan = useCallback((deltaX: number, deltaY: number) => {
    setTransform(prev => ({
      ...prev,
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
  }, []);

  const zoom = useCallback((scale: number, centerX?: number, centerY?: number) => {
    setTransform(prev => {
      const newScale = Math.max(0.1, Math.min(10, scale));
      
      if (centerX !== undefined && centerY !== undefined) {
        // Zoom towards a specific point
        const scaleRatio = newScale / prev.scale;
        return {
          x: centerX - (centerX - prev.x) * scaleRatio,
          y: centerY - (centerY - prev.y) * scaleRatio,
          scale: newScale
        };
      }
      
      return { ...prev, scale: newScale };
    });
  }, []);

  const reset = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const fitToView = useCallback((
    nodes: ProcessedSankeyNode[],
    containerWidth: number,
    containerHeight: number,
    padding = 50
  ) => {
    if (nodes.length === 0) return;

    const bounds = nodes.reduce(
      (acc, node) => ({
        minX: Math.min(acc.minX, node.x),
        maxX: Math.max(acc.maxX, node.x + node.width),
        minY: Math.min(acc.minY, node.y),
        maxY: Math.max(acc.maxY, node.y + node.height)
      }),
      { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
    );

    const contentWidth = bounds.maxX - bounds.minX;
    const contentHeight = bounds.maxY - bounds.minY;
    
    const scaleX = (containerWidth - padding * 2) / contentWidth;
    const scaleY = (containerHeight - padding * 2) / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    const targetX = containerWidth / 2 - centerX * scale;
    const targetY = containerHeight / 2 - centerY * scale;

    setTransform({ x: targetX, y: targetY, scale });
  }, []);

  return {
    transform,
    setTransform,
    pan,
    zoom,
    reset,
    fitToView
  };
}

// ============================================================================
// TOOLTIP MANAGEMENT HOOK
// ============================================================================

export function useSankeyTooltip() {
  const [tooltip, setTooltip] = useState<SankeyTooltip>({
    show: false,
    x: 0,
    y: 0,
    content: '',
    type: 'node'
  });

  const showTooltip = useCallback((
    content: string,
    x: number,
    y: number,
    type: 'node' | 'link' = 'node',
    data?: any
  ) => {
    setTooltip({
      show: true,
      x,
      y,
      content,
      type,
      data
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(prev => ({ ...prev, show: false }));
  }, []);

  const updateTooltipPosition = useCallback((x: number, y: number) => {
    setTooltip(prev => ({ ...prev, x, y }));
  }, []);

  return {
    tooltip,
    showTooltip,
    hideTooltip,
    updateTooltipPosition
  };
}

// ============================================================================
// ANIMATION HOOK
// ============================================================================

export function useSankeyAnimation(settings: SankeySettings) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  const startAnimation = useCallback((duration?: number) => {
    if (!settings.animation.enabled) return;

    setIsAnimating(true);
    setAnimationProgress(0);

    const animDuration = duration || settings.animation.duration;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / animDuration, 1);
      
      // Apply easing
      let easedProgress = progress;
      switch (settings.animation.easing) {
        case 'easeInOut':
          easedProgress = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
        case 'easeIn':
          easedProgress = progress * progress;
          break;
        case 'easeOut':
          easedProgress = 1 - (1 - progress) * (1 - progress);
          break;
        case 'bounce':
          easedProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          break;
      }

      setAnimationProgress(easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [settings.animation.enabled, settings.animation.duration, settings.animation.easing]);

  return {
    isAnimating,
    animationProgress,
    startAnimation
  };
}

// ============================================================================
// KEYBOARD NAVIGATION HOOK
// ============================================================================

export function useSankeyKeyboardNavigation(
  nodes: ProcessedSankeyNode[],
  _links: ProcessedSankeyLink[],
  _selection: SankeySelection,
  selectNode: (nodeId: string) => void,
  _selectLink: (linkId: string) => void,
  clearSelection: () => void
) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!nodes.length) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => (prev + 1) % nodes.length);
        selectNode(nodes[(focusedIndex + 1) % nodes.length].id);
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = focusedIndex === 0 ? nodes.length - 1 : focusedIndex - 1;
        setFocusedIndex(prevIndex);
        selectNode(nodes[prevIndex].id);
        break;
        
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex < nodes.length) {
          selectNode(nodes[focusedIndex].id);
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        clearSelection();
        setFocusedIndex(0);
        break;
    }
  }, [nodes, focusedIndex, selectNode, clearSelection]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { focusedIndex };
}

// ============================================================================
// PERFORMANCE MONITORING HOOK
// ============================================================================

export function useSankeyPerformance() {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    nodeCount: 0,
    linkCount: 0,
    lastUpdate: Date.now()
  });

  const startRender = useCallback(() => {
    return performance.now();
  }, []);

  const endRender = useCallback((startTime: number, nodeCount: number, linkCount: number) => {
    const renderTime = performance.now() - startTime;
    setMetrics({
      renderTime,
      nodeCount,
      linkCount,
      lastUpdate: Date.now()
    });
  }, []);

  return {
    metrics,
    startRender,
    endRender
  };
}

// ============================================================================
// RESPONSIVE HOOK
// ============================================================================

export function useSankeyResponsive(settings: SankeySettings) {
  const [breakpoint, setBreakpoint] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      const { mobile, tablet } = settings.display.responsiveBreakpoints;
      
      if (width < mobile) {
        setBreakpoint('mobile');
        setIsMobile(true);
      } else if (width < tablet) {
        setBreakpoint('tablet');
        setIsMobile(false);
      } else {
        setBreakpoint('desktop');
        setIsMobile(false);
      }
    };

    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [settings.display.responsiveBreakpoints]);

  return { breakpoint, isMobile };
}

// ============================================================================
// MAIN SANKEY HOOK
// ============================================================================

export function useSankey(
  data: SankeyData,
  settings: SankeySettings,
  width: number,
  height: number
) {
  // Process data
  const processedData = useSankeyData(data, width, height, settings);
  
  // Selection management
  const selectionHook = useSankeySelection();
  
  // Transform management
  const transformHook = useSankeyTransform();
  
  // Tooltip management
  const tooltipHook = useSankeyTooltip();
  
  // Animation
  const animationHook = useSankeyAnimation(settings);
  
  // Performance monitoring
  const performanceHook = useSankeyPerformance();
  
  // Responsive behavior
  const responsiveHook = useSankeyResponsive(settings);

  // Calculate metrics
  const metrics = useMemo(() => calculateSankeyMetrics(data), [data]);

  // Validation
  const validation = useMemo(() => validateSankeyData(data), [data]);

  return {
    // Processed data
    nodes: processedData.nodes,
    links: processedData.links,
    
    // Selection
    ...selectionHook,
    
    // Transform
    ...transformHook,
    
    // Tooltip
    ...tooltipHook,
    
    // Animation
    ...animationHook,
    
    // Performance
    ...performanceHook,
    
    // Responsive
    ...responsiveHook,
    
    // Metrics and validation
    metrics,
    validation
  };
}