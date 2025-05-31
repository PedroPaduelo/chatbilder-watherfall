import type { DataRow } from '../../../types';

/**
 * Formata valores para exibição no gráfico
 */
export const formatWaterfallValue = (
  value: number, 
  prefix: string = '', 
  suffix: string = ''
): string => {
  return `${prefix}${value.toLocaleString('pt-BR')}${suffix}`;
};

/**
 * Calcula a cor baseada no tipo de barra
 */
export const getWaterfallBarColor = (
  type: string, 
  colors: Record<string, string>
): string => {
  return colors[type] || '#3B82F6';
};

/**
 * Verifica se uma barra é do tipo subtotal
 */
export const isSubtotalBar = (item: DataRow): boolean => {
  return item.type === 'subtotal' || item.isSubtotal === true;
};

/**
 * Verifica se uma barra é do tipo total
 */
export const isTotalBar = (item: DataRow): boolean => {
  return item.type === 'total';
};

/**
 * Verifica se uma barra é do tipo baseline
 */
export const isBaselineBar = (item: DataRow): boolean => {
  return item.type === 'baseline';
};

/**
 * Calcula se deve mostrar conectores entre barras
 */
export const shouldShowConnector = (
  current: any, 
  next: any, 
  settings: any
): boolean => {
  if (!settings.showConnectors) return false;
  if (!current || !next) return false;
  if (current.type === 'total' || next.type === 'baseline') return false;
  return true;
};

/**
 * Gera dados de amostra para o Waterfall
 */
export const generateSampleWaterfallData = (): DataRow[] => {
  return [
    {
      id: '1',
      category: 'Receita Inicial',
      value: 100000,
      type: 'baseline',
      color: '#3b82f6',
      isSubtotal: false
    },
    {
      id: '2',
      category: 'Vendas Online',
      value: 25000,
      type: 'increase',
      color: '#10b981',
      isSubtotal: false
    },
    {
      id: '3',
      category: 'Vendas Físicas',
      value: 15000,
      type: 'increase',
      color: '#10b981',
      isSubtotal: false
    },
    {
      id: '4',
      category: 'Subtotal Vendas',
      value: 140000,
      type: 'subtotal',
      color: '#8b5cf6',
      isSubtotal: true
    },
    {
      id: '5',
      category: 'Custos Operacionais',
      value: -20000,
      type: 'decrease',
      color: '#ef4444',
      isSubtotal: false
    },
    {
      id: '6',
      category: 'Marketing',
      value: -8000,
      type: 'decrease',
      color: '#ef4444',
      isSubtotal: false
    },
    {
      id: '7',
      category: 'Total Final',
      value: 112000,
      type: 'total',
      color: '#1f2937',
      isSubtotal: false
    }
  ];
};

/**
 * Valida dados do Waterfall
 */
export const validateWaterfallData = (data: DataRow[]): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!Array.isArray(data)) {
    errors.push('Dados devem ser um array');
    return { valid: false, errors };
  }
  
  if (data.length === 0) {
    errors.push('Pelo menos um item de dados é necessário');
    return { valid: false, errors };
  }
  
  // Campos obrigatórios
  const requiredFields: Array<keyof DataRow> = ['id', 'category', 'value', 'type'];
  
  data.forEach((item, index) => {
    requiredFields.forEach(field => {
      const value = item[field];
      if (value === undefined || value === null || value === '') {
        errors.push(`Item ${index + 1}: Campo '${field}' é obrigatório`);
      }
    });
    
    // Validar tipo
    const validTypes = ['baseline', 'increase', 'decrease', 'subtotal', 'total'];
    if (!validTypes.includes(item.type)) {
      errors.push(`Item ${index + 1}: Tipo '${item.type}' não é válido. Use: ${validTypes.join(', ')}`);
    }
    
    // Validar valor numérico
    if (typeof item.value !== 'number' || isNaN(item.value)) {
      errors.push(`Item ${index + 1}: Valor deve ser um número válido`);
    }
  });
  
  // Verificar se tem baseline
  const hasBaseline = data.some(item => item.type === 'baseline');
  if (!hasBaseline) {
    errors.push('Recomendado: Inclua pelo menos um item do tipo "baseline" como ponto de partida');
  }
  
  // Verificar se tem total
  const hasTotal = data.some(item => item.type === 'total');
  if (!hasTotal) {
    errors.push('Recomendado: Inclua um item do tipo "total" para mostrar o resultado final');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};