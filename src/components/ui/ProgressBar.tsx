import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  variant = 'primary',
  showPercentage = false,
  animated = true,
  className = '',
  label
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-1';
      case 'md':
        return 'h-2';
      case 'lg':
        return 'h-3';
      default:
        return 'h-2';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 dark:bg-blue-500';
      case 'success':
        return 'bg-green-600 dark:bg-green-500';
      case 'warning':
        return 'bg-yellow-600 dark:bg-yellow-500';
      case 'error':
        return 'bg-red-600 dark:bg-red-500';
      default:
        return 'bg-blue-600 dark:bg-blue-500';
    }
  };

  const getGlowEffect = () => {
    switch (variant) {
      case 'primary':
        return 'shadow-blue-500/50';
      case 'success':
        return 'shadow-green-500/50';
      case 'warning':
        return 'shadow-yellow-500/50';
      case 'error':
        return 'shadow-red-500/50';
      default:
        return 'shadow-blue-500/50';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {clampedProgress.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`relative w-full ${getSizeClasses()} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ease-out ${getVariantClasses()} ${
            animated ? 'animate-pulse' : ''
          } ${clampedProgress > 80 ? `shadow-lg ${getGlowEffect()}` : ''}`}
          style={{ 
            width: `${clampedProgress}%`,
            background: animated ? `linear-gradient(90deg, currentColor 0%, rgba(255,255,255,0.3) 50%, currentColor 100%)` : undefined,
            backgroundSize: animated ? '200% 100%' : undefined,
            animation: animated ? 'shimmer 2s infinite' : undefined
          }}
        />
        
        {/* Animated shine effect */}
        {animated && clampedProgress > 0 && (
          <div
            className="absolute top-0 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
            style={{
              width: '20%',
              animation: 'slide 2s infinite',
              left: `-20%`
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressBar;