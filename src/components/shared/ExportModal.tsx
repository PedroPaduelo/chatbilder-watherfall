import React from 'react';
import { Download, Image, FileText, FileJson, Code } from 'lucide-react';
import Modal from '../ui/Modal';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
  onExportJSON: () => void;
  onExportHTML: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onExportHTML
}) => {
  const exportOptions = [
    {
      id: 'png',
      name: 'PNG',
      description: 'Imagem em alta qualidade para apresentações',
      icon: Image,
      color: 'from-blue-600 to-blue-700',
      hoverColor: 'hover:from-blue-700 hover:to-blue-800',
      onClick: () => {
        onExportPNG();
        onClose();
      }
    },
    {
      id: 'svg',
      name: 'SVG',
      description: 'Vetor escalável para web e impressão',
      icon: FileText,
      color: 'from-green-600 to-green-700',
      hoverColor: 'hover:from-green-700 hover:to-green-800',
      onClick: () => {
        onExportSVG();
        onClose();
      }
    },
    {
      id: 'json',
      name: 'JSON',
      description: 'Dados estruturados para integração',
      icon: FileJson,
      color: 'from-orange-600 to-orange-700',
      hoverColor: 'hover:from-orange-700 hover:to-orange-800',
      onClick: () => {
        onExportJSON();
        onClose();
      }
    },
    {
      id: 'html',
      name: 'HTML',
      description: 'Página web completa com gráfico',
      icon: Code,
      color: 'from-purple-600 to-purple-700',
      hoverColor: 'hover:from-purple-700 hover:to-purple-800',
      onClick: () => {
        onExportHTML();
        onClose();
      }
    }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar Gráfico"
      maxWidth="2xl"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Escolha o formato de exportação que melhor atende às suas necessidades.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {exportOptions.map((option) => {
            const IconComponent = option.icon;
            
            return (
              <button
                key={option.id}
                onClick={option.onClick}
                className={`
                  relative p-6 rounded-xl border border-gray-200 dark:border-gray-700 
                  bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700
                  transition-all duration-200 transform hover:scale-105 hover:shadow-lg
                  text-left group
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`
                    p-3 rounded-lg bg-gradient-to-r ${option.color} ${option.hoverColor}
                    text-white transition-all duration-200 group-hover:shadow-md
                  `}>
                    <IconComponent size={24} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Download size={16} className="text-gray-400" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Footer info */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                Dicas de Exportação
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>• <strong>PNG:</strong> Melhor para apresentações e documentos</li>
                <li>• <strong>SVG:</strong> Ideal para web e impressão em alta qualidade</li>
                <li>• <strong>JSON:</strong> Para integração com outras ferramentas</li>
                <li>• <strong>HTML:</strong> Página standalone com o gráfico interativo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;