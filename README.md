# Waterfall Chart Builder

Um aplicativo React moderno para criar gráficos waterfall interativos com suporte a barras empilhadas.

## 🚀 Funcionalidades

- **Gráficos Waterfall Interativos**: Visualize dados de forma clara com barras conectadas
- **Barras Empilhadas**: Suporte completo para segmentos empilhados em barras baseline e total
- **Editor de Dados**: Interface intuitiva para editar dados diretamente na aplicação
- **Importação/Exportação**: Suporte para CSV, Excel, JSON e HTML
- **Customização**: Painel de configurações para personalizar aparência e comportamento
- **Responsivo**: Design adaptativo com Tailwind CSS

## 🛠 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **PapaParse** para parsing de CSV
- **XLSX** para manipulação de arquivos Excel

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React modulares
│   ├── WaterfallChart.tsx    # Componente principal do gráfico
│   ├── DataEditor.tsx        # Editor de dados
│   ├── SegmentEditor.tsx     # Editor de segmentos
│   └── SettingsPanel.tsx     # Painel de configurações
├── hooks/              # Hooks customizados
│   └── useProcessedData.ts   # Hook para processamento de dados
├── types/              # Definições TypeScript
│   └── index.ts              # Interfaces e tipos
├── utils/              # Utilitários
│   ├── constants.ts          # Constantes e dados iniciais
│   └── helpers.ts            # Funções auxiliares
├── App.tsx             # Componente principal
├── main.tsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🚦 Como Usar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd waterfall-chart-builder
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto:
```bash
npm run dev
```

4. Abra no navegador: `http://localhost:5173`

### Comandos Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build de produção
npm run lint     # Executa linting
```

## 📊 Como Usar o Gráfico

### Dados Básicos
1. Use o **Data Editor** para adicionar/editar categorias
2. Configure valores, tipos (baseline, increase, decrease, subtotal, total)
3. Personalize cores para cada barra

### Barras Empilhadas
1. Para barras **baseline** ou **total**, clique na seta ao lado da linha
2. Adicione segmentos com categorias, valores e cores individuais
3. O valor total será calculado automaticamente

### Configurações
- **Largura das Barras**: Ajuste o tamanho das barras
- **Espaçamento**: Controle a distância entre barras
- **Conectores**: Mostrar/ocultar linhas conectoras
- **Labels**: Configurar exibição de valores e categorias
- **Cores**: Personalizar cores padrão por tipo

### Importação/Exportação
- **Importar**: Suporte para arquivos CSV e Excel
- **Exportar**: PNG, SVG, JSON ou HTML standalone

## 🎨 Personalização

O projeto foi estruturado de forma modular para facilitar customizações:

- **Tipos**: Adicione novos tipos de dados em `src/types/`
- **Componentes**: Crie novos componentes em `src/components/`
- **Estilos**: Modifique `tailwind.config.js` para temas personalizados
- **Configurações**: Ajuste `src/utils/constants.ts` para valores padrão

## 📈 Exemplos de Dados

### Formato CSV
```csv
category,value,type,color
Initial,0.6,baseline,#4B5563
Growth,0.1,increase,#10B981
Decline,-0.05,decrease,#EF4444
Final,0.65,total,#6366F1
```

### Formato JSON
```json
{
  "data": [
    {
      "id": "1",
      "category": "Initial",
      "value": 0.6,
      "type": "baseline",
      "segments": [
        {"categoria": "Base A", "valor": 0.35, "cor": "#4B5563"},
        {"categoria": "Base B", "valor": 0.25, "cor": "#6B7280"}
      ]
    }
  ]
}
```

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🔮 Próximas Funcionalidades

- [ ] Animações de transição
- [ ] Mais tipos de gráficos
- [ ] Temas predefinidos
- [ ] API para integração externa
- [ ] Modo escuro
- [ ] Exportação para PDF nativo