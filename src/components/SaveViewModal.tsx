import React, { useState } from 'react';
import { Save, X, Camera, FileText } from 'lucide-react';
import type { DataRow, ChartSettings } from '../types';

interface SaveViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string, thumbnail?: string) => Promise<void>;
  data: DataRow[];
  settings: ChartSettings;
  chartRef?: React.RefObject<HTMLDivElement>;
}

const SaveViewModal: React.FC<SaveViewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  data,
  settings,
  chartRef
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const generateThumbnail = async (): Promise<string | undefined> => {
    if (!chartRef?.current) return undefined;

    try {
      setIsGeneratingThumbnail(true);
      
      // Use html2canvas to capture the chart
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#ffffff',
        scale: 0.3, // Smaller scale for thumbnail
        width: 400,
        height: 300,
        useCORS: true,
        allowTaint: true
      });

      return canvas.toDataURL('image/png', 0.7);
    } catch (error) {
      console.warn('Failed to generate thumbnail:', error);
      return undefined;
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      setIsSaving(true);
      
      // Generate thumbnail if not already generated
      const finalThumbnail = thumbnail || await generateThumbnail();
      
      await onSave(name, description, finalThumbnail);
      
      // Reset form
      setName('');
      setDescription('');
      setThumbnail(undefined);
      onClose();
    } catch (error) {
      console.error('Failed to save view:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    const generatedThumbnail = await generateThumbnail();
    setThumbnail(generatedThumbnail);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Save size={20} className="text-blue-600 dark:text-blue-400" />
              Salvar Visualização
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              disabled={isSaving}
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome da Visualização *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Ex: Análise Q4 2024"
                maxLength={100}
                disabled={isSaving}
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Descrição opcional da visualização..."
                rows={3}
                maxLength={500}
                disabled={isSaving}
              />
            </div>

            {/* Thumbnail Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Miniatura
              </label>
              <div className="flex items-center gap-3">
                {thumbnail ? (
                  <div className="relative">
                    <img
                      src={thumbnail}
                      alt="Thumbnail"
                      className="w-20 h-15 object-cover rounded border border-gray-200 dark:border-gray-600"
                    />
                    <button
                      onClick={() => setThumbnail(undefined)}
                      className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 dark:hover:bg-red-700"
                      disabled={isSaving}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-15 bg-gray-100 dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    <Camera size={16} className="text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                
                <button
                  onClick={handleGenerateThumbnail}
                  disabled={isGeneratingThumbnail || isSaving}
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-700 dark:text-gray-300"
                >
                  <Camera size={16} />
                  {isGeneratingThumbnail ? 'Gerando...' : 'Gerar Miniatura'}
                </button>
              </div>
            </div>

            {/* Data Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <FileText size={16} />
                Resumo dos Dados
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>{data.length} {data.length === 1 ? 'categoria' : 'categorias'}</p>
                <p>
                  {data.filter(d => d.segments && d.segments.length > 0).length} barras empilhadas
                </p>
                <p>
                  Configurações: {settings.showConnectors ? 'Conectores' : 'Sem conectores'}, 
                  {settings.showValues ? ' Valores' : ' Sem valores'}
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || isSaving}
              className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={16} />
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveViewModal;