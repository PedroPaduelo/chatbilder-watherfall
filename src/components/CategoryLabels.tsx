import type React from 'react';
import type { ProcessedDataRow, ChartSettings, ChartDimensions } from '../types';
import { 
  getTextAnchorForRotation, 
  getCategoryLabelYPosition 
} from '../utils/helpers';

interface CategoryLabelsProps {
  processedData: ProcessedDataRow[];
  settings: ChartSettings;
  dimensions: ChartDimensions;
}

/**
 * Component responsible for rendering category labels with proper rotation support
 * Handles positioning, anchoring, and rotation transformations
 */
export const CategoryLabels: React.FC<CategoryLabelsProps> = ({
  processedData,
  settings,
  dimensions
}) => {
  if (!settings.showCategories) return null;

  const baseY = dimensions.height - dimensions.margin.bottom + 20;
  
  return (
    <g>
      {processedData.map((bar) => {
        const centerX = bar.x + bar.width / 2;
        const labelY = getCategoryLabelYPosition(settings.categoryLabelRotation, baseY);
        const textAnchor = getTextAnchorForRotation(settings.categoryLabelRotation);
        
        return (
          <text
            key={`category-label-${bar.id}`}
            x={centerX}
            y={labelY}
            textAnchor={textAnchor}
            fontSize={settings.labelSettings?.categoryFontSize || 12}
            fill={settings.labelSettings?.categoryFontColor || '#374151'}
            fontWeight={settings.labelSettings?.categoryFontWeight || 'normal'}
            transform={
              settings.categoryLabelRotation > 0
                ? `rotate(-${settings.categoryLabelRotation}, ${centerX}, ${labelY})`
                : undefined
            }
            style={{
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            {bar.category}
          </text>
        );
      })}
    </g>
  );
};

export default CategoryLabels;