# Universal Chart Builder

Uma plataforma React moderna e avançada para criação de visualizações de dados interativas com múltiplos tipos de gráficos e análises profissionais.

## 🌟 Visão Geral

O Universal Chart Builder é uma aplicação completa que permite criar, personalizar e analisar diversos tipos de gráficos de forma intuitiva. Com suporte a múltiplos formatos de dados e exportação profissional, é a ferramenta ideal para análise de dados e apresentações executivas.

## 🚀 Tipos de Gráficos Suportados

### 📊 **Waterfall Chart**
- Visualização de efeitos cumulativos sequenciais
- Suporte completo a barras empilhadas (baseline e total)
- Conectores inteligentes entre barras
- Tooltips detalhados com informações de segmentos

### 🌊 **Sankey Diagram**
- Diagramas de fluxo com navegação interativa
- Zoom e pan para exploração detalhada
- Algoritmo otimizado de posicionamento de nós
- Detecção e tratamento de ciclos

### 📈 **Stacked Bar Chart**
- Barras empilhadas com segmentos coloridos
- Comparação visual entre categorias
- Tooltips com breakdown detalhado
- Suporte a legendas automáticas

### 📉 **Line Chart**
- Gráficos de linha para tendências temporais
- Pontos interativos com hover effects
- Suporte a múltiplas séries de dados
- Grade configurável

### 🏔️ **Area Chart**
- Gráficos de área preenchida
- Gradientes personalizáveis
- Visualização de volume ao longo do tempo
- Ideal para dados acumulativos

## 🎯 Funcionalidades Avançadas

### 📊 **Dashboard de Métricas**
- Análise estatística automática dos dados
- Métricas calculadas: total, média, mediana
- Identificação de maiores aumentos/diminuições
- Contadores de valores positivos/negativos
- Visualização em cards informativos

### 🎨 **Sistema de Temas**
- Modo claro e escuro
- Transições suaves entre temas
- Cores consistentes em toda aplicação
- Personalização de paletas

### 💾 **Gerenciamento de Views Salvas**
- Salvar configurações completas de gráficos
- Thumbnails automáticos para identificação
- Histórico de criação e modificação
- Importação/exportação de views

### 📝 **Sistema de Anotações**
- Adicionar notas e comentários aos gráficos
- Posicionamento flexível de anotações
- Formatação de texto personalizada
- Persistência entre sessões

### 🔄 **Importação/Exportação Avançada**
- **Formatos de Importação**: CSV, Excel (XLSX/XLS), JSON
- **Formatos de Exportação**: PNG (alta qualidade), SVG, JSON, HTML standalone
- Validação robusta de dados
- Mapeamento automático de colunas
- Preview antes da importação

### ⚙️ **Configurações Granulares**
- Dimensões personalizáveis (largura, altura, responsivo)
- Configuração de margens e espaçamentos
- Fontes e cores customizáveis
- Rotação de labels
- Controle de visibilidade de elementos

### 🎛️ **Editor de Dados Interativo**
- Interface drag-and-drop para reordenação
- Edição inline de valores
- Adição/remoção de categorias
- Editor de segmentos empilhados
- Validação em tempo real

### 🔍 **Sistema de Filtros**
- Filtros por tipo de dados
- Filtros por valor (range)
- Filtros por categoria
- Filtros personalizados
- Combinação de múltiplos filtros

## 📊 Chart Import and Configuration Components

### Import Components
Each chart type has an associated import component that allows users to download sample data templates:

- **WaterfallChartImport**: Download sample data for Waterfall Chart in CSV and JSON formats.
- **StackedBarChartImport**: Download sample data for Stacked Bar Chart in CSV and JSON formats.
- **LineChartImport**: Download sample data for Line Chart in CSV and JSON formats.
- **AreaChartImport**: Download sample data for Area Chart in CSV and JSON formats.
- **SankeyChartImport**: Download sample data for Sankey Chart in JSON format.

### Configuration Components
Each chart type also has a configuration component for customizing chart-specific settings:

- **WaterfallChartConfig**: Customize bar width, spacing, and accent color.
- **StackedBarChartConfig**: Customize bar width, spacing, and accent color.
- **LineChartConfig**: Customize line width and accent color.
- **AreaChartConfig**: Customize area opacity and accent color.
- **SankeyChartConfig**: Customize node width, spacing, and accent color.

### Usage
To use these components, import them into your desired file and include them in your JSX:

