import type { DataRow, SankeyData, ChartType } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
  correctedData?: any;
}

export interface ValidationError {
  type: 'missing_field' | 'invalid_type' | 'invalid_value' | 'structure_error';
  message: string;
  field?: string;
  row?: number;
  severity: 'critical' | 'error' | 'warning';
}

export interface ValidationWarning {
  type: 'format_inconsistency' | 'potential_issue' | 'optimization';
  message: string;
  field?: string;
  row?: number;
}

export interface ValidationSuggestion {
  type: 'auto_fix' | 'manual_fix' | 'optimization';
  message: string;
  action: string;
  autoFixable: boolean;
  fixFunction?: () => any;
}

export class DataValidationService {
  /**
   * Valida dados importados com análise inteligente
   */
  static validateData(chartType: ChartType, data: any): ValidationResult {
    const result: ValidationResult = {
      valid: true,
      errors: [],
      warnings: [],
      suggestions: []
    };

    // Validação básica de existência
    if (!data) {
      result.errors.push({
        type: 'structure_error',
        message: 'Nenhum dado foi fornecido',
        severity: 'critical'
      });
      result.valid = false;
      return result;
    }

    switch (chartType) {
      case 'waterfall':
        return this.validateWaterfallData(data, result);
      case 'stacked-bar':
        return this.validateStackedBarData(data, result);
      case 'line':
        return this.validateLineChartData(data, result);
      case 'area':
        return this.validateAreaChartData(data, result);
      case 'sankey':
        return this.validateSankeyData(data, result);
      default:
        result.errors.push({
          type: 'structure_error',
          message: `Tipo de gráfico '${chartType}' não suportado`,
          severity: 'critical'
        });
        result.valid = false;
        return result;
    }
  }

  /**
   * Valida dados para Waterfall Chart
   */
  private static validateWaterfallData(data: any[], result: ValidationResult): ValidationResult {
    if (!Array.isArray(data)) {
      result.errors.push({
        type: 'structure_error',
        message: 'Dados devem ser fornecidos como um array',
        severity: 'critical'
      });
      result.valid = false;
      return result;
    }

    const requiredFields = ['id', 'category', 'value', 'type'];
    const validTypes = ['baseline', 'increase', 'decrease', 'subtotal', 'total'];
    let hasBaseline = false;
    let hasTotal = false;

    data.forEach((row, index) => {
      // Verificar campos obrigatórios
      requiredFields.forEach(field => {
        if (row[field] === undefined || row[field] === null || row[field] === '') {
          result.errors.push({
            type: 'missing_field',
            message: `Campo '${field}' é obrigatório`,
            field,
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }
      });

      // Validar tipo de valor
      if (row.value !== undefined && isNaN(Number(row.value))) {
        result.errors.push({
          type: 'invalid_type',
          message: `Valor deve ser numérico`,
          field: 'value',
          row: index + 1,
          severity: 'error'
        });
        result.valid = false;
      }

      // Validar tipo de entrada
      if (row.type && !validTypes.includes(row.type)) {
        result.errors.push({
          type: 'invalid_value',
          message: `Tipo '${row.type}' inválido. Use: ${validTypes.join(', ')}`,
          field: 'type',
          row: index + 1,
          severity: 'error'
        });
        result.valid = false;

        // Sugestão de correção automática
        const suggestion = this.suggestTypeCorrection(row.type, validTypes);
        if (suggestion) {
          result.suggestions.push({
            type: 'auto_fix',
            message: `Sugestão: alterar '${row.type}' para '${suggestion}'`,
            action: `Corrigir tipo na linha ${index + 1}`,
            autoFixable: true,
            fixFunction: () => ({ ...row, type: suggestion })
          });
        }
      }

      // Verificar se há baseline e total
      if (row.type === 'baseline') hasBaseline = true;
      if (row.type === 'total') hasTotal = true;

      // Validações específicas por tipo
      if (row.type === 'decrease' && Number(row.value) > 0) {
        result.warnings.push({
          type: 'potential_issue',
          message: 'Valor positivo para tipo "decrease" - considere usar valor negativo',
          field: 'value',
          row: index + 1
        });
      }

      if (row.type === 'increase' && Number(row.value) < 0) {
        result.warnings.push({
          type: 'potential_issue',
          message: 'Valor negativo para tipo "increase" - considere usar valor positivo',
          field: 'value',
          row: index + 1
        });
      }
    });

    // Sugestões estruturais
    if (!hasBaseline) {
      result.suggestions.push({
        type: 'manual_fix',
        message: 'Considere adicionar um valor "baseline" para o ponto de partida',
        action: 'Adicionar linha baseline',
        autoFixable: false
      });
    }

    if (!hasTotal) {
      result.suggestions.push({
        type: 'auto_fix',
        message: 'Considere adicionar um valor "total" para mostrar o resultado final',
        action: 'Adicionar linha total',
        autoFixable: true,
        fixFunction: () => this.generateTotalRow(data)
      });
    }

    return result;
  }

  /**
   * Valida dados para Stacked Bar Chart
   */
  private static validateStackedBarData(data: any[], result: ValidationResult): ValidationResult {
    if (!Array.isArray(data)) {
      result.errors.push({
        type: 'structure_error',
        message: 'Dados devem ser fornecidos como um array',
        severity: 'critical'
      });
      result.valid = false;
      return result;
    }

    const requiredFields = ['id', 'category', 'segment_categoria', 'segment_valor'];
    const categories = new Set();
    const segments = new Set();

    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (row[field] === undefined || row[field] === null || row[field] === '') {
          result.errors.push({
            type: 'missing_field',
            message: `Campo '${field}' é obrigatório para barras empilhadas`,
            field,
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }
      });

      if (row.segment_valor !== undefined && isNaN(Number(row.segment_valor))) {
        result.errors.push({
          type: 'invalid_type',
          message: `Valor do segmento deve ser numérico`,
          field: 'segment_valor',
          row: index + 1,
          severity: 'error'
        });
        result.valid = false;
      }

      categories.add(row.category);
      segments.add(row.segment_categoria);
    });

    // Verificar consistência dos segmentos
    const categorySegmentMap = new Map();
    data.forEach(row => {
      if (!categorySegmentMap.has(row.category)) {
        categorySegmentMap.set(row.category, new Set());
      }
      categorySegmentMap.get(row.category).add(row.segment_categoria);
    });

    // Verificar se todas as categorias têm os mesmos segmentos
    const segmentCounts = Array.from(categorySegmentMap.values()).map(set => set.size);
    const inconsistentSegments = segmentCounts.some(count => count !== segmentCounts[0]);

    if (inconsistentSegments) {
      result.warnings.push({
        type: 'format_inconsistency',
        message: 'Nem todas as categorias têm os mesmos segmentos - isso pode afetar a visualização',
        field: 'segment_categoria'
      });
    }

    return result;
  }

