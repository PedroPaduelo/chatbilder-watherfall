import React from 'react';
import type { ChartSettings } from '../../../../types';

interface LineChartConfigProps {
  settings: ChartSettings;
  onSettingsChange: (newSettings: ChartSettings) => void;
}

const LineChartConfig: React.FC<LineChartConfigProps> = ({ settings, onSettingsChange }) => {
  const handleInputChange = (field: keyof ChartSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Line Chart Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Line Width</label>
          <input
            type="number"
            value={settings.lineWidth}
            onChange={(e) => handleInputChange('lineWidth', Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Accent Color</label>
          <input
            type="color"
            value={settings.accentColor}
            onChange={(e) => handleInputChange('accentColor', e.target.value)}
            className="mt-1 block w-full h-10 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LineChartConfig;