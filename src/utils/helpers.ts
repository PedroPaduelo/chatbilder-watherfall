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