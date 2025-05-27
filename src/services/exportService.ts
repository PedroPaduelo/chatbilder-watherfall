import type { DataRow, ChartSettings } from '../types';
import { UI_CONSTANTS } from '../utils/constants';

export interface ExportData {
  data: DataRow[];
  settings: ChartSettings;
  version: string;
}

export class ExportService {
  /**
   * Export chart as PNG image
   */
  static async exportAsPNG(chartElement: HTMLDivElement, filename = UI_CONSTANTS.FILES.DEFAULT_FILENAMES.PNG): Promise<void> {
    const svg = chartElement.querySelector('svg');
    if (!svg) throw new Error('No SVG element found');
    
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    const img = document.createElement('img');
    
    canvas.width = UI_CONSTANTS.CHART.DEFAULT_WIDTH;
    canvas.height = UI_CONSTANTS.CHART.DEFAULT_HEIGHT;
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          
          canvas.toBlob((blob) => {
            if (blob) {
              this.downloadBlob(blob, filename);
              resolve();
            } else {
              reject(new Error('Failed to create PNG blob'));
            }
          });
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load SVG image'));
      img.src = url;
    });
  }

  /**
   * Export chart as SVG
   */
  static exportAsSVG(chartElement: HTMLDivElement, filename = UI_CONSTANTS.FILES.DEFAULT_FILENAMES.SVG): void {
    const svg = chartElement.querySelector('svg');
    if (!svg) throw new Error('No SVG element found');
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export data as JSON
   */
  static exportAsJSON(data: DataRow[], settings: ChartSettings, filename = UI_CONSTANTS.FILES.DEFAULT_FILENAMES.JSON): void {
    const exportData: ExportData = {
      data,
      settings,
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export chart as standalone HTML
   */
  static exportAsHTML(chartElement: HTMLDivElement, filename = UI_CONSTANTS.FILES.DEFAULT_FILENAMES.HTML): void {
    const svg = chartElement.querySelector('svg');
    if (!svg) throw new Error('No SVG element found');
    
    const svgString = new XMLSerializer().serializeToString(svg);
    const fullHTML = this.generateHTMLTemplate(svgString);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Generate HTML template for standalone chart
   */
  private static generateHTMLTemplate(svgString: string): string {
    return `<!DOCTYPE html>
<html>
<head>
  <title>Waterfall Chart with Stacked Bars</title>
  <style>
    body { 
      margin: 0; 
      padding: 20px; 
      font-family: system-ui, -apple-system, sans-serif; 
      background-color: #f3f4f6;
    }
    .chart-container { 
      width: 100%; 
      max-width: 1200px; 
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1 {
      margin-top: 0;
      color: #1f2937;
    }
    .info {
      margin: 1rem 0;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 4px;
      font-size: 0.875rem;
      color: #4b5563;
    }
  </style>
</head>
<body>
  <div class="chart-container">
    <h1>Waterfall Chart with Stacked Bars</h1>
    <div class="info">
      This waterfall chart supports stacked bars for baseline and total values. 
      Each segment represents a subcategory with its own value and color.
    </div>
    ${svgString}
  </div>
</body>
</html>`;
  }

  /**
   * Download blob as file
   */
  private static downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }
}