```tsx
import WaterfallChartImport from './components/WaterfallChartImport';
import WaterfallChartConfig from './components/WaterfallChartConfig';

const App = () => (
  <div>
    <WaterfallChartImport />
    <WaterfallChartConfig settings={settings} onSettingsChange={handleSettingsChange} />
  </div>
);
```

Replace `settings` and `handleSettingsChange` with your application's state and handler functions.

## 🛠 Tecnologias e Arquitetura

### **Frontend Stack**
- **React 18** - Interface moderna e performática
- **TypeScript** - Tipagem estática e robustez
- **Vite** - Build tool rápido e eficiente
- **Tailwind CSS** - Design system responsivo
- **Recharts** - Biblioteca de gráficos profissional

### **Bibliotecas Especializadas**
- **Lucide React** - Ícones consistentes e modernos
- **PapaParse** - Parser CSV robusto
- **XLSX** - Manipulação de arquivos Excel
- **html2canvas** - Captura de screenshots

### **Arquitetura Modular**
```
src/
├── components/          # Componentes React especializados
│   ├── charts/          # Componentes de gráficos
│   │   ├── WaterfallChart.tsx
│   │   ├── SankeyChart.tsx
│   │   ├── StackedBarChart.tsx
│   │   ├── LineChart.tsx
│   │   └── AreaChart.tsx
│   ├── ui/             # Componentes de interface
│   │   ├── DataEditor.tsx
│   │   ├── SettingsPanel.tsx
│   │   ├── MetricsDashboard.tsx
│   │   └── ThemeSelector.tsx
│   └── modular/        # Componentes modulares
│       ├── ChartBars.tsx
│       ├── ChartGrid.tsx
│       ├── ChartTooltips.tsx
│       └── Notification.tsx
├── hooks/              # Hooks customizados
│   ├── useProcessedData.ts    # Processamento de dados
│   ├── useChartMetrics.ts     # Cálculos estatísticos
│   ├── useFileOperations.ts   # Operações de arquivo
│   ├── useSavedViews.ts       # Gerenciamento de views
│   └── useTheme.ts            # Controle de tema
├── services/           # Serviços especializados
│   ├── exportService.ts       # Exportação de dados
│   └── fileService.ts         # Manipulação de arquivos
├── types/              # Definições TypeScript
│   └── index.ts               # Interfaces centralizadas
└── utils/              # Utilitários
    ├── constants.ts           # Constantes do sistema
    ├── helpers.ts             # Funções auxiliares
    └── sampleData.ts          # Dados de exemplo
```

## 🚦 Instalação e Uso

### **Pré-requisitos**
- Node.js 18+ 
- npm, yarn ou pnpm

### **Instalação**
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd universal-chart-builder

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Acesse: http://localhost:5173
```

### **Scripts Disponíveis**
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
npm run lint     # Linting do código
```

## 📊 Guia de Uso Completo

### **1. Seleção de Tipo de Gráfico**
- Escolha entre 5 tipos de visualização
- Carregue dados de exemplo para cada tipo
- Visualize descrições detalhadas de cada gráfico

### **2. Importação de Dados**
- **CSV**: Headers automáticos, delimitadores customizáveis
- **Excel**: Múltiplas planilhas, tipos de célula
- **JSON**: Estrutura flexível, validação de schema

### **3. Edição de Dados**
- Editor tabular com validação inline
- Drag-and-drop para reordenação
- Adição de segmentos empilhados
- Configuração de cores por categoria

### **4. Personalização Avançada**
- **Dimensões**: Largura, altura, responsividade
- **Estilo**: Cores, fontes, espaçamentos
- **Comportamento**: Tooltips, animações, interações
- **Exportação**: Qualidade, formatos, templates

### **5. Análise e Métricas**
- Dashboard automático de estatísticas
- Identificação de padrões nos dados
- Comparações e tendências
- Métricas de performance dos gráficos

### **6. Gestão de Projetos**
- Salvar configurações como "Views"
- Organizar por data e tipo
- Compartilhar configurações via JSON
- Histórico de modificações

## 📈 Exemplos de Uso

### **Dados Financeiros**
```json
{
  "data": [
    {
      "id": "1",
      "category": "Receita Q1",
      "value": 100000,
      "type": "baseline",
      "segments": [
        {"categoria": "Produto A", "valor": 60000, "cor": "#3B82F6"},
        {"categoria": "Produto B", "valor": 40000, "cor": "#10B981"}
      ]
    },
    {
      "id": "2",
      "category": "Crescimento",
      "value": 25000,
      "type": "increase"
    }
  ]
}
```

