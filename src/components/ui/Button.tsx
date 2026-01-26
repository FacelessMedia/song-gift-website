'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  'aria-label'?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    fullWidth = false,
    disabled,
    children,
    'aria-label': ariaLabel,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-body font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-soft hover:shadow-soft-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-soft';
    
    const variants = {
      primary: 'bg-primary hover:bg-primary-dark text-white focus:ring-primary disabled:hover:bg-primary',
      secondary: 'bg-background-soft hover:bg-primary hover:text-white text-text-main focus:ring-primary border border-primary/20 disabled:hover:bg-background-soft disabled:hover:text-text-main',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary bg-white/80 backdrop-blur-sm disabled:hover:bg-white/80 disabled:hover:text-primary',
    };

    const sizes = {
      sm: 'px-5 py-2.5 text-sm min-h-[40px]',
      md: 'px-7 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[48px]',
    };

    const widthClass = fullWidth ? 'w-full' : '';
    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(
          baseClasses, 
          variants[variant], 
          sizes[size], 
          widthClass,
          className
        )}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-3 h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
