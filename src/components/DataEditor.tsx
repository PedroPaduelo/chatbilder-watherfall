import { useState, Fragment } from 'react';
import { Plus, Trash2, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import type { DataRow, StackedSegment } from '../types';
import SegmentEditor from './SegmentEditor';
import { generateId } from '../utils/helpers';

interface DataEditorProps {
  data: DataRow[];
  onDataChange: (data: DataRow[]) => void;
}

const DataEditor = ({ data, onDataChange }: DataEditorProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleChange = (id: string, field: keyof DataRow, value: string | number | boolean | DataRow['type']) => {
    const updated = data.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    );
    onDataChange(updated);
  };

  const handleSegmentsChange = (id: string, segments: StackedSegment[]) => {
    const updated = data.map(row => {
      if (row.id === id) {
        // Update the total value based on segments
        const totalValue = segments.reduce((sum, seg) => sum + seg.valor, 0);
        return { ...row, segments, value: totalValue };
      }
      return row;
    });
    onDataChange(updated);
  };

  const handleAdd = () => {
    const newRow: DataRow = {
      id: generateId(),
      category: 'New Category',
      value: 0,
      type: 'increase',
      isSubtotal: false
    };
    onDataChange([...data, newRow]);
  };

  const handleDelete = (id: string) => {
    onDataChange(data.filter(row => row.id !== id));
  };

  const handleDuplicate = (row: DataRow) => {
    const newRow = { ...row, id: generateId() };
    const index = data.findIndex(r => r.id === row.id);
    const updated = [...data];
    updated.splice(index + 1, 0, newRow);
    onDataChange(updated);
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Data Editor</h3>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus size={16} /> Add Row
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left w-8" />
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Value</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Color</th>
              <th className="p-2 text-left">Group</th>
              <th className="p-2 text-left">Subtotal?</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <Fragment key={row.id}>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    {(row.type === 'baseline' || row.type === 'total') && (
                      <button
                        type="button"
                        onClick={() => toggleExpanded(row.id)}
                        className="hover:bg-gray-200 rounded p-1"
                      >
                        {expandedRows.has(row.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                    )}
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.category}
                      onChange={e => handleChange(row.id, 'category', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={row.value}
                      onChange={e => handleChange(row.id, 'value', Number.parseFloat(e.target.value) || 0)}
                      step="0.01"
                      className="w-full px-2 py-1 border rounded"
                      disabled={(row.type === 'baseline' || row.type === 'total') && row.segments && row.segments.length > 0}
                    />
                  </td>
                  <td className="p-2">
                    <select
                      value={row.type}
                      onChange={e => handleChange(row.id, 'type', e.target.value as DataRow['type'])}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="baseline">Baseline</option>
                      <option value="increase">Increase</option>
                      <option value="decrease">Decrease</option>
                      <option value="subtotal">Subtotal</option>
                      <option value="total">Total</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <input
                      type="color"
                      value={row.color || '#000000'}
                      onChange={e => handleChange(row.id, 'color', e.target.value)}
                      className="w-full h-8"
                      disabled={(row.type === 'baseline' || row.type === 'total') && row.segments && row.segments.length > 0}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={row.group || ''}
                      onChange={e => handleChange(row.id, 'group', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="default"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={row.isSubtotal || false}
                      onChange={e => handleChange(row.id, 'isSubtotal', e.target.checked)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(row)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.has(row.id) && (row.type === 'baseline' || row.type === 'total') && (
                  <tr>
                    <td colSpan={8} className="px-8 py-2 bg-gray-50">
                      <SegmentEditor
                        segments={row.segments || []}
                        onSegmentsChange={(segments) => handleSegmentsChange(row.id, segments)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataEditor;