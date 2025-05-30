import type { ChartType } from '../types';

export interface DataTemplate {
  name: string;
  description: string;
  format: 'csv' | 'json';
  requiredColumns: string[];
  optionalColumns: string[];
  example: any;
  validation: {
    rules: string[];
    tips: string[];
  };
}

export class DataTemplateManager {
  private static templates: Record<ChartType, DataTemplate[]> = {
    waterfall: [
      {
        name: 'Waterfall Básico',
        description: 'Template padrão para gráficos waterfall com valores positivos e negativos',
        format: 'csv',
        requiredColumns: ['category', 'value'],
        optionalColumns: ['type', 'description'],
        example: {
          csv: `category,value,type,description
Receita Inicial,100000,start,Valor inicial do período
Vendas Online,25000,positive,Aumento por vendas digitais
Vendas Físicas,15000,positive,Aumento por lojas físicas
Custos Operacionais,-18000,negative,Redução por custos fixos
Marketing,-8000,negative,Investimento em publicidade
Receita Final,114000,end,Valor final do período`,
          data: [
            { category: 'Receita Inicial', value: 100000, type: 'start', description: 'Valor inicial do período' },
            { category: 'Vendas Online', value: 25000, type: 'positive', description: 'Aumento por vendas digitais' },
            { category: 'Vendas Físicas', value: 15000, type: 'positive', description: 'Aumento por lojas físicas' },
            { category: 'Custos Operacionais', value: -18000, type: 'negative', description: 'Redução por custos fixos' },
            { category: 'Marketing', value: -8000, type: 'negative', description: 'Investimento em publicidade' },
            { category: 'Receita Final', value: 114000, type: 'end', description: 'Valor final do período' }
          ]
        },
        validation: {
          rules: [
            'A coluna "category" deve conter nomes únicos',
            'A coluna "value" deve conter apenas números',
            'A coluna "type" deve conter: start, positive, negative, ou end',
            'Deve haver pelo menos um item "start" e um "end"'
          ],
          tips: [
            'Use valores positivos para aumentos e negativos para diminuições',
            'O tipo "start" marca o valor inicial, "end" o valor final',
            'A descrição é opcional mas ajuda na compreensão'
          ]
        }
      },
      {
        name: 'Waterfall com Segmentos',
        description: 'Template para waterfall com barras empilhadas por segmento',
        format: 'csv',
        requiredColumns: ['category', 'segment', 'value'],
        optionalColumns: ['type', 'description'],
        example: {
          csv: `category,segment,value,type,description
Q1,Produto A,50000,start,Receita inicial Produto A
Q1,Produto B,30000,start,Receita inicial Produto B
Q2,Produto A,15000,positive,Crescimento Produto A
Q2,Produto B,10000,positive,Crescimento Produto B
Q2,Produto C,8000,positive,Novo produto lançado
Q3,Produto A,-5000,negative,Queda Produto A
Q3,Produto B,5000,positive,Crescimento Produto B
Q3,Produto C,12000,positive,Crescimento Produto C
Q4,Produto A,10000,end,Receita final Produto A
Q4,Produto B,45000,end,Receita final Produto B
Q4,Produto C,20000,end,Receita final Produto C`,
          data: [
            { category: 'Q1', segment: 'Produto A', value: 50000, type: 'start' },
            { category: 'Q1', segment: 'Produto B', value: 30000, type: 'start' }
          ]
        },
        validation: {
          rules: [
            'Cada combinação category + segment deve ser única',
            'Todos os segmentos devem aparecer em todas as categorias relevantes',
            'Valores devem ser numéricos'
          ],
          tips: [
            'Mantenha nomes de segmentos consistentes',
            'Use categorias temporais (Q1, Q2, etc.) para progressão'
          ]
        }
      }
    ],

    'stacked-bar': [
      {
        name: 'Barras Empilhadas Básicas',
        description: 'Template padrão para gráficos de barras empilhadas',
        format: 'csv',
        requiredColumns: ['category', 'segment', 'value'],
        optionalColumns: ['description', 'color'],
        example: {
          csv: `category,segment,value,description
Janeiro,Vendas Online,25000,Vendas através do e-commerce
Janeiro,Vendas Físicas,18000,Vendas em lojas físicas
Janeiro,Vendas B2B,12000,Vendas para empresas
Fevereiro,Vendas Online,28000,Vendas através do e-commerce
Fevereiro,Vendas Físicas,16000,Vendas em lojas físicas
Fevereiro,Vendas B2B,14000,Vendas para empresas
Março,Vendas Online,32000,Vendas através do e-commerce
Março,Vendas Físicas,20000,Vendas em lojas físicas
Março,Vendas B2B,16000,Vendas para empresas`,
          data: [
            { category: 'Janeiro', segment: 'Vendas Online', value: 25000 },
            { category: 'Janeiro', segment: 'Vendas Físicas', value: 18000 },
            { category: 'Janeiro', segment: 'Vendas B2B', value: 12000 }
          ]
        },
        validation: {
          rules: [
            'Cada combinação category + segment deve ser única',
            'Valores devem ser não-negativos',
            'Todos os segmentos devem aparecer em todas as categorias'
          ],
          tips: [
            'Use nomes descritivos para categorias e segmentos',
            'Mantenha segmentos consistentes entre categorias',
            'Valores representam partes do total'
          ]
        }
      }
    ],

    line: [
      {
        name: 'Linha Temporal Simples',
        description: 'Template para gráficos de linha com série temporal',
        format: 'csv',
        requiredColumns: ['date', 'value'],
        optionalColumns: ['series', 'description'],
        example: {
          csv: `date,value,description
2024-01,15000,Vendas de Janeiro
2024-02,18000,Vendas de Fevereiro
2024-03,22000,Vendas de Março
2024-04,19000,Vendas de Abril
2024-05,25000,Vendas de Maio
2024-06,28000,Vendas de Junho`,
          data: [
            { date: '2024-01', value: 15000, description: 'Vendas de Janeiro' },
            { date: '2024-02', value: 18000, description: 'Vendas de Fevereiro' }
          ]
        },
        validation: {
          rules: [
            'A coluna "date" deve conter datas válidas',
            'Valores devem ser numéricos',
            'Datas devem estar em ordem cronológica'
          ],
          tips: [
            'Use formato YYYY-MM-DD para datas',
            'Mantenha intervalos regulares entre datas',
            'Evite lacunas grandes nos dados'
          ]
        }
      },
      {
        name: 'Múltiplas Linhas',
        description: 'Template para múltiplas séries no mesmo gráfico',
        format: 'csv',
        requiredColumns: ['date', 'series', 'value'],
        optionalColumns: ['description'],
        example: {
          csv: `date,series,value,description
2024-01,Vendas,15000,Receita de vendas
2024-01,Custos,8000,Custos operacionais
2024-01,Lucro,7000,Lucro líquido
2024-02,Vendas,18000,Receita de vendas
2024-02,Custos,9000,Custos operacionais
2024-02,Lucro,9000,Lucro líquido`,
          data: [
            { date: '2024-01', series: 'Vendas', value: 15000 },
            { date: '2024-01', series: 'Custos', value: 8000 }
          ]
        },
        validation: {
          rules: [
            'Cada combinação date + series deve ser única',
            'Todas as séries devem ter dados para as mesmas datas',
            'Valores devem ser numéricos'
          ],
          tips: [
            'Use nomes consistentes para séries',
            'Mantenha escalas similares para comparação',
            'Considere usar cores diferentes para cada série'
          ]
        }
      }
    ],

    area: [
      {
        name: 'Área Empilhada',
        description: 'Template para gráficos de área empilhada',
        format: 'csv',
        requiredColumns: ['date', 'category', 'value'],
        optionalColumns: ['description'],
        example: {
          csv: `date,category,value,description
2024-01,Desktop,45,Usuários desktop
2024-01,Mobile,30,Usuários mobile
2024-01,Tablet,25,Usuários tablet
2024-02,Desktop,40,Usuários desktop
2024-02,Mobile,35,Usuários mobile
2024-02,Tablet,25,Usuários tablet
2024-03,Desktop,35,Usuários desktop
2024-03,Mobile,42,Usuários mobile
2024-03,Tablet,23,Usuários tablet`,
          data: [
            { date: '2024-01', category: 'Desktop', value: 45 },
            { date: '2024-01', category: 'Mobile', value: 30 }
          ]
        },
        validation: {
          rules: [
            'Valores devem representar percentuais (0-100) ou partes do total',
            'Cada data deve ter dados para todas as categorias',
            'Valores devem ser não-negativos'
          ],
          tips: [
            'Para percentuais, a soma deve ser 100 para cada data',
            'Use categorias mutuamente exclusivas',
            'Mantenha consistência nas categorias'
          ]
        }
      }
    ],

    sankey: [
      {
        name: 'Fluxo Sankey Básico',
        description: 'Template para diagramas Sankey mostrando fluxos entre nós',
        format: 'json',
        requiredColumns: ['source', 'target', 'value'],
        optionalColumns: ['description'],
        example: {
          json: `{
  "nodes": [
    {"id": "receita", "name": "Receita Total"},
    {"id": "vendas", "name": "Vendas"},
    {"id": "servicos", "name": "Serviços"},
    {"id": "online", "name": "Online"},
    {"id": "fisica", "name": "Loja Física"},
    {"id": "consultoria", "name": "Consultoria"},
    {"id": "suporte", "name": "Suporte"}
  ],
  "links": [
    {"source": "receita", "target": "vendas", "value": 80},
    {"source": "receita", "target": "servicos", "value": 20},
    {"source": "vendas", "target": "online", "value": 50},
    {"source": "vendas", "target": "fisica", "value": 30},
    {"source": "servicos", "target": "consultoria", "value": 12},
    {"source": "servicos", "target": "suporte", "value": 8}
  ]
}`,
          data: {
            nodes: [
              { id: 'receita', name: 'Receita Total' },
              { id: 'vendas', name: 'Vendas' }
            ],
            links: [
              { source: 'receita', target: 'vendas', value: 80 }
            ]
          }
        },
        validation: {
          rules: [
            'Todos os IDs de nodes devem ser únicos',
            'Sources e targets nos links devem referenciar IDs existentes',
            'Valores devem ser positivos',
            'A soma dos valores de saída deve igualar entrada para cada nó'
          ],
          tips: [
            'Use IDs descritivos mas sem espaços',
            'Mantenha nomes dos nós concisos',
            'Verifique se os fluxos fazem sentido logicamente',
            'Considere usar cores para categorizar nós'
          ]
        }
      }
    ]
  };