### **Fluxo de Processos (Sankey)**
```json
{
  "nodes": [
    {"id": "inicio", "name": "Leads", "color": "#3B82F6"},
    {"id": "qualificacao", "name": "Qualificados", "color": "#10B981"},
    {"id": "conversao", "name": "Vendas", "color": "#059669"}
  ],
  "links": [
    {"source": "inicio", "target": "qualificacao", "value": 1000},
    {"source": "qualificacao", "target": "conversao", "value": 300}
  ]
}
```

## 🎨 Personalização e Extensibilidade

### **Temas Customizados**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'custom-primary': '#your-color',
        'custom-secondary': '#your-color'
      }
    }
  }
}
```

### **Novos Tipos de Gráfico**
1. Adicione interface em `src/types/index.ts`
2. Crie componente em `src/components/charts/`
3. Registre em `ChartTypeSelector.tsx`
4. Adicione dados de exemplo em `sampleData.ts`

### **Integração com APIs**
```typescript
// Exemplo de hook personalizado
const useApiData = (endpoint: string) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch(endpoint)
      .then(res => res.json())
      .then(setData);
  }, [endpoint]);
  
  return data;
};
```

## 📋 Roadmap e Próximas Funcionalidades

### **🔄 Em Desenvolvimento**
- [ ] **Animações Avançadas**: Transições suaves entre estados
- [ ] **Gráficos 3D**: Visualizações tridimensionais
- [ ] **Colaboração em Tempo Real**: Edição simultânea
- [ ] **Templates Profissionais**: Layouts pré-configurados

### **🎯 Planejado**
- [ ] **API REST**: Integração com sistemas externos
- [ ] **Plugin System**: Extensões de terceiros
- [ ] **Dashboard Builder**: Criação de dashboards completos
- [ ] **Exportação PDF**: Relatórios profissionais
- [ ] **Integração com BI**: Power BI, Tableau, etc.

### **💡 Ideias Futuras**
- [ ] **Machine Learning**: Sugestões automáticas de visualização
- [ ] **Versionamento**: Controle de versões de gráficos
- [ ] **Comentários**: Sistema de feedback colaborativo
- [ ] **Mobile App**: Aplicativo nativo para visualização

## 🏗️ Arquitetura e Performance

### **Otimizações Implementadas**
- **Lazy Loading**: Componentes carregados sob demanda
- **Memoização**: Cálculos complexos otimizados
- **Virtual Scrolling**: Listas grandes performáticas
- **Debouncing**: Redução de re-renders desnecessários

### **Métricas de Performance**
- **Linhas de Código**: 15.000+ linhas TypeScript
- **Componentes**: 25+ componentes modulares
- **Hooks Customizados**: 10+ hooks especializados
- **Cobertura de Testes**: Planejado para 80%+

### **Padrões de Design**
- **Separation of Concerns**: Responsabilidades bem definidas
- **Composition over Inheritance**: Composição de componentes
- **Single Responsibility**: Cada arquivo uma responsabilidade
- **DRY Principle**: Reutilização máxima de código

## 🤝 Contribuindo

### **Como Contribuir**
1. **Fork** o projeto
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
4. **Desenvolva** seguindo os padrões do projeto
5. **Teste** todas as funcionalidades
6. **Commit** suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
7. **Push** para sua branch (`git push origin feature/MinhaFeature`)
8. **Abra** um Pull Request detalhado

### **Guidelines de Desenvolvimento**
- Use **TypeScript** para tipagem estática
- Siga os padrões **ESLint** configurados
- Escreva **testes unitários** para novas features
- Documente **APIs públicas** com JSDoc
- Mantenha **commits semânticos**

### **Issues e Bugs**
- Use os **templates** de issue fornecidos
- Inclua **passos para reprodução**
- Adicione **screenshots** quando relevante
- Especifique **ambiente** (OS, Browser, Node.js)

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- **Recharts**: Pela excelente biblioteca de gráficos
- **Tailwind CSS**: Pelo sistema de design flexível
- **React Team**: Pela base sólida do framework
- **Comunidade Open Source**: Por inspiração e feedback contínuo

---

<div align="center">
  <p>
    <strong>Universal Chart Builder</strong><br>
    Transformando dados em insights visuais poderosos
  </p>
  
  <p>
    <a href="#funcionalidades-avançadas">🎯 Features</a> •
    <a href="#instalação-e-uso">🚦 Instalação</a> •
    <a href="#guia-de-uso-completo">📊 Uso</a> •
    <a href="#contribuindo">🤝 Contribuir</a>
  </p>
</div>