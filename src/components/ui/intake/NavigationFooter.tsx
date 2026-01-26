'use client';

import { Button } from '@/components/ui/Button';

interface NavigationFooterProps {
  currentStep: number;
  totalSteps: number;
  isStepValid: boolean;
  onBack: () => void;
  onNext: () => void;
  nextButtonText?: string;
}

export function NavigationFooter({
  currentStep,
  totalSteps,
  isStepValid,
  onBack,
  onNext,
  nextButtonText
}: NavigationFooterProps) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  
  const defaultNextText = isLastStep ? 'Continue to Checkout' : 'Next';
  const buttonText = nextButtonText || defaultNextText;

  return (
    <div className="flex items-center justify-between pt-4">
      <Button
        variant="outline"
        size="lg"
        onClick={onBack}
        disabled={isFirstStep}
        className={isFirstStep ? 'opacity-50 cursor-not-allowed' : ''}
        aria-label="Go to previous step"
      >
        Back
      </Button>
      
      <Button
        variant="primary"
        size="lg"
        onClick={onNext}
        disabled={!isStepValid}
        className={!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}
        aria-label={isLastStep ? 'Continue to checkout' : 'Go to next step'}
      >
        {buttonText}
      </Button>
    </div>
  );
}
