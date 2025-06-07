import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { ValidationResult } from '../types';

interface ValidationResultDisplayProps {
  validationResult: ValidationResult;
}

export const ValidationResultDisplay: React.FC<ValidationResultDisplayProps> = ({
  validationResult
}) => {
  if (!validationResult) return null;

  if (validationResult.valid) {
    return (
      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-2">
          <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Dados importados com sucesso!
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Os dados foram validados e estão prontos para uso.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-start gap-2">
        <XCircle size={20} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
            Erro na validação dos dados
          </h4>
          <ul className="space-y-1">
            {validationResult.errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};