import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '../hooks/useTheme';

interface ThemeSelectorProps {
  className?: string;
  showLabel?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  className = '', 
  showLabel = true 
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const themeOptions: Array<{
    value: Theme;
    label: string;
    icon: React.ComponentType<any>; // More flexible type for Lucide icons
    description: string;
  }> = [
    {
      value: 'light',
      label: 'Claro',
      icon: Sun,
      description: 'Tema claro'
    },
    {
      value: 'dark',
      label: 'Escuro',
      icon: Moon,
      description: 'Tema escuro'
    },
    {
      value: 'auto',
      label: 'Auto',
      icon: Monitor,
      description: 'Seguir sistema'
    }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Tema:
        </span>
      )}
      
      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {themeOptions.map(option => {
          const Icon = option.icon;
          const isActive = theme === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
              }`}
              title={option.description}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Current theme indicator */}
      <div className="hidden lg:flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <div className={`w-2 h-2 rounded-full ${
          resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-yellow-400'
        }`} />
        <span>{resolvedTheme === 'dark' ? 'Escuro' : 'Claro'}</span>
      </div>
    </div>
  );
};

export default ThemeSelector;