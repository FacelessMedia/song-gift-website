import { ReactNode, ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}

// Section Heading Component
interface SectionHeadingProps extends TypographyProps {
  level?: 1 | 2 | 3;
  id?: string;
}

export function SectionHeading({ 
  children, 
  className, 
  as, 
  level = 1,
  id,
  ...props
}: SectionHeadingProps) {
  const Component = as || (`h${level}` as ElementType);
  
  const levelStyles = {
    1: 'text-3xl md:text-4xl lg:text-5xl',
    2: 'text-2xl md:text-3xl lg:text-4xl',
    3: 'text-xl md:text-2xl lg:text-3xl',
  };

  return (
    <Component 
      id={id}
      className={cn(
        'font-heading font-bold text-text-main mb-8 leading-tight',
        levelStyles[level],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Section Description Component
export function SectionDescription({ children, className, as = 'p' }: TypographyProps) {
  const Component = as;
  
  return (
    <Component 
      className={cn(
        'font-serif text-lg md:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
}

// Card Title Component
export function CardTitle({ children, className, as = 'h3' }: TypographyProps) {
  const Component = as;
  
  return (
    <Component 
      className={cn(
        'font-heading text-xl md:text-2xl font-semibold text-text-main leading-tight',
        className
      )}
    >
      {children}
    </Component>
  );
}

// Card Description Component
export function CardDescription({ children, className, as = 'p' }: TypographyProps) {
  const Component = as;
  
  return (
    <Component 
      className={cn(
        'font-body text-lg text-text-muted leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
}

// Body Text Component
export function BodyText({ children, className, as = 'p' }: TypographyProps) {
  const Component = as;
  
  return (
    <Component 
      className={cn(
        'font-body text-base text-text-main leading-relaxed',
        className
      )}
    >
      {children}
    </Component>
  );
}
