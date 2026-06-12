import React from 'react';

export interface Ingredient {
  name: string;
  category: string;
  confidence: number;
  emoji: string;
  id: string;
}

interface IngredientChipProps {
  ingredient: Ingredient;
  onRemove: (id: string) => void;
  onConfirm?: (id: string) => void;
}

export function IngredientChip({ ingredient, onRemove, onConfirm }: IngredientChipProps) {
  const isLowConfidence = ingredient.confidence < 0.7;

  return (
    <div className={`relative flex items-center justify-between p-4 rounded-2xl bg-bg-surface card-shadow border border-slate-100`}>
      <div className="flex items-center space-x-4">
        <div className="text-2xl bg-bg-main p-2 rounded-xl">{ingredient.emoji}</div>
        <div className="flex flex-col">
          <span className="font-semibold text-text-main capitalize text-lg">{ingredient.name}</span>
          {isLowConfidence && (
            <span className="text-xs text-accent font-medium mt-0.5">
              Please verify this item
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {isLowConfidence && onConfirm && (
          <button 
            onClick={() => onConfirm(ingredient.id)}
            className="p-2 text-primary bg-primary/10 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        <button 
          onClick={() => onRemove(ingredient.id)}
          className="p-2 text-text-light hover:text-secondary rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