  /**
   * Valida dados para Line Chart
   */
  private static validateLineChartData(data: any[], result: ValidationResult): ValidationResult {
    if (!Array.isArray(data)) {
      result.errors.push({
        type: 'structure_error',
        message: 'Dados devem ser fornecidos como um array',
        severity: 'critical'
      });
      result.valid = false;
      return result;
    }

    const requiredFields = ['id', 'category', 'value'];
    
    data.forEach((row, index) => {
      requiredFields.forEach(field => {
        if (row[field] === undefined || row[field] === null || row[field] === '') {
          result.errors.push({
            type: 'missing_field',
            message: `Campo '${field}' é obrigatório`,
            field,
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }
      });

      if (row.value !== undefined && isNaN(Number(row.value))) {
        result.errors.push({
          type: 'invalid_type',
          message: `Valor deve ser numérico`,
          field: 'value',
          row: index + 1,
          severity: 'error'
        });
        result.valid = false;
      }
    });

    // Verificar ordenação cronológica
    const ids = data.map(row => Number(row.id)).filter(id => !isNaN(id));
    const isOrdered = ids.every((id, index) => index === 0 || id >= ids[index - 1]);
    
    if (!isOrdered) {
      result.suggestions.push({
        type: 'auto_fix',
        message: 'Dados não estão ordenados cronologicamente',
        action: 'Ordenar por ID',
        autoFixable: true,
        fixFunction: () => data.sort((a, b) => Number(a.id) - Number(b.id))
      });
    }

    return result;
  }

  /**
   * Valida dados para Area Chart
   */
  private static validateAreaChartData(data: any[], result: ValidationResult): ValidationResult {
    // Area chart tem validação similar ao stacked bar
    return this.validateStackedBarData(data, result);
  }

  /**
   * Valida dados para Sankey Diagram
   */
  private static validateSankeyData(data: SankeyData, result: ValidationResult): ValidationResult {
    if (!data.nodes || !Array.isArray(data.nodes)) {
      result.errors.push({
        type: 'structure_error',
        message: 'Propriedade "nodes" é obrigatória e deve ser um array',
        field: 'nodes',
        severity: 'critical'
      });
      result.valid = false;
    }

    if (!data.links || !Array.isArray(data.links)) {
      result.errors.push({
        type: 'structure_error',
        message: 'Propriedade "links" é obrigatória e deve ser um array',
        field: 'links',
        severity: 'critical'
      });
      result.valid = false;
    }

    if (result.valid) {
      const nodeIds = new Set(data.nodes.map(node => node.id));

      // Validar nós
      data.nodes.forEach((node, index) => {
        if (!node.id) {
          result.errors.push({
            type: 'missing_field',
            message: 'ID do nó é obrigatório',
            field: 'id',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }
        if (!node.name) {
          result.errors.push({
            type: 'missing_field',
            message: 'Nome do nó é obrigatório',
            field: 'name',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }
      });

      // Validar links
      data.links.forEach((link, index) => {
        if (!link.source) {
          result.errors.push({
            type: 'missing_field',
            message: 'Source do link é obrigatório',
            field: 'source',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        } else if (!nodeIds.has(link.source)) {
          result.errors.push({
            type: 'invalid_value',
            message: `Source '${link.source}' não existe nos nós`,
            field: 'source',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }

        if (!link.target) {
          result.errors.push({
            type: 'missing_field',
            message: 'Target do link é obrigatório',
            field: 'target',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        } else if (!nodeIds.has(link.target)) {
          result.errors.push({
            type: 'invalid_value',
            message: `Target '${link.target}' não existe nos nós`,
            field: 'target',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }

        if (link.value === undefined || link.value === null || isNaN(Number(link.value))) {
          result.errors.push({
            type: 'invalid_type',
            message: 'Valor do link deve ser numérico',
            field: 'value',
            row: index + 1,
            severity: 'error'
          });
          result.valid = false;
        }
      });
    }

    return result;
  }

  /**
   * Sugere correção automática para tipos inválidos
   */
  private static suggestTypeCorrection(invalidType: string, validTypes: string[]): string | null {
    const normalized = invalidType.toLowerCase();
    
    // Mapeamento de correções comuns
    const corrections: { [key: string]: string } = {
      'base': 'baseline',
      'inicial': 'baseline',
      'start': 'baseline',
      'aumento': 'increase',
      'positivo': 'increase',
      'plus': 'increase',
      'diminuição': 'decrease',
      'negativo': 'decrease',
      'minus': 'decrease',
      'subtotal': 'subtotal',
      'intermediario': 'subtotal',
      'final': 'total',
      'fim': 'total',
      'resultado': 'total'
    };

    if (corrections[normalized]) {
      return corrections[normalized];
    }

    // Busca por similaridade (Levenshtein simples)
    let bestMatch = null;
    let bestScore = Infinity;

    validTypes.forEach(validType => {
      const score = this.levenshteinDistance(normalized, validType.toLowerCase());
      if (score < bestScore && score <= 2) {
        bestScore = score;
        bestMatch = validType;
      }
    });

    return bestMatch;
  }

  /**
   * Calcula distância de Levenshtein para sugestões
   */
  private static levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Gera linha de total automaticamente para waterfall
   */
  private static generateTotalRow(data: any[]): any {
    const totalValue = data.reduce((sum, row) => {
      if (row.type === 'baseline') return Number(row.value);
      if (row.type === 'increase') return sum + Number(row.value);
      if (row.type === 'decrease') return sum + Number(row.value);
      return sum;
    }, 0);

    return {
      id: (data.length + 1).toString(),
      category: 'Total Final',
      value: totalValue,
      type: 'total',
      color: '#1f2937',
      isSubtotal: false
    };
  }

  /**
   * Aplica correções automáticas nos dados
   */
  static applyAutoFixes(data: any, suggestions: ValidationSuggestion[]): any {
    let correctedData = JSON.parse(JSON.stringify(data)); // Deep clone

    suggestions
      .filter(s => s.autoFixable && s.fixFunction)
      .forEach(suggestion => {
        try {
          correctedData = suggestion.fixFunction!();
        } catch (error) {
          console.warn('Erro ao aplicar correção automática:', error);
        }
      });

    return correctedData;
  }
}