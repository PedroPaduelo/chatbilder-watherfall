// Helper function to adjust color brightness
export const adjustColor = (color: string, factor: number): string => {
  const hex = color.replace('#', '');
  const rgb = Number.parseInt(hex, 16);
  const r = Math.min(255, Math.floor((rgb >> 16) * factor));
  const g = Math.min(255, Math.floor(((rgb >> 8) & 0x00FF) * factor));
  const b = Math.min(255, Math.floor((rgb & 0x0000FF) * factor));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

// Helper function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

// Helper function to format numbers
export const formatValue = (value: number, prefix = '', suffix = '', decimals = 2): string => {
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
};

/**
 * Calculate the required bottom margin based on category label rotation
 * @param rotation - Rotation angle in degrees
 * @param maxCategoryLength - Length of the longest category name
 * @param fontSize - Font size of the category labels
 * @returns Required bottom margin in pixels
 */
export const calculateBottomMarginForRotation = (
  rotation: number, 
  maxCategoryLength: number, 
  fontSize = 12
): number => {
  if (rotation === 0) return 60; // Default margin
  
  // Estimate character width (rough approximation)
  const charWidth = fontSize * 0.6;
  const textWidth = maxCategoryLength * charWidth;
  
  // Calculate the height needed for rotated text
  const radians = (rotation * Math.PI) / 180;
  const rotatedHeight = Math.abs(textWidth * Math.sin(radians));
  
  // Add padding for better visual spacing
  return Math.max(60, rotatedHeight + 30);
};

/**
 * Calculate the optimal text anchor based on rotation angle
 * @param rotation - Rotation angle in degrees
 * @returns SVG text anchor value
 */
export const getTextAnchorForRotation = (rotation: number): 'start' | 'middle' | 'end' => {
  if (rotation === 0) return 'middle';
  if (rotation <= 45) return 'end';
  return 'end';
};

/**
 * Calculate the Y position offset for rotated category labels
 * @param rotation - Rotation angle in degrees
 * @param baseY - Base Y position
 * @returns Adjusted Y position
 */
export const getCategoryLabelYPosition = (rotation: number, baseY: number): number => {
  if (rotation === 0) return baseY;
  
  // For rotated text, move it slightly higher to prevent cutoff
  const offset = rotation > 45 ? 10 : 5;
  return baseY - offset;
};

/**
 * Get the maximum category name length from data
 * @param data - Chart data array
 * @returns Maximum character length
 */
export const getMaxCategoryLength = (data: { category?: string }[]): number => {
  return Math.max(...data.map(item => (item.category || '').length));
};