  static getTemplates(chartType: ChartType): DataTemplate[] {
    return this.templates[chartType] || [];
  }

  static downloadTemplate(chartType: ChartType, templateIndex: number = 0): void {
    const templates = this.getTemplates(chartType);
    if (!templates[templateIndex]) return;

    const template = templates[templateIndex];
    
    if (template.format === 'csv') {
      const csvData = template.example.csv;
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `template-${chartType}-${template.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (template.format === 'json') {
      const jsonData = template.example.json;
      const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `template-${chartType}-${template.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  static validateData(chartType: ChartType, data: any[], templateIndex: number = 0): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const templates = this.getTemplates(chartType);
    const template = templates[templateIndex];
    
    if (!template) {
      return { isValid: false, errors: ['Template não encontrado'], warnings: [] };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Verificar se há dados
    if (!data || data.length === 0) {
      errors.push('Nenhum dado fornecido');
      return { isValid: false, errors, warnings };
    }

    // Verificar colunas obrigatórias
    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    
    for (const requiredCol of template.requiredColumns) {
      if (!columns.includes(requiredCol)) {
        errors.push(`Coluna obrigatória "${requiredCol}" não encontrada`);
      }
    }

    // Validações específicas por tipo de gráfico
    switch (chartType) {
      case 'waterfall':
        // Validar tipos de waterfall
        const types = data.map(d => d.type).filter(Boolean);
        const hasStart = types.includes('start');
        const hasEnd = types.includes('end');
        
        if (!hasStart) warnings.push('Recomendado ter pelo menos um item tipo "start"');
        if (!hasEnd) warnings.push('Recomendado ter pelo menos um item tipo "end"');
        
        // Verificar valores numéricos
        data.forEach((row, index) => {
          if (typeof row.value !== 'number' && isNaN(Number(row.value))) {
            errors.push(`Valor na linha ${index + 1} não é numérico`);
          }
        });
        break;

      case 'stacked-bar':
        // Verificar se todos os segmentos aparecem em todas as categorias
        const categories = [...new Set(data.map(d => d.category))];
        const segments = [...new Set(data.map(d => d.segment))];
        
        categories.forEach(category => {
          const categorySegments = data.filter(d => d.category === category).map(d => d.segment);
          segments.forEach(segment => {
            if (!categorySegments.includes(segment)) {
              warnings.push(`Segmento "${segment}" ausente na categoria "${category}"`);
            }
          });
        });
        break;

      case 'line':
        // Verificar ordem cronológica se for temporal
        if (template.requiredColumns.includes('date')) {
          const dates = data.map(d => new Date(d.date)).filter(d => !isNaN(d.getTime()));
          if (dates.length !== data.length) {
            errors.push('Algumas datas são inválidas');
          } else {
            for (let i = 1; i < dates.length; i++) {
              if (dates[i] < dates[i-1]) {
                warnings.push('Datas não estão em ordem cronológica');
                break;
              }
            }
          }
        }
        break;

      case 'sankey':
        // Para Sankey, validar estrutura JSON
        if (typeof data === 'object' && data.nodes && data.links) {
          const nodeIds = data.nodes.map((n: any) => n.id);
          data.links.forEach((link: any, index: number) => {
            if (!nodeIds.includes(link.source)) {
              errors.push(`Link ${index + 1}: source "${link.source}" não encontrado nos nós`);
            }
            if (!nodeIds.includes(link.target)) {
              errors.push(`Link ${index + 1}: target "${link.target}" não encontrado nos nós`);
            }
          });
        } else {
          errors.push('Dados Sankey devem ter estrutura {nodes: [], links: []}');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}