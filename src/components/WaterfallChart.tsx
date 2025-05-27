import { useState, useMemo } from 'react';
import type { DataRow, ChartSettings } from '../types';
import { useProcessedData } from '../hooks/useProcessedData';
import { useChartDimensions } from '../hooks/useChartDimensions';
import ChartGrid from './ChartGrid';
import ChartAxes from './ChartAxes';
import ChartBars from './ChartBars';
import ChartConnectors from './ChartConnectors';
import ChartTooltips from './ChartTooltips';
import CategoryLabels from './CategoryLabels';

interface WaterfallChartProps {
  data: DataRow[];
  settings: ChartSettings;
}

const WaterfallChart = ({ data, settings }: WaterfallChartProps) => {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<{ barId: string, segmentIndex: number } | null>(null);
  
  // Calculate chart dimensions based on settings
  const chartDimensions = useMemo(() => {
    const baseWidth = settings.chartDimensions?.width || 900;
    const baseHeight = settings.chartDimensions?.height || 500;
    
    if (settings.chartDimensions?.autoResize) {
      return { width: baseWidth, height: baseHeight };
    }
    
    // Apply aspect ratio if set
    if (settings.chartDimensions?.aspectRatio && 
        settings.chartDimensions.aspectRatio !== 'auto' && 
        settings.chartDimensions.aspectRatio !== 'custom') {
      const aspectRatios = {
        '16:9': 16 / 9,
        '4:3': 4 / 3,
        '1:1': 1
      };
      
      const ratio = aspectRatios[settings.chartDimensions.aspectRatio as keyof typeof aspectRatios];
      if (ratio) {
        return { width: baseWidth, height: baseWidth / ratio };
      }
    }
    
    return { width: baseWidth, height: baseHeight };
  }, [settings.chartDimensions]);
  
  const dimensions = useChartDimensions(data, settings);
  const processedData = useProcessedData(data, settings, dimensions);

  return (
    <div className="relative w-full">
      <svg 
        width={settings.chartDimensions?.autoResize ? "100%" : chartDimensions.width} 
        height={chartDimensions.height}
        viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
        className="max-w-full h-auto"
      >
        <title>Waterfall Chart with Stacked Bars</title>
        
        {/* Background */}
        <rect width={chartDimensions.width} height={chartDimensions.height} fill="transparent" />
        
        {/* Grid lines and Y axis labels */}
        <ChartGrid 
          settings={settings}
          dimensions={dimensions}
          chartWidth={chartDimensions.width}
          chartHeight={chartDimensions.height}
        />
        
        {/* Chart Axes */}
        <ChartAxes 
          settings={settings}
          dimensions={dimensions}
          chartWidth={chartDimensions.width}
          chartHeight={chartDimensions.height}
        />
        
        {/* Bars */}
        <ChartBars 
          processedData={processedData}
          settings={settings}
          dimensions={dimensions}
          hoveredBar={hoveredBar}
          hoveredSegment={hoveredSegment}
          onBarHover={setHoveredBar}
          onSegmentHover={setHoveredSegment}
        />
        
        {/* Connectors */}
        <ChartConnectors 
          processedData={processedData}
          settings={settings}
        />
        
        {/* Category labels */}
        <CategoryLabels 
          processedData={processedData}
          settings={settings}
          dimensions={dimensions}
        />
      </svg>
      
      {/* Tooltips */}
      <ChartTooltips 
        processedData={processedData}
        settings={settings}
        hoveredBar={hoveredBar}
        hoveredSegment={hoveredSegment}
      />
    </div>
  );
};

export default WaterfallChart;