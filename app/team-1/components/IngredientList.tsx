"use client";

import React, { useState } from 'react';
import { Ingredient, IngredientChip } from './IngredientChip';
import { Button } from './ui/Button';

interface IngredientListProps {
  initialIngredients: Ingredient[];
  onConfirmAll: (ingredients: Ingredient[]) => void;
}

export default function IngredientList({ initialIngredients, onConfirmAll }: IngredientListProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients);
  const [newItemName, setNewItemName] = useState("");

  const handleRemove = (id: string) => {
    setIngredients(prev => prev.filter(ing => ing.id !== id));
  };

  const handleConfirm = (id: string) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === id ? { ...ing, confidence: 1.0 } : ing
    ));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newIng: Ingredient = {
      id: Math.random().toString(36).substring(7),
      name: newItemName.trim(),
      category: "Added",
      confidence: 1.0,
      emoji: "🛒"
    };

    setIngredients(prev => [newIng, ...prev]);
    setNewItemName("");
  };

  return (
    <div className="flex flex-col h-full bg-bg-main">
      <div className="px-6 py-8 bg-bg-main">
        <h2 className="text-2xl mb-1">Found Ingredients</h2>
        <p className="text-text-main">Edit the list before we generate recipes.</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add an item..."
            className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 bg-bg-surface focus:outline-none focus:border-secondary shadow-sm text-text-main"
          />
          <Button type="submit" variant="secondary" className="px-6 py-3 rounded-2xl border-slate-200 text-secondary">
            Add
          </Button>
        </form>

        <div className="space-y-3">
          {ingredients.map(ing => (
            <IngredientChip 
              key={ing.id} 
              ingredient={ing} 
              onRemove={handleRemove} 
              onConfirm={handleConfirm}
            />
          ))}
          {ingredients.length === 0 && (
            <div className="text-center py-12 text-text-light">
              No ingredients listed. Try adding some!
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-bg-surface border-t border-slate-100">
        <Button 
          fullWidth 
          size="lg" 
          onClick={() => onConfirmAll(ingredients)}
          disabled={ingredients.length === 0}
        >
          Find Recipes
        </Button>
      </div>
    </div>
  );
}
