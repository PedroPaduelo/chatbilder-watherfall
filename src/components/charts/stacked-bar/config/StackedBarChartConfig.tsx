import React from 'react';
import type { ChartSettings } from '../../../../types';

interface StackedBarChartConfigProps {
  settings: ChartSettings;
  onSettingsChange: (newSettings: ChartSettings) => void;
}

const StackedBarChartConfig: React.FC<StackedBarChartConfigProps> = ({ settings, onSettingsChange }) => {
  const handleInputChange = (field: keyof ChartSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Stacked Bar Chart Settings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bar Width</label>
          <input
            type="number"
            value={settings.barWidth}
            onChange={(e) => handleInputChange('barWidth', Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Bar Spacing</label>
          <input
            type="number"
            value={settings.barSpacing}
            onChange={(e) => handleInputChange('barSpacing', Number(e.target.value))}
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

export default StackedBarChartConfig;