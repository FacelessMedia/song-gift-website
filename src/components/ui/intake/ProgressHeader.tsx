'use client';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressHeader({ currentStep, totalSteps }: ProgressHeaderProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-sm font-semibold text-text-muted">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="font-body text-sm font-semibold text-text-muted">
          {Math.round(progressPercentage)}% Complete
        </span>
      </div>
      <div className="w-full bg-primary/10 rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-primary to-primary-dark h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: Step ${currentStep} of ${totalSteps}, ${Math.round(progressPercentage)}% complete`}
        />
      </div>
    </div>
  );
}
