import type { DataRow, SankeyData, ChartType } from '../types';

export interface ChartTemplate {
  type: ChartType;
  name: string;
  description: string;
  sampleData: DataRow[] | SankeyData;
  csvTemplate: string;
  excelTemplate: any[][];
  jsonTemplate: any;
  instructions: string[];
}

export class TemplateService {
  /**
   * Gera template CSV para Waterfall Chart
   */
  static generateWaterfallCSV(): string {
    const headers = ['id', 'category', 'value', 'type', 'color', 'isSubtotal'];
    const sampleRows = [
      ['1', 'Receita Inicial', '100000', 'baseline', '#3b82f6', 'false'],
      ['2', 'Vendas Online', '25000', 'increase', '#10b981', 'false'],
      ['3', 'Vendas Físicas', '15000', 'increase', '#10b981', 'false'],
      ['4', 'Subtotal Vendas', '140000', 'subtotal', '#8b5cf6', 'true'],
      ['5', 'Custos Operacionais', '-20000', 'decrease', '#ef4444', 'false'],
      ['6', 'Marketing', '-8000', 'decrease', '#ef4444', 'false'],
      ['7', 'Total Final', '112000', 'total', '#1f2937', 'false']
    ];
    
    return [headers, ...sampleRows].map(row => row.join(',')).join('\n');
  }

  /**
   * Gera template CSV para Stacked Bar Chart
   */
  static generateStackedBarCSV(): string {
    const headers = ['id', 'category', 'value', 'type', 'color', 'segment_categoria', 'segment_valor', 'segment_cor'];
    const sampleRows = [
      ['1', 'Q1 2024', '0', 'baseline', '#3b82f6', 'Produto A', '35000', '#ef4444'],
      ['1', 'Q1 2024', '0', 'baseline', '#3b82f6', 'Produto B', '25000', '#10b981'],
      ['1', 'Q1 2024', '0', 'baseline', '#3b82f6', 'Produto C', '20000', '#f59e0b'],
      ['2', 'Q2 2024', '0', 'baseline', '#3b82f6', 'Produto A', '40000', '#ef4444'],
      ['2', 'Q2 2024', '0', 'baseline', '#3b82f6', 'Produto B', '30000', '#10b981'],
      ['2', 'Q2 2024', '0', 'baseline', '#3b82f6', 'Produto C', '22000', '#f59e0b'],
      ['3', 'Q3 2024', '0', 'baseline', '#3b82f6', 'Produto A', '42000', '#ef4444'],
      ['3', 'Q3 2024', '0', 'baseline', '#3b82f6', 'Produto B', '28000', '#10b981'],
      ['3', 'Q3 2024', '0', 'baseline', '#3b82f6', 'Produto C', '25000', '#f59e0b']
    ];
    
    return [headers, ...sampleRows].map(row => row.join(',')).join('\n');
  }

  /**
   * Gera template CSV para Line Chart
   */
  static generateLineChartCSV(): string {
    const headers = ['id', 'category', 'value', 'type', 'color'];
    const sampleRows = [
      ['1', 'Janeiro', '65000', 'baseline', '#3b82f6'],
      ['2', 'Fevereiro', '72000', 'baseline', '#3b82f6'],
      ['3', 'Março', '68000', 'baseline', '#3b82f6'],
      ['4', 'Abril', '75000', 'baseline', '#3b82f6'],
      ['5', 'Maio', '82000', 'baseline', '#3b82f6'],
      ['6', 'Junho', '88000', 'baseline', '#3b82f6']
    ];
    
    return [headers, ...sampleRows].map(row => row.join(',')).join('\n');
  }

