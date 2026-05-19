"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe } from '../components/RecipeCard';
import { CookStep } from '../components/CookStep';
import { AppHeader } from '../components/AppHeader';

export default function CookPage() {
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const storedRecipe = sessionStorage.getItem('snapchef_selected_recipe');
    if (!storedRecipe) {
      router.push('/team-1/recipes');
      return;
    }
    setRecipe(JSON.parse(storedRecipe));
  }, [router]);

  if (!recipe) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-bg-main">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Optionally clear state here or just redirect Home
    router.push('/team-1');
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-bg-main">
      <AppHeader />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <CookStep 
          stepNumber={currentStepIndex + 1}
          totalSteps={recipe.steps.length}
          instruction={recipe.steps[currentStepIndex]}
          onNext={handleNext}
          onPrev={handlePrev}
          onComplete={handleComplete}
        />
      </main>
    </div>
  );
}
