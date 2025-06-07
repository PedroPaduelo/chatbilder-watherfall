import React, { useState } from 'react';
import { ChevronDown, ChevronRight, RotateCcw, Palette } from 'lucide-react';
import type { SankeyConfigProps } from '../types';
import { sankeyColorPalettes } from '../utils';

const SankeyConfig: React.FC<SankeyConfigProps> = ({ 
  settings, 
  onSettingsChange, 
  onReset
}) => {
  const [openSections, setOpenSections] = useState({
    layout: true,
    visual: false,
    colors: false,
    interaction: false,
    animation: false,
    accessibility: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateSettings = (path: string[], value: any) => {
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    onSettingsChange(newSettings);
  };

  const SectionHeader: React.FC<{ 
    title: string; 
    section: keyof typeof openSections; 
    icon?: React.ReactNode;
  }> = ({ title, section, icon }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors rounded-lg"
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
      </div>
      {openSections[section] ? 
        <ChevronDown className="w-4 h-4 text-gray-500" /> : 
        <ChevronRight className="w-4 h-4 text-gray-500" />
      }
    </button>
  );

  const ColorPaletteSelector: React.FC<{ 
    currentPalette: string[];
    onPaletteChange: (palette: string[]) => void;
  }> = ({ currentPalette, onPaletteChange }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Esquema de Cores
      </label>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(sankeyColorPalettes).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => onPaletteChange(palette)}
            className={`p-2 rounded-lg border transition-colors ${
              JSON.stringify(currentPalette) === JSON.stringify(palette)
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key}
              </span>
              <div className="flex space-x-1">
                {palette.slice(0, 5).map((color, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Configurações do Sankey
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restaurar</span>
          </button>
        </div>
      </div>

      {/* Layout Settings */}
      <div className="space-y-2">
        <SectionHeader title="Layout e Posicionamento" section="layout" />
        {openSections.layout && (
          <div className="p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Largura dos Nós
                </label>
                <input
                  type="range"
                  min="10"
                  max="30"
                  value={settings.layout.nodeWidth}
                  onChange={(e) => updateSettings(['layout', 'nodeWidth'], parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.layout.nodeWidth}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Altura Mínima
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={settings.layout.nodeMinHeight}
                  onChange={(e) => updateSettings(['layout', 'nodeMinHeight'], parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.layout.nodeMinHeight}px</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Espaçamento entre Nós
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={settings.layout.nodeSpacing}
                  onChange={(e) => updateSettings(['layout', 'nodeSpacing'], parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.layout.nodeSpacing}px</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Espaçamento entre Níveis
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={settings.layout.levelSpacing}
                  onChange={(e) => updateSettings(['layout', 'levelSpacing'], parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{settings.layout.levelSpacing}px</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Algoritmo de Layout
              </label>
              <select
                value={settings.layout.algorithm}
                onChange={(e) => updateSettings(['layout', 'algorithm'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="default">Padrão</option>
                <option value="optimized">Otimizado</option>
                <option value="circular">Circular</option>
                <option value="hierarchical">Hierárquico</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Iterações do Algoritmo
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={settings.layout.iterations}
                onChange={(e) => updateSettings(['layout', 'iterations'], parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{settings.layout.iterations} iterações</span>
            </div>
          </div>
        )}
      </div>

      {/* Visual Settings */}
      <div className="space-y-2">
        <SectionHeader title="Aparência Visual" section="visual" />
        {openSections.visual && (
          <div className="p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opacidade dos Nós
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={settings.colors.opacity.node}
                  onChange={(e) => updateSettings(['colors', 'opacity', 'node'], parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{Math.round(settings.colors.opacity.node * 100)}%</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opacidade das Conexões
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={settings.colors.opacity.link}
                  onChange={(e) => updateSettings(['colors', 'opacity', 'link'], parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{Math.round(settings.colors.opacity.link * 100)}%</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Curvatura das Conexões
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.linkStyle.curvature}
                onChange={(e) => updateSettings(['linkStyle', 'curvature'], parseFloat(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{Math.round(settings.linkStyle.curvature * 100)}%</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Borda Arredondada dos Nós
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={settings.nodeStyle.borderRadius}
                onChange={(e) => updateSettings(['nodeStyle', 'borderRadius'], parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-xs text-gray-500">{settings.nodeStyle.borderRadius}px</span>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.linkStyle.gradient?.enabled}
                  onChange={(e) => updateSettings(['linkStyle', 'gradient', 'enabled'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Gradientes nas Conexões</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.nodeStyle.shadow?.enabled}
                  onChange={(e) => updateSettings(['nodeStyle', 'shadow', 'enabled'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Sombra nos Nós</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Colors Settings */}
      <div className="space-y-2">
        <SectionHeader title="Cores e Paletas" section="colors" icon={<Palette className="w-4 h-4" />} />
        {openSections.colors && (
          <div className="p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-600">
            <ColorPaletteSelector
              currentPalette={settings.colors.palette}
              onPaletteChange={(palette) => updateSettings(['colors', 'palette'], palette)}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Colorir Nós Por
                </label>
                <select
                  value={settings.colors.nodeColorBy}
                  onChange={(e) => updateSettings(['colors', 'nodeColorBy'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="index">Índice</option>
                  <option value="level">Nível</option>
                  <option value="value">Valor</option>
                  <option value="category">Categoria</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Colorir Conexões Por
                </label>
                <select
                  value={settings.colors.linkColorBy}
                  onChange={(e) => updateSettings(['colors', 'linkColorBy'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="source">Origem</option>
                  <option value="target">Destino</option>
                  <option value="gradient">Gradiente</option>
                  <option value="value">Valor</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interaction Settings */}
      <div className="space-y-2">
        <SectionHeader title="Interação e Controles" section="interaction" />
        {openSections.interaction && (
          <div className="p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-600">
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.interaction.enabled}
                  onChange={(e) => updateSettings(['interaction', 'enabled'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Habilitar Interações</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.interaction.pan.enabled}
                  onChange={(e) => updateSettings(['interaction', 'pan', 'enabled'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Permitir Arrastar (Pan)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.interaction.zoom.enabled}
                  onChange={(e) => updateSettings(['interaction', 'zoom', 'enabled'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Permitir Zoom</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.interaction.hover.highlightConnected}
                  onChange={(e) => updateSettings(['interaction', 'hover', 'highlightConnected'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Destacar Conexões ao Passar Mouse</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.tooltip.enabled}
                  onChange={(e) => updateSettings(['tooltip', 'enabled'], e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Tooltips</span>
              </label>
            </div>

            {settings.interaction.zoom.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom Mínimo
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={settings.interaction.zoom.minScale}
                    onChange={(e) => updateSettings(['interaction', 'zoom', 'minScale'], parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{Math.round(settings.interaction.zoom.minScale * 100)}%</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom Máximo
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="20"
                    value={settings.interaction.zoom.maxScale}
                    onChange={(e) => updateSettings(['interaction', 'zoom', 'maxScale'], parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{settings.interaction.zoom.maxScale}x</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Animation Settings */}
      <div className="space-y-2">
        <SectionHeader title="Animações" section="animation" />
        {openSections.animation && (
          <div className="p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-600">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.animation.enabled}
                onChange={(e) => updateSettings(['animation', 'enabled'], e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Habilitar Animações</span>
            </label>

            {settings.animation.enabled && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duração da Animação
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="2000"
                    step="50"
                    value={settings.animation.duration}
                    onChange={(e) => updateSettings(['animation', 'duration'], parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-xs text-gray-500">{settings.animation.duration}ms</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Transição
                  </label>
                  <select
                    value={settings.animation.easing}
                    onChange={(e) => updateSettings(['animation', 'easing'], e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="linear">Linear</option>
                    <option value="easeIn">Ease In</option>
                    <option value="easeOut">Ease Out</option>
                    <option value="easeInOut">Ease In Out</option>
                    <option value="bounce">Bounce</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Accessibility Settings */}
      <div className="space-y-2">
        <SectionHeader title="Acessibilidade" section="accessibility" />
        {openSections.accessibility && (
          <div className="p-4 space-y-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-600">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.accessibility.enabled}
                onChange={(e) => updateSettings(['accessibility', 'enabled'], e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Habilitar Recursos de Acessibilidade</span>
            </label>

            {settings.accessibility.enabled && (
              <>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.keyboardNavigation}
                    onChange={(e) => updateSettings(['accessibility', 'keyboardNavigation'], e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Navegação por Teclado</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.announceChanges}
                    onChange={(e) => updateSettings(['accessibility', 'announceChanges'], e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Anunciar Mudanças</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.accessibility.focusRing.enabled}
                    onChange={(e) => updateSettings(['accessibility', 'focusRing', 'enabled'], e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Anel de Foco</span>
                </label>
              </>
            )}
          </div>
        )}
      </div>

      {/* Display Options */}
      <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-900 dark:text-white">Exibição</h4>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.display.showNodeLabels}
              onChange={(e) => updateSettings(['display', 'showNodeLabels'], e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Rótulos dos Nós</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.display.showNodeValues}
              onChange={(e) => updateSettings(['display', 'showNodeValues'], e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Valores dos Nós</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.display.showLinkValues}
              onChange={(e) => updateSettings(['display', 'showLinkValues'], e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Mostrar Valores das Conexões</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formato dos Valores
          </label>
          <select
            value={settings.display.valueFormat}
            onChange={(e) => updateSettings(['display', 'valueFormat'], e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="number">Número</option>
            <option value="percentage">Porcentagem</option>
            <option value="currency">Moeda</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SankeyConfig;