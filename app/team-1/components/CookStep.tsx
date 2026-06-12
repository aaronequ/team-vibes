import React from 'react';
import { Button } from './ui/Button';

interface CookStepProps {
  stepNumber: number;
  totalSteps: number;
  instruction: string;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

export function CookStep({ 
  stepNumber, 
  totalSteps, 
  instruction, 
  onNext, 
  onPrev,
  onComplete
}: CookStepProps) {
  const isLastStep = stepNumber === totalSteps;
  const isFirstStep = stepNumber === 1;

  // Progress percentage
  const progress = (stepNumber / totalSteps) * 100;

  return (
    <div className="flex flex-col h-full bg-bg-main relative">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-200">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <span className="text-sm font-bold text-primary uppercase tracking-widest mb-6">
          Step {stepNumber} of {totalSteps}
        </span>
        
        <p className="text-3xl md:text-4xl font-bold text-secondary leading-tight max-w-2xl">
          {instruction}
        </p>
      </div>

      <div className="p-6 bg-bg-surface border-t border-slate-100 flex gap-4">
        <Button 
          variant="secondary" 
          onClick={onPrev}
          disabled={isFirstStep}
          className="flex-1 max-w-[120px]"
        >
          Back
        </Button>
        
        {isLastStep ? (
          <Button 
            variant="primary" 
            onClick={onComplete}
            className="flex-1 bg-accent hover:bg-accent/90" // Use accent color for finish
          >
            Finish & Eat! 🍽️
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={onNext}
            className="flex-1"
          >
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
}
