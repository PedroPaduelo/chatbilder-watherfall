import React from 'react';
import { Check, AlertTriangle } from 'lucide-react';

interface SaveStatusProps {
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onSaveNow?: () => void;
  className?: string;
}

const SaveStatus: React.FC<SaveStatusProps> = ({
  isSaving,
  hasUnsavedChanges,
  onSaveNow,
  className = ''
}) => {
  if (isSaving) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg border border-blue-200 dark:border-blue-700 ${className}`}>
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Salvando alterações...</span>
      </div>
    );
  }

  if (hasUnsavedChanges) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg border border-yellow-200 dark:border-yellow-700 ${className}`}>
        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm font-medium">Mudanças não salvas</span>
        {onSaveNow && (
          <button
            onClick={onSaveNow}
            className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100 text-sm underline ml-1 font-medium"
          >
            Salvar agora
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg border border-green-200 dark:border-green-700 ${className}`}>
      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
      <span className="text-sm font-medium">Todas as alterações salvas</span>
    </div>
  );
};

export default SaveStatus;