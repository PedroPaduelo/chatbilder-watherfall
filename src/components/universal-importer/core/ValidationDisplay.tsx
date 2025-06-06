import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { ValidationResult } from '../types';

interface ValidationDisplayProps {
  validation: ValidationResult;
}

export const ValidationDisplay: React.FC<ValidationDisplayProps> = ({
  validation
}) => {
  if (!validation.valid) {
    return (
      <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 mt-0.5" size={20} />
          <div>
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
              Problemas encontrados nos dados:
            </h4>
            <ul className="space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 dark:text-red-300">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="flex items-center gap-3">
        <CheckCircle className="text-green-500" size={20} />
        <div>
          <h4 className="font-medium text-green-900 dark:text-green-100">
            Dados válidos!
          </h4>
          <p className="text-sm text-green-700 dark:text-green-300">
            Dados prontos para importação
          </p>
        </div>
      </div>
    </div>
  );
};