  /**
   * Gera template CSV para Area Chart
   */
  static generateAreaChartCSV(): string {
    const headers = ['id', 'category', 'value', 'type', 'color', 'segment_categoria', 'segment_valor', 'segment_cor'];
    const sampleRows = [
      ['1', 'Semana 1', '0', 'baseline', '#3b82f6', 'Desktop', '12000', '#3b82f6'],
      ['1', 'Semana 1', '0', 'baseline', '#3b82f6', 'Mobile', '8000', '#10b981'],
      ['1', 'Semana 1', '0', 'baseline', '#3b82f6', 'Tablet', '3000', '#f59e0b'],
      ['2', 'Semana 2', '0', 'baseline', '#3b82f6', 'Desktop', '14000', '#3b82f6'],
      ['2', 'Semana 2', '0', 'baseline', '#3b82f6', 'Mobile', '9500', '#10b981'],
      ['2', 'Semana 2', '0', 'baseline', '#3b82f6', 'Tablet', '3500', '#f59e0b'],
      ['3', 'Semana 3', '0', 'baseline', '#3b82f6', 'Desktop', '13500', '#3b82f6'],
      ['3', 'Semana 3', '0', 'baseline', '#3b82f6', 'Mobile', '11000', '#10b981'],
      ['3', 'Semana 3', '0', 'baseline', '#3b82f6', 'Tablet', '4000', '#f59e0b']
    ];
    
    return [headers, ...sampleRows].map(row => row.join(',')).join('\n');
  }

  /**
   * Gera template JSON para Sankey Diagram
   */
  static generateSankeyJSON(): string {
    const template = {
      nodes: [
        { id: 'source1', name: 'Tráfego Orgânico', color: '#3B82F6' },
        { id: 'source2', name: 'Tráfego Pago', color: '#10B981' },
        { id: 'source3', name: 'Redes Sociais', color: '#F59E0B' },
        { id: 'middle1', name: 'Página Inicial', color: '#8B5CF6' },
        { id: 'middle2', name: 'Página de Produto', color: '#EC4899' },
        { id: 'target1', name: 'Conversão', color: '#059669' },
        { id: 'target2', name: 'Abandono', color: '#DC2626' }
      ],
      links: [
        { source: 'source1', target: 'middle1', value: 5000 },
        { source: 'source1', target: 'middle2', value: 3000 },
        { source: 'source2', target: 'middle1', value: 2000 },
        { source: 'source2', target: 'middle2', value: 1500 },
        { source: 'source3', target: 'middle1', value: 1000 },
        { source: 'source3', target: 'middle2', value: 800 },
        { source: 'middle1', target: 'target1', value: 2500 },
        { source: 'middle1', target: 'target2', value: 5500 },
        { source: 'middle2', target: 'target1', value: 1800 },
        { source: 'middle2', target: 'target2', value: 3500 }
      ]
    };
    
    return JSON.stringify(template, null, 2);
  }

  /**
   * Obtém template específico por tipo de gráfico
   */
  static getTemplate(chartType: ChartType): ChartTemplate {
    switch (chartType) {
      case 'waterfall':
        return {
          type: 'waterfall',
          name: 'Waterfall Chart Template',
          description: 'Template para gráfico waterfall com efeitos cumulativos',
          sampleData: [], // Será preenchido com dados reais se necessário
          csvTemplate: this.generateWaterfallCSV(),
          excelTemplate: [],
          jsonTemplate: {},
          instructions: [
            '1. Use "baseline" para valores iniciais',
            '2. Use "increase" para valores positivos',
            '3. Use "decrease" para valores negativos',
            '4. Use "subtotal" para subtotais intermediários',
            '5. Use "total" para o valor final',
            '6. Para barras empilhadas, adicione colunas segment_*'
          ]
        };

      case 'stacked-bar':
        return {
          type: 'stacked-bar',
          name: 'Stacked Bar Chart Template',
          description: 'Template para gráfico de barras empilhadas',
          sampleData: [],
          csvTemplate: this.generateStackedBarCSV(),
          excelTemplate: [],
          jsonTemplate: {},
          instructions: [
            '1. Cada linha representa um segmento',
            '2. Agrupe por "id" e "category" para empilhar',
            '3. Use "segment_categoria" para nome do segmento',
            '4. Use "segment_valor" para valor do segmento',
            '5. Use "segment_cor" para cor do segmento',
            '6. Mantenha "value" como 0 para barras empilhadas'
          ]
        };

      case 'line':
        return {
          type: 'line',
          name: 'Line Chart Template',
          description: 'Template para gráfico de linha temporal',
          sampleData: [],
          csvTemplate: this.generateLineChartCSV(),
          excelTemplate: [],
          jsonTemplate: {},
          instructions: [
            '1. Use "category" para eixo X (tempo/período)',
            '2. Use "value" para eixo Y (métrica)',
            '3. Ordene cronologicamente por "id"',
            '4. Use "type" como "baseline" para dados simples',
            '5. Mantenha consistência nas cores'
          ]
        };

      case 'area':
        return {
          type: 'area',
          name: 'Area Chart Template',
          description: 'Template para gráfico de área com segmentos',
          sampleData: [],
          csvTemplate: this.generateAreaChartCSV(),
          excelTemplate: [],
          jsonTemplate: {},
          instructions: [
            '1. Similar ao Stacked Bar, mas para área',
            '2. Use segmentos para empilhamento de áreas',
            '3. Ordene cronologicamente',
            '4. Cores consistentes por segmento',
            '5. Valores acumulativos funcionam melhor'
          ]
        };

      case 'sankey':
        return {
          type: 'sankey',
          name: 'Sankey Diagram Template',
          description: 'Template para diagrama de fluxo Sankey',
          sampleData: {} as SankeyData,
          csvTemplate: '', // Sankey usa JSON
          excelTemplate: [],
          jsonTemplate: this.generateSankeyJSON(),
          instructions: [
            '1. Use JSON ao invés de CSV',
            '2. "nodes" define os elementos do fluxo',
            '3. "links" define as conexões e valores',
            '4. "source" e "target" devem corresponder aos IDs dos nós',
            '5. "value" determina a largura do fluxo',
            '6. Cores opcionais para personalização'
          ]
        };

      default:
        return this.getTemplate('waterfall');
    }
  }

