import { useMemo } from 'react';
import type { 
  SankeyData, 
  SankeySettings, 
  ProcessedSankeyNode, 
  ProcessedSankeyLink 
} from '../types';

export const useSankeyData = (
  data: SankeyData, 
  chartWidth: number, 
  chartHeight: number
) => {
  return useMemo(() => {
    if (!data.nodes.length || !data.links.length) {
      return { nodes: [], links: [] };
    }

    // Criar mapa de nós
    const nodeMap = new Map<string, ProcessedSankeyNode>();
    
    data.nodes.forEach((node, index) => {
      nodeMap.set(node.id, {
        ...node,
        x: 0,
        y: 0,
        width: 15,
        height: 0,
        value: 0,
        level: 0,
        sourceLinks: [],
        targetLinks: [],
        index,
      });
    });

    const nodes = Array.from(nodeMap.values());
    const links: ProcessedSankeyLink[] = [];

    // Processar links
    data.links.forEach(link => {
      const sourceNode = nodeMap.get(link.source);
      const targetNode = nodeMap.get(link.target);
      
      if (!sourceNode || !targetNode) return;

      const processedLink: ProcessedSankeyLink = {
        ...link,
        sourceNode,
        targetNode,
        sy0: 0,
        sy1: 0,
        ty0: 0,
        ty1: 0,
        width: 0,
        path: '',
      };

      sourceNode.sourceLinks.push(processedLink);
      targetNode.targetLinks.push(processedLink);
      links.push(processedLink);
    });

    // Calcular valores dos nós
    nodes.forEach(node => {
      const inValue = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
      const outValue = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
      node.value = Math.max(inValue, outValue) || 1;
    });

    // Calcular níveis (colunas) dos nós com detecção de ciclos
    const calculateLevels = () => {
      const levels = new Map<string, number>();
      const visiting = new Set<string>();
      const visited = new Set<string>();
      
      const visit = (nodeId: string): number => {
        if (visiting.has(nodeId)) {
          // Ciclo detectado - usar nível baseado na posição no array
          console.warn(`Cycle detected involving node: ${nodeId}`);
          const node = nodeMap.get(nodeId)!;
          return node.index % 3; // Distribuir em 3 níveis como fallback
        }
        
        if (visited.has(nodeId)) {
          return levels.get(nodeId) || 0;
        }
        
        visiting.add(nodeId);
        const node = nodeMap.get(nodeId)!;
        
        if (node.targetLinks.length === 0) {
          levels.set(nodeId, 0);
          visiting.delete(nodeId);
          visited.add(nodeId);
          return 0;
        }
        
        let maxLevel = -1;
        node.targetLinks.forEach(link => {
          const sourceLevel = visit(link.source);
          maxLevel = Math.max(maxLevel, sourceLevel);
        });
        
        const level = maxLevel + 1;
        levels.set(nodeId, level);
        visiting.delete(nodeId);
        visited.add(nodeId);
        return level;
      };

      nodes.forEach(node => visit(node.id));
      return levels;
    };

    const levels = calculateLevels();
    nodes.forEach(node => {
      node.level = levels.get(node.id) || 0;
    });

    // Agrupar nós por nível
    const nodesByLevel: ProcessedSankeyNode[][] = [];
    const maxLevel = Math.max(...nodes.map(n => n.level));
    
    for (let i = 0; i <= maxLevel; i++) {
      nodesByLevel[i] = nodes.filter(n => n.level === i);
    }

    // Calcular escala de altura
    const totalValue = Math.max(...nodes.map(n => n.value));
    const heightScale = chartHeight / (totalValue * 1.2);

    // Calcular alturas dos nós
    nodes.forEach(node => {
      node.height = Math.max(12, node.value * heightScale);
    });

    // Posicionar nós horizontalmente - espaçamento uniforme
    const levelWidth = chartWidth / (maxLevel + 1);
    nodesByLevel.forEach((levelNodes, level) => {
      const x = level * levelWidth;
      levelNodes.forEach(node => {
        node.x = x;
      });
    });

    return { nodes, links, nodesByLevel, maxLevel };
  }, [data, chartWidth, chartHeight]);
};

export const useSankeyLayout = (
  processedData: { 
    nodes: ProcessedSankeyNode[]; 
    links: ProcessedSankeyLink[]; 
    nodesByLevel: ProcessedSankeyNode[][]; 
    maxLevel: number; 
  },
  chartHeight: number,
  settings: SankeySettings
) => {
  return useMemo(() => {
    if (!processedData.nodes.length) return processedData;

    const { nodes, links, nodesByLevel } = processedData;

    // Algoritmo de posicionamento vertical com espaçamento
    const positionNodesVertically = () => {
      nodesByLevel.forEach(levelNodes => {
        // Ordenar nós por valor para garantir consistência
        levelNodes.sort((a, b) => b.value - a.value);
        
        // Calcular espaço total necessário
        const totalNodeHeight = levelNodes.reduce((sum, node) => sum + node.height, 0);
        
        // Usar configurações do settings
        const totalSpacingNeeded = chartHeight * settings.spacingRatio;
        const spacingPerNode = levelNodes.length > 1 ? totalSpacingNeeded / (levelNodes.length - 1) : 0;
        
        // Calcular altura ajustada para os nós
        const nodeHeightRatio = 1 - settings.spacingRatio;
        const nodeScale = nodeHeightRatio * chartHeight / totalNodeHeight;
        
        // Aplicar escala aos nós
        levelNodes.forEach(node => {
          node.height = Math.max(settings.nodeMinHeight, node.height * nodeScale);
        });
        
        // Distribuir nós com espaçamento
        let currentY = 0;
        levelNodes.forEach((node, i) => {
          node.y = currentY;
          currentY += node.height + (i < levelNodes.length - 1 ? spacingPerNode : 0);
        });
      });
    };
    
    positionNodesVertically();

    // Otimizar posições para minimizar cruzamentos de links
    const optimizeNodePositions = () => {
      const damping = 0.15;
      
      for (let i = 0; i < settings.iterations; i++) {
        // Ajustar nós com base nas posições dos nós conectados
        for (let level = 0; level <= processedData.maxLevel; level++) {
          nodesByLevel[level].forEach(node => {
            let idealY = 0;
            let totalWeight = 0;
            
            // Considerar links de entrada
            node.targetLinks.forEach(link => {
              const sourceY = link.sourceNode.y + link.sourceNode.height / 2;
              idealY += sourceY * link.value;
              totalWeight += link.value;
            });
            
            // Considerar links de saída
            node.sourceLinks.forEach(link => {
              const targetY = link.targetNode.y + link.targetNode.height / 2;
              idealY += targetY * link.value;
              totalWeight += link.value;
            });
            
            if (totalWeight > 0) {
              idealY = idealY / totalWeight - node.height / 2;
              node.y = node.y * (1 - damping) + idealY * damping;
            }
          });
        }
        
        // Preservar espaçamento após cada iteração
        preserveSpacing();
      }
    };
    
    const preserveSpacing = () => {
      nodesByLevel.forEach(levelNodes => {
        // Ordenar por posição Y
        levelNodes.sort((a, b) => a.y - b.y);
        
        // Garantir espaçamento mínimo
        for (let i = 1; i < levelNodes.length; i++) {
          const current = levelNodes[i];
          const previous = levelNodes[i - 1];
          const minY = previous.y + previous.height + settings.minSpacing;
          
          if (current.y < minY) {
            current.y = minY;
          }
        }
        
        // Ajustar para caber dentro dos limites
        fitNodesToChart(levelNodes);
      });
    };
    
    const fitNodesToChart = (nodes: ProcessedSankeyNode[]) => {
      if (nodes.length <= 1) return;
      
      const firstNode = nodes[0];
      const lastNode = nodes[nodes.length - 1];
      const totalHeight = lastNode.y + lastNode.height - firstNode.y;
      
      if (totalHeight > chartHeight) {
        // Comprimir proporcionalmente
        const compressionFactor = chartHeight / totalHeight;
        const baseY = firstNode.y;
        
        nodes.forEach((node, i) => {
          if (i === 0) return;
          node.y = baseY + (node.y - baseY) * compressionFactor;
        });
      } else if (totalHeight < chartHeight * settings.compressionThreshold) {
        // Esticar proporcionalmente se estiver usando menos espaço
        const stretchFactor = chartHeight * settings.compressionThreshold / totalHeight;
        const baseY = firstNode.y;
        
        nodes.forEach((node, i) => {
          if (i === 0) return;
          node.y = baseY + (node.y - baseY) * stretchFactor;
        });
      }
    };
    
    // Aplicar otimização
    optimizeNodePositions();
    
    // Calcular posições e dimensões dos links
    const calculateLinkPositions = () => {
      // Para cada nó, calcular as posições dos links
      nodes.forEach(node => {
        // Ordenar links para minimizar cruzamentos
        node.sourceLinks.sort((a, b) => 
          a.targetNode.y + a.targetNode.height / 2 - (b.targetNode.y + b.targetNode.height / 2)
        );
        
        node.targetLinks.sort((a, b) => 
          a.sourceNode.y + a.sourceNode.height / 2 - (b.sourceNode.y + b.sourceNode.height / 2)
        );
        
        // Calcular larguras dos links de saída
        if (node.sourceLinks.length > 0) {
          const totalValue = node.sourceLinks.reduce((sum, link) => sum + link.value, 0);
          const linkScale = node.height / totalValue;
          
          let y = node.y;
          node.sourceLinks.forEach(link => {
            const linkHeight = link.value * linkScale;
            link.width = linkHeight;
            link.sy0 = y;
            link.sy1 = y + linkHeight;
            y += linkHeight;
          });
        }
        
        // Calcular larguras dos links de entrada
        if (node.targetLinks.length > 0) {
          const totalValue = node.targetLinks.reduce((sum, link) => sum + link.value, 0);
          const linkScale = node.height / totalValue;
          
          let y = node.y;
          node.targetLinks.forEach(link => {
            const linkHeight = link.value * linkScale;
            link.width = linkHeight;
            link.ty0 = y;
            link.ty1 = y + linkHeight;
            y += linkHeight;
          });
        }
      });
    };
    
    calculateLinkPositions();
    
    // Gerar caminhos para os links usando curvas de Bézier
    links.forEach(link => {
      const x0 = link.sourceNode.x + link.sourceNode.width;
      const x1 = link.targetNode.x;
      
      // Calcular pontos de controle para curvas suaves
      const dx = Math.abs(x1 - x0) * settings.linkCurvature;
      
      // Usar curvas de Bézier para criar caminhos suaves
      link.path = `
        M ${x0} ${link.sy0}
        C ${x0 + dx} ${link.sy0}, ${x1 - dx} ${link.ty0}, ${x1} ${link.ty0}
        L ${x1} ${link.ty1}
        C ${x1 - dx} ${link.ty1}, ${x0 + dx} ${link.sy1}, ${x0} ${link.sy1}
        Z
      `;
    });
    
    return { nodes, links };
  }, [processedData, chartHeight, settings]);
};