import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Upload, RotateCcw, Download, Settings, Palette } from 'lucide-react';
import type { SankeyData } from '../types';

interface SankeyD3ChartProps {
  data: SankeyData;
  settings: any;
  width?: number;
  height?: number;
  onDataChange?: (data: any) => void;
  onSettingsChange?: (settings: any) => void;
}

const SankeyD3Chart: React.FC<SankeyD3ChartProps> = ({
  data,
  settings,
  width = 1000,
  height = 600,
  // onDataChange - not used in this implementation
  onSettingsChange
}) => {
  // Converter SankeyData para formato D3
  const convertToD3Format = (sankeyData: SankeyData) => {
    return sankeyData.links.map(link => ({
      source: link.source,
      target: link.target,
      value: link.value,
      category: 'process'
    }));
  };

  // Paleta de cores profissional
  const colorSchemes = {
    financial: {
      input: '#64748B',     // Slate para inputs
      process: '#10B981',   // Emerald para processos
      output: '#059669',    // Verde escuro para outputs positivos
      cost: '#EF4444',      // Vermelho para custos
      expense: '#DC2626'    // Vermelho escuro para despesas
    },
    modern: {
      input: '#6366F1',     // Indigo
      process: '#8B5CF6',   // Violet
      output: '#06B6D4',    // Cyan
      cost: '#F59E0B',      // Amber
      expense: '#EF4444'    // Red
    },
    ocean: {
      input: '#0EA5E9',     // Sky
      process: '#3B82F6',   // Blue
      output: '#1D4ED8',    // Blue dark
      cost: '#F97316',      // Orange
      expense: '#EA580C'    // Orange dark
    }
  };

  // Estados locais para configuração
  const [d3Data, setD3Data] = useState(() => convertToD3Format(data));
  const [config, setConfig] = useState({
    colorScheme: 'financial',
    linkOpacity: 0.7,
    linkGradient: true,
    nodeWidth: 24,
    nodePadding: 30,
    fontSize: 12,
    fontWeight: '500',
    showValues: true,
    animationDuration: 800,
    padding: { top: 40, right: 120, bottom: 40, left: 120 }
  });

  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Função para determinar categoria automaticamente
  const determineCategory = (nodeName: string) => {
    const costKeywords = ['cost', 'expense', 'tax', 'fee', 'abandoned', 'saída'];
    const inputKeywords = ['product', 'source', 'income', 'visitors', 'visitantes'];
    const outputKeywords = ['profit', 'net', 'final', 'purchase', 'conversion', 'compra'];
    
    const name = nodeName.toLowerCase();
    
    if (costKeywords.some(keyword => name.includes(keyword))) return 'cost';
    if (outputKeywords.some(keyword => name.includes(keyword))) return 'output';
    if (inputKeywords.some(keyword => name.includes(keyword))) return 'input';
    return 'process';
  };

  // Função para obter cor baseada na categoria
  const getNodeColor = (category: string) => {
    const scheme = colorSchemes[config.colorScheme as keyof typeof colorSchemes];
    return scheme[category as keyof typeof scheme] || scheme.process;
  };

  // Função customizada para calcular layout Sankey melhorado
  const calculateSankeyLayout = (nodes: any[], links: any[], width: number, height: number) => {
    const nodeMap = new Map();
    
    // Inicializar nós com categorias
    nodes.forEach(node => {
      const category = node.category || determineCategory(node.name);
      nodeMap.set(node.id, {
        ...node,
        category,
        sourceLinks: [],
        targetLinks: [],
        value: 0,
        x: 0,
        y: 0,
        width: config.nodeWidth,
        height: 0,
        color: getNodeColor(category)
      });
    });

    // Processar links
    const processedLinks = links.map(link => {
      const source = nodeMap.get(link.source);
      const target = nodeMap.get(link.target);
      const processedLink = {
        ...link,
        source: source,
        target: target,
        width: 0
      };
      
      source.sourceLinks.push(processedLink);
      target.targetLinks.push(processedLink);
      
      return processedLink;
    });

    // Calcular valores dos nós
    nodeMap.forEach(node => {
      const inValue = node.targetLinks.reduce((sum: number, link: any) => sum + link.value, 0);
      const outValue = node.sourceLinks.reduce((sum: number, link: any) => sum + link.value, 0);
      node.value = Math.max(inValue, outValue);
    });

    // Calcular camadas com melhor algoritmo
    const computeLayers = () => {
      const layers: any[][] = [];
      const nodeDepths = new Map();
      
      // Encontrar nós raiz
      const rootNodes = Array.from(nodeMap.values()).filter((node: any) => node.targetLinks.length === 0);
      
      // BFS para calcular profundidades
      const queue = [...rootNodes.map(node => ({ node, depth: 0 }))];
      rootNodes.forEach((node: any) => nodeDepths.set(node.id, 0));
      
      while (queue.length > 0) {
        const { node, depth } = queue.shift()!;
        
        node.sourceLinks.forEach((link: any) => {
          const target = link.target;
          const newDepth = depth + 1;
          
          if (!nodeDepths.has(target.id) || nodeDepths.get(target.id) < newDepth) {
            nodeDepths.set(target.id, newDepth);
            queue.push({ node: target, depth: newDepth });
          }
        });
      }
      
      // Organizar nós em camadas
      const maxDepth = Math.max(...nodeDepths.values());
      for (let i = 0; i <= maxDepth; i++) {
        layers[i] = [];
      }
      
      nodeMap.forEach(node => {
        const depth = nodeDepths.get(node.id) || 0;
        layers[depth].push(node);
      });
      
      return layers.filter(layer => layer.length > 0);
    };

    const layers = computeLayers();
    const layerWidth = layers.length > 1 ? (width - config.nodeWidth) / (layers.length - 1) : 0;

    // Posicionamento horizontal
    layers.forEach((layer, i) => {
      layer.forEach(node => {
        node.x = i * layerWidth;
        node.layer = i;
      });
    });

    // Calcular alturas proporcionais
    const maxValue = Math.max(...Array.from(nodeMap.values()).map((n: any) => n.value));
    const totalAvailableHeight = height - config.padding.top - config.padding.bottom;
    
    layers.forEach(layer => {
      const totalLayerValue = layer.reduce((sum: number, node: any) => sum + node.value, 0);
      const scaleFactor = Math.min(1, totalAvailableHeight / (totalLayerValue * 0.8));
      
      layer.forEach(node => {
        node.height = Math.max(20, (node.value / maxValue) * totalAvailableHeight * 0.6 * scaleFactor);
      });
    });

    // Posicionamento vertical otimizado
    layers.forEach(layer => {
      const totalHeight = layer.reduce((sum: number, node: any) => sum + node.height, 0);
      const totalPadding = Math.max(0, (layer.length - 1) * config.nodePadding);
      const availableHeight = height - totalHeight - totalPadding;
      let currentY = Math.max(config.padding.top, availableHeight / 2);

      // Ordenar por valor para melhor layout
      layer.sort((a: any, b: any) => b.value - a.value);

      layer.forEach(node => {
        node.y = currentY;
        currentY += node.height + config.nodePadding;
      });
    });

    // Calcular larguras dos links
    processedLinks.forEach(link => {
      link.width = Math.max(4, (link.value / maxValue) * 80);
    });

    return {
      nodes: Array.from(nodeMap.values()),
      links: processedLinks
    };
  };

  // Função para criar path suave para links
  const createLinkPath = (link: any) => {
    const sourceX = link.source.x + link.source.width;
    const targetX = link.target.x;
    const sourceY = link.source.y + link.source.height / 2;
    const targetY = link.target.y + link.target.height / 2;
    
    const curvature = 0.5;
    const controlX1 = sourceX + (targetX - sourceX) * curvature;
    const controlX2 = targetX - (targetX - sourceX) * curvature;
    
    return `M${sourceX},${sourceY} C${controlX1},${sourceY} ${controlX2},${targetY} ${targetX},${targetY}`;
  };

  // Função para processar dados
  const processData = (rawData: any[]) => {
    const nodes: any[] = [];
    const links: any[] = [];
    const nodeMap = new Map();

    rawData.forEach(d => {
      if (!nodeMap.has(d.source)) {
        nodeMap.set(d.source, { id: d.source, name: d.source, category: d.category });
        nodes.push({ id: d.source, name: d.source, category: d.category });
      }
      if (!nodeMap.has(d.target)) {
        nodeMap.set(d.target, { id: d.target, name: d.target, category: d.category });
        nodes.push({ id: d.target, name: d.target, category: d.category });
      }
    });

    rawData.forEach(d => {
      links.push({
        source: d.source,
        target: d.target,
        value: +d.value
      });
    });

    return { nodes, links };
  };

  // Função principal de renderização
  const renderSankey = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const containerWidth = width;
    const containerHeight = height;
    const chartWidth = containerWidth - config.padding.left - config.padding.right;
    const chartHeight = containerHeight - config.padding.top - config.padding.bottom;

    // Configurar SVG
    svg
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .style("background", "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)");

    // Adicionar definições para gradientes
    const defs = svg.append("defs");
    
    // Criar gradientes para links
    if (config.linkGradient) {
      const gradient = defs.append("linearGradient")
        .attr("id", "linkGradient")
        .attr("gradientUnits", "userSpaceOnUse");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", colorSchemes[config.colorScheme as keyof typeof colorSchemes].process)
        .attr("stop-opacity", config.linkOpacity);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", colorSchemes[config.colorScheme as keyof typeof colorSchemes].output)
        .attr("stop-opacity", config.linkOpacity * 0.6);
    }

    const g = svg.append("g")
      .attr("transform", `translate(${config.padding.left},${config.padding.top})`);

    const { nodes, links } = processData(d3Data);
    const sankeyData = calculateSankeyLayout(nodes, links, chartWidth, chartHeight);

    // Tooltip
    const tooltip = d3.select(tooltipRef.current);

    // Renderizar links com animação
    const linkGroup = g.append("g").attr("class", "links");
    
    const link = linkGroup
      .selectAll(".link")
      .data(sankeyData.links)
      .join("path")
      .attr("class", "link")
      .attr("d", createLinkPath)
      .attr("stroke", config.linkGradient ? "url(#linkGradient)" : (d: any) => d.source.color)
      .attr("stroke-opacity", 0)
      .attr("stroke-width", 0)
      .attr("fill", "none")
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease");

    // Animação de entrada dos links
    link.transition()
      .duration(config.animationDuration)
      .delay((_d: any, i: number) => i * 50)
      .attr("stroke-opacity", config.linkOpacity)
      .attr("stroke-width", (d: any) => d.width);

    // Eventos dos links
    link
      .on("mouseover", function(event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-opacity", Math.min(1, config.linkOpacity + 0.3))
          .attr("stroke-width", d.width * 1.2);
        
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .html(`
            <div class="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
              <div class="font-semibold text-gray-800">${d.source.name} → ${d.target.name}</div>
              <div class="text-sm text-gray-600 mt-1">Value: <span class="font-medium">${d.value.toLocaleString()}</span></div>
            </div>
          `);
      })
      .on("mouseout", function(_event: any, d: any) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-opacity", config.linkOpacity)
          .attr("stroke-width", d.width);
        
        tooltip.style("opacity", 0);
      });

    // Renderizar nós
    const nodeGroup = g.append("g").attr("class", "nodes");
    
    const node = nodeGroup
      .selectAll(".node")
      .data(sankeyData.nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "pointer");

    // Retângulos dos nós
    const nodeRects = node.append("rect")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      .attr("height", 0)
      .attr("width", (d: any) => d.width)
      .attr("fill", (d: any) => d.color)
      .attr("stroke", "none")
      .attr("rx", 4)
      .attr("ry", 4)
      .style("filter", "drop-shadow(0 2px 6px rgba(0,0,0,0.15))")
      .style("transition", "all 0.3s ease");

    // Animação de entrada dos nós
    nodeRects.transition()
      .duration(config.animationDuration)
      .delay((_d: any, i: number) => i * 80)
      .attr("height", (d: any) => d.height);

    // Eventos dos nós
    node
      .on("mouseover", function(event: any, d: any) {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("fill", d3.color(d.color)?.brighter(0.2)?.toString() || d.color)
          .style("filter", "drop-shadow(0 4px 8px rgba(0,0,0,0.2))");
        
        tooltip
          .style("opacity", 1)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .html(`
            <div class="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
              <div class="font-semibold text-gray-800">${d.name}</div>
              <div class="text-sm text-gray-600 mt-1">Total Value: <span class="font-medium">${d.value.toLocaleString()}</span></div>
              <div class="text-xs text-gray-500 mt-1">Category: ${d.category}</div>
            </div>
          `);
      })
      .on("mouseout", function(_event: any, d: any) {
        d3.select(this).select("rect")
          .transition()
          .duration(200)
          .attr("fill", d.color)
          .style("filter", "drop-shadow(0 2px 6px rgba(0,0,0,0.15))");
        
        tooltip.style("opacity", 0);
      });

    // Labels dos nós
    const labels = node.append("text")
      .attr("x", (d: any) => d.x < chartWidth / 2 ? d.x + d.width + 12 : d.x - 12)
      .attr("y", (d: any) => d.y + d.height / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d: any) => d.x < chartWidth / 2 ? "start" : "end")
      .style("font-family", "'Inter', -apple-system, BlinkMacSystemFont, sans-serif")
      .style("font-size", `${config.fontSize}px`)
      .style("font-weight", config.fontWeight)
      .style("fill", "#374151")
      .style("opacity", 0);

    // Texto principal do label
    labels.each(function(d: any) {
      const label = d3.select(this);
      label.text(d.name);
      
      if (config.showValues) {
        label.append("tspan")
          .attr("x", d.x < chartWidth / 2 ? d.x + d.width + 12 : d.x - 12)
          .attr("dy", "1.2em")
          .style("font-size", `${config.fontSize - 1}px`)
          .style("font-weight", "400")
          .style("fill", "#6B7280")
          .text(`${d.value.toLocaleString()}`);
      }
    });

    // Animação dos labels
    labels.transition()
      .duration(config.animationDuration)
      .delay((_d: any, i: number) => i * 100 + 300)
      .style("opacity", 1);
  };

  // Effect para re-renderizar quando dados mudam
  useEffect(() => {
    if (data.nodes.length > 0 && data.links.length > 0) {
      const convertedData = convertToD3Format(data);
      setD3Data(convertedData);
    }
  }, [data]);

  useEffect(() => {
    if (d3Data.length > 0) {
      const timer = setTimeout(() => {
        renderSankey();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [d3Data, config, width, height]);

  // Handlers para mudanças de configuração
  const handleConfigChange = (newConfig: Partial<typeof config>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    if (onSettingsChange) {
      const updatedSettings = {
        ...settings,
        layout: {
          ...settings.layout,
          nodeWidth: newConfig.nodeWidth || settings.layout?.nodeWidth || 24,
          nodeSpacing: newConfig.nodePadding || settings.layout?.nodeSpacing || 30
        },
        animation: {
          ...settings.animation,
          duration: newConfig.animationDuration || settings.animation?.duration || 800
        }
      };
      onSettingsChange(updatedSettings);
    }
  };

  const exportChart = (format: 'png' | 'svg' | 'csv') => {
    const svg = svgRef.current;
    if (!svg) return;

    switch (format) {
      case 'svg':
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgLink = document.createElement('a');
        svgLink.href = svgUrl;
        svgLink.download = 'sankey-chart.svg';
        svgLink.click();
        URL.revokeObjectURL(svgUrl);
        break;
        
      case 'png':
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const svgString = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob(blob => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'sankey-chart.png';
              link.click();
              URL.revokeObjectURL(url);
            }
          });
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
        break;
        
      case 'csv':
        const csvContent = [
          ['source', 'target', 'value'],
          ...d3Data.map(d => [d.source, d.target, d.value])
        ].map(row => row.join(',')).join('\n');
        const csvBlob = new Blob([csvContent], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement('a');
        csvLink.href = csvUrl;
        csvLink.download = 'sankey-data.csv';
        csvLink.click();
        URL.revokeObjectURL(csvUrl);
        break;
    }
  };

  return (
    <div className="w-full h-full relative">
      {/* Painel de configuração superior */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-gray-600" />
          <select 
            value={config.colorScheme} 
            onChange={(e) => handleConfigChange({ colorScheme: e.target.value })}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="financial">Financeiro</option>
            <option value="modern">Moderno</option>
            <option value="ocean">Oceano</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => exportChart('png')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Exportar PNG"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => exportChart('svg')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Exportar SVG"
          >
            <Download className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => exportChart('csv')}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Exportar CSV"
          >
            <Upload className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Gráfico principal */}
      <div className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl overflow-hidden">
        <svg 
          ref={svgRef} 
          className="w-full rounded-xl"
          style={{ minHeight: `${height}px` }}
        />
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none opacity-0 transition-opacity duration-200 z-50"
        />
      </div>

      {/* Painel de configuração inferior */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <label>Largura Nó:</label>
            <input
              type="range"
              min="15"
              max="50"
              value={config.nodeWidth}
              onChange={(e) => handleConfigChange({ nodeWidth: parseInt(e.target.value) })}
              className="w-16"
            />
            <span className="w-6 text-center">{config.nodeWidth}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <label>Espaçamento:</label>
            <input
              type="range"
              min="10"
              max="60"
              value={config.nodePadding}
              onChange={(e) => handleConfigChange({ nodePadding: parseInt(e.target.value) })}
              className="w-16"
            />
            <span className="w-6 text-center">{config.nodePadding}</span>
          </div>

          <div className="flex items-center gap-2">
            <label>Opacidade:</label>
            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={config.linkOpacity}
              onChange={(e) => handleConfigChange({ linkOpacity: parseFloat(e.target.value) })}
              className="w-16"
            />
            <span className="w-8 text-center">{config.linkOpacity}</span>
          </div>

          <button
            onClick={() => handleConfigChange({ 
              nodeWidth: 24, 
              nodePadding: 30, 
              linkOpacity: 0.7,
              colorScheme: 'financial'
            })}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SankeyD3Chart;