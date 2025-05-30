import type { ChartSettings, ChartType } from '../types';

export interface ChartTypeSettings {
  [key: string]: Partial<ChartSettings>;
}

// Configurações específicas por tipo de gráfico
export const chartTypeDefaultSettings: ChartTypeSettings = {
  waterfall: {
    barWidth: 60,
    barSpacing: 20,
    showConnectors: true,
    showValues: true,
    showCategories: true,
    showSegmentLabels: true,
    categoryLabelRotation: 0,
    valuePrefix: 'R$ ',
    valueSuffix: '',
    showGridlines: true,
    showAxes: true,
    accentColor: '#3B82F6',
    primaryColor: '#374151',
    backgroundColor: '#ffffff',
    title: 'Gráfico Waterfall',
    colors: {
      baseline: '#4B5563',
      increase: '#10B981',
      decrease: '#EF4444',
      subtotal: '#3B82F6',
      total: '#6366F1'
    }
  },
  
  'stacked-bar': {
    barWidth: 50,
    barSpacing: 15,
    showConnectors: false,
    showValues: true,
    showCategories: true,
    showSegmentLabels: true,
    categoryLabelRotation: 0,
    valuePrefix: '',
    valueSuffix: ' un',
    showGridlines: true,
    showAxes: true,
    accentColor: '#8B5CF6',
    primaryColor: '#374151',
    backgroundColor: '#ffffff',
    title: 'Gráfico de Barras Empilhadas',
    colors: {
      baseline: '#6B7280',
      increase: '#10B981',
      decrease: '#EF4444',
      subtotal: '#8B5CF6',
      total: '#1F2937'
    }
  },
  
  line: {
    barWidth: 40, // Line thickness
    barSpacing: 10,
    showConnectors: false,
    showValues: true,
    showCategories: true,
    showSegmentLabels: false,
    categoryLabelRotation: 45,
    valuePrefix: '',
    valueSuffix: '',
    showGridlines: true,
    showAxes: true,
    accentColor: '#3B82F6',
    primaryColor: '#374151',
    backgroundColor: '#ffffff',
    title: 'Gráfico de Linha',
    colors: {
      baseline: '#3B82F6',
      increase: '#10B981',
      decrease: '#EF4444',
      subtotal: '#8B5CF6',
      total: '#1F2937'
    }
  },
  
  area: {
    barWidth: 45,
    barSpacing: 12,
    showConnectors: false,
    showValues: true,
    showCategories: true,
    showSegmentLabels: true,
    categoryLabelRotation: 0,
    valuePrefix: '',
    valueSuffix: ' views',
    showGridlines: true,
    showAxes: true,
    accentColor: '#10B981',
    primaryColor: '#374151',
    backgroundColor: '#ffffff',
    title: 'Gráfico de Área',
    colors: {
      baseline: '#10B981',
      increase: '#3B82F6',
      decrease: '#EF4444',
      subtotal: '#8B5CF6',
      total: '#1F2937'
    }
  },
  
  sankey: {
    barWidth: 20, // Node width
    barSpacing: 40, // Node spacing
    showConnectors: false, // Não aplicável ao Sankey
    showValues: true,
    showCategories: false, // Não aplicável ao Sankey
    showSegmentLabels: false, // Não aplicável ao Sankey
    categoryLabelRotation: 0,
    valuePrefix: '',
    valueSuffix: '',
    showGridlines: false, // Não necessário para Sankey
    showAxes: false, // Não aplicável ao Sankey
    accentColor: '#6366F1',
    primaryColor: '#374151',
    backgroundColor: '#ffffff',
    title: 'Diagrama Sankey',
    colors: {
      baseline: '#6366F1',
      increase: '#10B981',
      decrease: '#EF4444',
      subtotal: '#8B5CF6',
      total: '#1F2937'
    },
    // Configurações específicas do Sankey
    sankeySettings: {
      nodeWidth: 20,
      nodeMinHeight: 30,
      nodeSpacing: 40,
      nodeBorderRadius: 4,
      nodeOpacity: 1,
      linkOpacity: 0.7,
      linkCurvature: 0.5,
      linkGradient: true,
      linkHoverOpacity: 0.9,
      iterations: 6,
      spacingRatio: 0.8,
      minSpacing: 20,
      compressionThreshold: 0.9,
      showNodeLabels: true,
      showNodeValues: true,
      showTooltips: true,
      animationDuration: 300,
      colorScheme: 'default',
      customColors: ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
      linkColorMode: 'gradient',
      labelFontSize: 12,
      labelFontWeight: 'bold',
      labelColor: '#374151',
      valueFontSize: 10,
      valueColor: '#6B7280'
    }
  }
};

export class ChartSettingsManager {
  private static readonly STORAGE_KEY = 'chart-settings-by-type';

