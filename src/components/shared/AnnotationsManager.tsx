import React, { useState } from 'react';
import { MessageSquare, Plus, Edit3, Trash2, Clock, User } from 'lucide-react';
import type { DataRow } from '../../types';

export interface Annotation {
  id: string;
  barId: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  position: {
    x: number;
    y: number;
  };
  type: 'comment' | 'highlight' | 'arrow';
  color?: string;
}

interface AnnotationsManagerProps {
  data: DataRow[];
  annotations: Annotation[];
  onAnnotationsChange: (annotations: Annotation[]) => void;
  selectedBarId?: string;
  className?: string;
}

const AnnotationsManager: React.FC<AnnotationsManagerProps> = ({
  data,
  annotations,
  onAnnotationsChange,
  selectedBarId,
  className = ''
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    type: 'comment' as Annotation['type'],
    color: '#3B82F6'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim() || !selectedBarId) return;

    const annotation: Annotation = {
      id: editingId || `annotation_${Date.now()}`,
      barId: selectedBarId,
      content: formData.content.trim(),
      author: 'Usuário', // Em uma aplicação real, viria da autenticação
      createdAt: editingId ? annotations.find(a => a.id === editingId)?.createdAt || new Date() : new Date(),
      updatedAt: new Date(),
      position: { x: 0, y: 0 }, // Seria calculado baseado na posição da barra
      type: formData.type,
      color: formData.color
    };

    if (editingId) {
      onAnnotationsChange(annotations.map(a => a.id === editingId ? annotation : a));
    } else {
      onAnnotationsChange([...annotations, annotation]);
    }

    setFormData({ content: '', type: 'comment', color: '#3B82F6' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (annotation: Annotation) => {
    setFormData({
      content: annotation.content,
      type: annotation.type,
      color: annotation.color || '#3B82F6'
    });
    setEditingId(annotation.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Deseja excluir esta anotação?')) {
      onAnnotationsChange(annotations.filter(a => a.id !== id));
    }
  };

  const selectedBarAnnotations = annotations.filter(a => a.barId === selectedBarId);
  const selectedBarData = data.find(d => d.id === selectedBarId);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} className="text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Anotações</h3>
          {annotations.length > 0 && (
            <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
              {annotations.length}
            </span>
          )}
        </div>

        {selectedBarId && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus size={14} />
            Adicionar
          </button>
        )}
      </div>

      {selectedBarId && selectedBarData && (
        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
            Selecionado: {selectedBarData.category}
          </h4>
          <p className="text-sm text-purple-700 dark:text-purple-300">
            Valor: {selectedBarData.value} | Tipo: {selectedBarData.type}
          </p>
        </div>
      )}

      {!selectedBarId && (
        <div className="text-center py-6 text-gray-500 dark:text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p className="text-sm">Selecione uma barra para adicionar anotações</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && selectedBarId && (
        <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tipo de Anotação
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Annotation['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="comment">Comentário</option>
              <option value="highlight">Destaque</option>
              <option value="arrow">Seta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Conteúdo
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Digite sua anotação..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cor
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {editingId ? 'Atualizar' : 'Adicionar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ content: '', type: 'comment', color: '#3B82F6' });
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Annotations List */}
      {selectedBarAnnotations.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Anotações desta barra ({selectedBarAnnotations.length})
          </h4>
          {selectedBarAnnotations.map(annotation => (
            <div
              key={annotation.id}
              className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: annotation.color }}
                  />
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                    {annotation.type === 'comment' ? 'Comentário' : 
                     annotation.type === 'highlight' ? 'Destaque' : 'Seta'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(annotation)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Editar"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(annotation.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-900 dark:text-white mb-2">
                {annotation.content}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <User size={12} />
                  {annotation.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(annotation.updatedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Annotations Summary */}
      {annotations.length > 0 && !selectedBarId && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Todas as Anotações ({annotations.length})
          </h4>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {annotations.map(annotation => {
              const barData = data.find(d => d.id === annotation.barId);
              return (
                <div
                  key={annotation.id}
                  className="p-2 bg-gray-50 dark:bg-gray-700 rounded border-l-4"
                  style={{ borderLeftColor: annotation.color }}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {barData?.category || 'Categoria removida'}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {annotation.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnotationsManager;