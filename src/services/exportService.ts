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
    // Look for Recharts SVG element
    const svg = chartElement.querySelector('svg') || chartElement.querySelector('.recharts-wrapper svg');
    if (!svg) throw new Error('No chart element found for export');
    
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    
    // Ensure proper styling for export
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Get computed styles and apply them inline
    const allElements = clonedSvg.querySelectorAll('*');
    allElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element as Element);
      let styleText = '';
      for (let i = 0; i < computedStyle.length; i++) {
        const property = computedStyle[i];
        styleText += `${property}: ${computedStyle.getPropertyValue(property)}; `;
      }
      (element as HTMLElement).style.cssText = styleText;
    });
    
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');
    
    const img = document.createElement('img');
    
    // Get actual SVG dimensions or use defaults
    const svgRect = svg.getBoundingClientRect();
    canvas.width = svgRect.width || UI_CONSTANTS.CHART.DEFAULT_WIDTH;
    canvas.height = svgRect.height || UI_CONSTANTS.CHART.DEFAULT_HEIGHT;
    
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          // Fill white background
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(img, 0, 0);
          URL.revokeObjectURL(url);
          
          canvas.toBlob((blob) => {
            if (blob) {
              this.downloadBlob(blob, filename);
              resolve();
            } else {
              reject(new Error('Failed to create PNG blob'));
            }
          }, 'image/png', 1.0);
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
    // Look for Recharts SVG element
    const svg = chartElement.querySelector('svg') || chartElement.querySelector('.recharts-wrapper svg');
    if (!svg) throw new Error('No chart element found for export');
    
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    
    // Ensure proper SVG attributes
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Add white background
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', 'white');
    clonedSvg.insertBefore(rect, clonedSvg.firstChild);
    
    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export data as CSV
   */
  static exportAsCSV(data: any[], filename: string = 'data.csv'): void {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    const csvContent = this.formatCSVData(data);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export data as JSON (overloaded for different data types)
   */
  static exportAsJSON(data: any, settings: any, filename: string = 'data.json'): void {
    const exportData = {
      data,
      settings,
      version: '3.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Export chart as standalone HTML with Recharts
   */
  static exportAsHTML(chartElement: HTMLDivElement, filename = UI_CONSTANTS.FILES.DEFAULT_FILENAMES.HTML): void {
    const svg = chartElement.querySelector('svg') || chartElement.querySelector('.recharts-wrapper svg');
    if (!svg) throw new Error('No chart element found for export');
    
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
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gráfico Waterfall - Powered by Recharts</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      max-width: 1200px;
      width: 100%;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    h1 {
      color: #1a1a1a;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .subtitle {
      color: #666;
      font-size: 1.1rem;
      font-weight: 400;
    }
    
    .chart-container { 
      background: #fafafa;
      border-radius: 12px;
      padding: 1.5rem;
      margin: 2rem 0;
      border: 1px solid #e1e5e9;
    }
    
    .footer {
      text-align: center;
      padding: 1.5rem 0;
      border-top: 1px solid #e1e5e9;
      margin-top: 2rem;
    }
    
    .powered-by {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }
    
    .recharts-logo {
      width: 20px;
      height: 20px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .info-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      border-left: 4px solid #667eea;
    }
    
    .info-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .info-text {
      color: #666;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      body {
        padding: 1rem;
      }
      
      .container {
        padding: 1.5rem;
      }
      
      h1 {
        font-size: 2rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Gráfico Waterfall</h1>
      <p class="subtitle">Visualização interativa de dados com barras empilhadas</p>
    </div>
    
    <div class="chart-container">
      ${svgString}
    </div>
    
    <div class="info-grid">
      <div class="info-card">
        <div class="info-title">🎯 Tecnologia</div>
        <div class="info-text">Construído com React e Recharts para máxima performance e interatividade</div>
      </div>
      
      <div class="info-card">
        <div class="info-title">📊 Funcionalidades</div>
        <div class="info-text">Suporte completo a barras empilhadas, tooltips interativos e customização avançada</div>
      </div>
      
      <div class="info-card">
        <div class="info-title">💾 Exportação</div>
        <div class="info-text">Exportado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</div>
      </div>
    </div>
    
    <div class="footer">
      <div class="powered-by">
        <div class="recharts-logo"></div>
        <span>Powered by Recharts & React</span>
      </div>
    </div>
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

  private static formatCSVData(data: any[]): string {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header as keyof typeof row];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    return csvContent;
  }
}