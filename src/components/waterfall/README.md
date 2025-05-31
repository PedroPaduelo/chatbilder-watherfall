# Waterfall Chart Component

Uma implementação modular e extensível de gráfico Waterfall usando React, TypeScript e Recharts.

## Estrutura Organizacional

```
waterfall/
├── index.ts                    # Exportações principais
├── WaterfallChart.tsx         # Componente principal
├── core/                      # Componentes fundamentais
│   ├── RechartsWaterfall.tsx  # Implementação Recharts
│   ├── WaterfallBar.tsx       # Componente de barra customizada
│   ├── WaterfallTooltip.tsx   # Tooltip customizado
│   ├── WaterfallLabel.tsx     # Labels customizados
│   └── WaterfallConnectors.tsx # Linhas conectoras
├── config/                    # Configurações específicas
│   └── WaterfallConfig.tsx    # Painel de configuração
├── import/                    # Componentes de importação
│   └── WaterfallImport.tsx    # Importação de dados
├── hooks/                     # Hooks customizados
│   └── useWaterfallData.ts    # Hook de processamento de dados
├── types/                     # Tipos TypeScript
│   └── index.ts               # Interfaces e tipos
└── utils/                     # Utilitários
    └── index.ts               # Funções auxiliares
```

## Componentes Principais

### WaterfallChart
Componente de alto nível que coordena todos os sub-componentes.

```tsx
import { WaterfallChart } from './waterfall';

<WaterfallChart
  data={data}
  settings={settings}
  onBarSelect={handleBarSelect}
  onDataChange={handleDataChange}
/>
```

### RechartsWaterfall
Implementação específica usando a biblioteca Recharts.

### WaterfallConfig
Painel de configuração específico para gráficos Waterfall com seções expansíveis.

### WaterfallImport
Componente especializado para importação de dados com validação específica.

## Hooks Customizados

### useWaterfallData
Hook que processa dados brutos em formato adequado para visualização Waterfall.

```tsx
const { waterfallData, segmentKeys, totalValue, hasBaseline, hasTotal } = useWaterfallData(data);
```

## Utilitários

### Formatação
- `formatWaterfallValue()` - Formata valores monetários
- `getWaterfallBarColor()` - Determina cores baseadas no tipo

### Validação
- `validateWaterfallData()` - Valida estrutura de dados
- `isSubtotalBar()`, `isTotalBar()`, `isBaselineBar()` - Verificações de tipo

### Geração de Dados
- `generateSampleWaterfallData()` - Gera dados de exemplo
- `shouldShowConnector()` - Lógica para conectores

## Tipos de Dados Suportados

### Estrutura Base
```typescript
interface DataRow {
  id: string;
  category: string;
  value: number;
  type: 'baseline' | 'increase' | 'decrease' | 'subtotal' | 'total';
  color?: string;
  isSubtotal?: boolean;
}
```

### Tipos de Barras
- **baseline**: Valor inicial/ponto de partida
- **increase**: Valores positivos que aumentam o total
- **decrease**: Valores negativos que diminuem o total
- **subtotal**: Totais intermediários
- **total**: Valor final/resultado

## Configurações Específicas

### Aparência
- Largura e espaçamento das barras
- Prefixo e sufixo de valores
- Cores por tipo de barra

### Exibição
- Conectores entre barras
- Labels de valores
- Grid e eixos
- Rotação de categorias

### Cores
- Paleta pré-definida por tipo
- Presets temáticos (Moderno, Oceano, Quente, Profissional)
- Cores customizáveis individualmente

## Validação de Dados

O componente inclui validação robusta que verifica:

- Campos obrigatórios (id, category, value, type)
- Tipos válidos de barras
- Valores numéricos
- Estrutura de segmentos (se aplicável)

### Avisos e Recomendações
- Presença de baseline para ponto de partida
- Presença de total para resultado final
- Consistência de dados

## Exemplos de Uso

### Básico
```tsx
const data = [
  { id: '1', category: 'Inicial', value: 100000, type: 'baseline' },
  { id: '2', category: 'Vendas', value: 25000, type: 'increase' },
  { id: '3', category: 'Custos', value: -15000, type: 'decrease' },
  { id: '4', category: 'Final', value: 110000, type: 'total' }
];

<WaterfallChart data={data} settings={settings} />
```

### Com Configuração Customizada
```tsx
<WaterfallConfig
  settings={settings}
  onSettingsChange={handleSettingsChange}
/>
```

### Com Importação de Dados
```tsx
<WaterfallImport
  onDataImported={handleDataImported}
/>
```

## Benefícios da Arquitetura Modular

1. **Manutenibilidade**: Cada componente tem responsabilidade específica
2. **Testabilidade**: Componentes podem ser testados isoladamente
3. **Reutilização**: Componentes podem ser usados em diferentes contextos
4. **Extensibilidade**: Fácil adicionar novos recursos sem afetar existentes
5. **Separação de Responsabilidades**: Core, configuração e importação separados
6. **Type Safety**: Tipos específicos garantem consistência