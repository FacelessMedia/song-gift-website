'use client';

import { ReactNode } from 'react';

interface OptionButtonProps {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  isSelected: boolean;
  onClick: (value: string) => void;
  multiSelect?: boolean;
  disabled?: boolean;
  className?: string;
}

export function OptionButton({
  value,
  label,
  description,
  icon,
  isSelected,
  onClick,
  multiSelect = false,
  disabled = false,
  className = ''
}: OptionButtonProps) {
  const handleClick = () => {
    if (!disabled) {
      onClick(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`
        flex items-center gap-3 px-4 py-3 text-left rounded-2xl border-2 transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${isSelected
          ? 'border-primary bg-primary/5 shadow-soft'
          : 'border-primary/20 hover:border-primary/40 bg-white hover:bg-primary/2'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer'
        }
        ${className}
      `}
      role={multiSelect ? 'checkbox' : 'radio'}
      aria-checked={isSelected}
      aria-disabled={disabled}
      aria-describedby={description ? `${value}-description` : undefined}
    >
      {icon && (
        <div className={`flex-shrink-0 ${isSelected ? 'text-primary' : 'text-text-muted'}`}>
          {icon}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <div className={`font-body font-semibold text-base ${
          isSelected ? 'text-primary' : 'text-text-main'
        }`}>
          {label}
        </div>
        
        {description && (
          <div 
            id={`${value}-description`}
            className="font-body text-text-muted text-sm leading-relaxed mt-1"
          >
            {description}
          </div>
        )}
      </div>

      {/* Selection Indicator */}
      <div className="flex-shrink-0">
        {multiSelect ? (
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? 'border-primary bg-primary' 
              : 'border-primary/30'
          }`}>
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
        ) : (
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? 'border-primary bg-primary' 
              : 'border-primary/30'
          }`}>
            {isSelected && (
              <div className="w-2 h-2 rounded-full bg-white" />
            )}
          </div>
        )}
      </div>
    </button>
  );
}