  /**
   * Gera arquivo para download
   */
  static downloadTemplate(chartType: ChartType, format: 'csv' | 'json' = 'csv'): void {
    const template = this.getTemplate(chartType);
    
    if (chartType === 'sankey' || format === 'json') {
      const content = chartType === 'sankey' ? template.jsonTemplate : JSON.stringify(template.sampleData, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chartType}-template.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([template.csvTemplate], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chartType}-template.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Valida dados importados contra o template
   */
  static validateImportedData(chartType: ChartType, data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      errors.push('Nenhum dado foi importado');
      return { valid: false, errors };
    }

    switch (chartType) {
      case 'waterfall':
      case 'stacked-bar':
      case 'line':
      case 'area':
        if (!Array.isArray(data)) {
          errors.push('Dados devem ser um array');
          break;
        }
        
        data.forEach((row, index) => {
          if (!row.id) errors.push(`Linha ${index + 1}: ID é obrigatório`);
          if (!row.category) errors.push(`Linha ${index + 1}: Category é obrigatório`);
          if (row.value === undefined || row.value === null) errors.push(`Linha ${index + 1}: Value é obrigatório`);
          if (!row.type) errors.push(`Linha ${index + 1}: Type é obrigatório`);
        });
        break;

      case 'sankey':
        if (!data.nodes || !Array.isArray(data.nodes)) {
          errors.push('Nodes são obrigatórios e devem ser um array');
        } else {
          data.nodes.forEach((node: any, index: number) => {
            if (!node.id) errors.push(`Node ${index + 1}: ID é obrigatório`);
            if (!node.name) errors.push(`Node ${index + 1}: Name é obrigatório`);
          });
        }
        
        if (!data.links || !Array.isArray(data.links)) {
          errors.push('Links são obrigatórios e devem ser um array');
        } else {
          data.links.forEach((link: any, index: number) => {
            if (!link.source) errors.push(`Link ${index + 1}: Source é obrigatório`);
            if (!link.target) errors.push(`Link ${index + 1}: Target é obrigatório`);
            if (link.value === undefined || link.value === null) errors.push(`Link ${index + 1}: Value é obrigatório`);
          });
        }
        break;
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Gera template como string (usado pelo UniversalImporter)
   */
  static generateTemplate(chartType: ChartType, format: 'csv' | 'json' = 'csv'): string {
    const template = this.getTemplate(chartType);
    
    if (chartType === 'sankey' || format === 'json') {
      return chartType === 'sankey' ? template.jsonTemplate : JSON.stringify(template.sampleData, null, 2);
    } else {
      return template.csvTemplate;
    }
  }
}