  /**
   * Obtém configurações salvas para um tipo de gráfico específico
   */
  static getSettingsForChartType(chartType: ChartType): Partial<ChartSettings> {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        return parsed[chartType] || {};
      }
    } catch (error) {
      console.warn('Erro ao carregar configurações salvas:', error);
    }
    
    return {};
  }

  /**
   * Salva configurações para um tipo de gráfico específico
   */
  static saveSettingsForChartType(chartType: ChartType, settings: Partial<ChartSettings>): void {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      const parsed = savedSettings ? JSON.parse(savedSettings) : {};
      
      parsed[chartType] = {
        ...parsed[chartType],
        ...settings
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
    } catch (error) {
      console.warn('Erro ao salvar configurações:', error);
    }
  }

  /**
   * Obtém configurações completas mesclando padrões + personalizadas
   */
  static getCompleteSettings(chartType: ChartType): ChartSettings {
    const defaultSettings = chartTypeDefaultSettings[chartType] || chartTypeDefaultSettings.waterfall;
    const savedSettings = this.getSettingsForChartType(chartType);
    
    return {
      // Base defaults
      barWidth: 60,
      barSpacing: 20,
      showConnectors: true,
      showValues: true,
      showCategories: true,
      showSegmentLabels: true,
      categoryLabelRotation: 0,
      valuePrefix: '',
      valueSuffix: '',
      showGridlines: true,
      showAxes: true,
      accentColor: '#3B82F6',
      primaryColor: '#374151',
      backgroundColor: '#ffffff',
      title: '',
      labelSettings: {
        categoryFontSize: 12,
        categoryFontColor: '#374151',
        categoryFontWeight: 'normal',
        valueFontSize: 14,
        valueFontColor: '#111827',
        valueFontWeight: 'bold',
        segmentLabelFontSize: 10,
        segmentLabelFontColor: '#FFFFFF',
        segmentLabelFontWeight: 'normal',
      },
      chartDimensions: {
        width: 900,
        height: 500,
        autoResize: true,
        aspectRatio: 'auto',
      },
      colors: {
        baseline: '#4B5563',
        increase: '#10B981',
        decrease: '#EF4444',
        subtotal: '#3B82F6',
        total: '#6366F1'
      },
      // Apply chart type defaults
      ...defaultSettings,
      // Apply saved settings
      ...savedSettings,
    } as ChartSettings;
  }

  /**
   * Reset configurações para padrões do tipo de gráfico
   */
  static resetToDefaults(chartType: ChartType): ChartSettings {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        delete parsed[chartType];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
      }
    } catch (error) {
      console.warn('Erro ao resetar configurações:', error);
    }
    
    return this.getCompleteSettings(chartType);
  }

  /**
   * Exporta todas as configurações personalizadas
   */
  static exportAllSettings(): string {
    try {
      const savedSettings = localStorage.getItem(this.STORAGE_KEY);
      return savedSettings || '{}';
    } catch (error) {
      console.warn('Erro ao exportar configurações:', error);
      return '{}';
    }
  }

  /**
   * Importa configurações personalizadas
   */
  static importSettings(settingsJson: string): boolean {
    try {
      const parsed = JSON.parse(settingsJson);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
      return true;
    } catch (error) {
      console.warn('Erro ao importar configurações:', error);
      return false;
    }
  }

  /**
   * Obtém configurações recomendadas para um tipo de gráfico
   */
  static getRecommendedSettings(chartType: ChartType): Array<{
    category: string;
    settings: Array<{
      key: keyof ChartSettings;
      label: string;
      value: any;
      description: string;
    }>;
  }> {
    const recommendations = {
      waterfall: [
        {
          category: 'Visualização',
          settings: [
            { key: 'showConnectors', label: 'Conectores', value: true, description: 'Linhas entre barras para mostrar fluxo' },
            { key: 'showValues', label: 'Valores', value: true, description: 'Mostrar valores nas barras' },
            { key: 'valuePrefix', label: 'Prefixo', value: 'R$ ', description: 'Prefixo monetário' }
          ]
        },
        {
          category: 'Layout',
          settings: [
            { key: 'barWidth', label: 'Largura da Barra', value: 60, description: 'Largura ideal para waterfall' },
            { key: 'barSpacing', label: 'Espaçamento', value: 20, description: 'Espaço entre barras' }
          ]
        }
      ],
      'stacked-bar': [
        {
          category: 'Segmentos',
          settings: [
            { key: 'showSegmentLabels', label: 'Labels de Segmento', value: true, description: 'Mostrar nomes dos segmentos' },
            { key: 'showValues', label: 'Valores Totais', value: true, description: 'Valor total da barra' }
          ]
        },
        {
          category: 'Layout',
          settings: [
            { key: 'barWidth', label: 'Largura da Barra', value: 50, description: 'Largura para comparação' },
            { key: 'categoryLabelRotation', label: 'Rotação de Labels', value: 0, description: 'Sem rotação para melhor leitura' }
          ]
        }
      ],
      line: [
        {
          category: 'Tendências',
          settings: [
            { key: 'showGridlines', label: 'Grade', value: true, description: 'Facilita leitura de tendências' },
            { key: 'categoryLabelRotation', label: 'Rotação de Labels', value: 45, description: 'Para datas/períodos longos' }
          ]
        }
      ],
      area: [
        {
          category: 'Áreas Empilhadas',
          settings: [
            { key: 'showSegmentLabels', label: 'Labels de Área', value: true, description: 'Identificar cada área' },
            { key: 'showGridlines', label: 'Grade', value: true, description: 'Referência visual' }
          ]
        }
      ],
      sankey: [
        {
          category: 'Fluxo',
          settings: [
            { key: 'showGridlines', label: 'Grade', value: false, description: 'Não necessária para fluxo' },
            { key: 'showAxes', label: 'Eixos', value: false, description: 'Não aplicável ao Sankey' }
          ]
        }
      ]
    };

    return recommendations[chartType] || [];
  }
}