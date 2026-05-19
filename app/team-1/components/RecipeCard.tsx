import React from 'react';
import { Button } from './ui/Button';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  servings: number;
  ingredientsUsed: string[];
  ingredientsMissing: string[];
  steps: string[];
}

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onSelect }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  const difficultyStyles = {
    Easy: 'bg-primary/10 text-primary',
    Medium: 'bg-accent/10 text-accent',
    Hard: 'bg-red-100 text-red-600'
  };

  return (
    <div className="bg-bg-surface rounded-3xl p-6 card-shadow flex flex-col h-full border border-slate-100 relative overflow-hidden">
      <div className="flex flex-col mb-4">
        <h3 className="text-xl font-bold mb-3">{recipe.name}</h3>
        <div className="flex gap-2 mb-1">
          <span className="px-3 py-1 bg-secondary text-white font-medium rounded-full text-xs uppercase tracking-wide">
            {totalTime} MIN
          </span>
          <span className={`px-3 py-1 font-medium rounded-full text-xs uppercase tracking-wide ${difficultyStyles[recipe.difficulty]}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      <p className="text-text-main text-sm mb-6 flex-1 line-clamp-3">
        {recipe.description}
      </p>
      
      {recipe.ingredientsMissing.length > 0 && (
        <div className="mb-6 p-4 bg-accent/10 rounded-2xl">
          <span className="text-xs font-bold text-accent uppercase tracking-wide flex items-center gap-1 mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Missing Ingredients:
          </span>
          <p className="text-sm text-text-main line-clamp-2">
            {recipe.ingredientsMissing.join(', ')}
          </p>
        </div>
      )}
      
      <Button 
        fullWidth 
        variant="primary" 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(recipe);
        }}
      >
        Start Cooking
      </Button>
    </div>
  );
}
