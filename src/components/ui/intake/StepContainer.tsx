'use client';

import { ReactNode } from 'react';
import { SectionHeading, SectionDescription } from '@/components/ui/Typography';

interface StepContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function StepContainer({ title, subtitle, children }: StepContainerProps) {
  return (
    <div className="bg-white rounded-3xl shadow-soft-lg border border-primary/10 p-6 mb-6">
      <div className="space-y-4">
        <div className="text-center mb-6">
          <SectionHeading level={2} className="mb-2">
            {title}
          </SectionHeading>
          <SectionDescription className="mb-0">
            {subtitle}
          </SectionDescription>
        </div>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
