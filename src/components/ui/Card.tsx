import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'soft' | 'testimonial';
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = true,
  clickable = false,
  onClick,
}: CardProps) {
  const variants = {
    default: 'bg-white border border-white/80',
    gradient: 'bg-gradient-to-br from-white to-background-soft border border-white/80',
    soft: 'bg-gradient-to-br from-white via-background-soft to-primary/5 border border-white/80',
    testimonial: 'bg-gradient-to-br from-white to-background-soft border border-white/50',
  };

  const paddings = {
    sm: 'p-5',
    md: 'p-6',
    lg: 'p-8 md:p-10',
  };

  const baseClasses = 'rounded-3xl shadow-soft-lg';
  const hoverClasses = hover ? 'hover:shadow-soft transition-all duration-300' : '';
  const clickableClasses = clickable ? 'cursor-pointer transform hover:-translate-y-2' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        paddings[padding],
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
