import type React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { StackedSegment } from '../../types';

interface SegmentEditorProps {
  segments: StackedSegment[];
  onSegmentsChange: (segments: StackedSegment[]) => void;
}

const SegmentEditor: React.FC<SegmentEditorProps> = ({ segments, onSegmentsChange }) => {
  const handleSegmentChange = (index: number, field: keyof StackedSegment, value: any) => {
    const updated = segments.map((seg, i) => 
      i === index ? { ...seg, [field]: value } : seg
    );
    onSegmentsChange(updated);
  };

  const handleAddSegment = () => {
    onSegmentsChange([...segments, { categoria: 'New Segment', valor: 0, cor: '#888888' }]);
  };

  const handleRemoveSegment = (index: number) => {
    onSegmentsChange(segments.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Segments</span>
        <button
          onClick={handleAddSegment}
          className="text-xs px-2 py-1 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-1 transition-colors"
        >
          <Plus size={12} />
          Add Segment
        </button>
      </div>
      {segments.map((segment, index) => (
        <div key={index} className="flex gap-2 items-center mb-1">
          <input
            type="text"
            value={segment.categoria}
            onChange={e => handleSegmentChange(index, 'categoria', e.target.value)}
            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Category"
          />
          <input
            type="number"
            value={segment.valor}
            onChange={e => handleSegmentChange(index, 'valor', parseFloat(e.target.value) || 0)}
            step="0.01"
            className="w-20 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Value"
          />
          <input
            type="color"
            value={segment.cor}
            onChange={e => handleSegmentChange(index, 'cor', e.target.value)}
            className="w-8 h-6 border border-gray-300 dark:border-gray-600 rounded"
          />
          <button
            onClick={() => handleRemoveSegment(index)}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SegmentEditor;