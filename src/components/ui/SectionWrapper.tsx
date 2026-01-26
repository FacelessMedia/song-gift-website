import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  background?: 'default' | 'soft' | 'gradient' | 'dark';
  spacing?: 'sm' | 'md' | 'lg';
  maxWidth?: boolean;
  id?: string;
}

export function SectionWrapper({
  children,
  className,
  background = 'default',
  spacing = 'lg',
  maxWidth = true,
  id,
}: SectionWrapperProps) {
  const backgrounds = {
    default: 'bg-background-main',
    soft: 'bg-gradient-to-br from-background-main to-background-soft',
    gradient: 'bg-gradient-to-br from-background-soft via-background-main to-background-soft',
    dark: 'bg-text-main',
  };

  const spacings = {
    sm: 'py-10 md:py-14',
    md: 'py-14 md:py-20',
    lg: 'py-16 md:py-24',
  };

  return (
    <section
      id={id}
      className={cn(
        backgrounds[background],
        spacings[spacing],
        className
      )}
    >
      <div className={cn(
        'px-4',
        maxWidth && 'max-w-[1400px] mx-auto'
      )}>
        {children}
      </div>
    </section>
  );
}
