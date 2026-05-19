"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '../components/AppHeader';
import { RecipeCard, Recipe } from '../components/RecipeCard';
import { RecipeFilters } from '../components/RecipeFilters';
import { Ingredient } from '../components/IngredientChip';

export default function RecipesPage() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedIngredients = sessionStorage.getItem('snapchef_ingredients');
      if (!storedIngredients) {
        router.push('/team-1/scan');
        return;
      }

      const ingredients: Ingredient[] = JSON.parse(storedIngredients);
      
      const response = await fetch('/team-1/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate recipes');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setRecipes(data.recipes || []);
    } catch (err) {
      console.error(err);
      setError("We couldn't generate recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [router]);

  const handleRetry = () => {
    fetchRecipes();
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    sessionStorage.setItem('snapchef_selected_recipe', JSON.stringify(recipe));
    router.push('/team-1/cook');
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (activeFilter === "Quick (< 30m)") return (recipe.prepTime + recipe.cookTime) <= 30;
    if (activeFilter === "Easy") return recipe.difficulty === "Easy";
    if (activeFilter === "Fewest Missing") return recipe.ingredientsMissing.length <= 1;
    return true; // "All"
  });

  return (
    <div className="flex flex-col min-h-[100dvh] bg-bg-main">
      <AppHeader />
      
      <main className="flex-1 flex flex-col pt-6 pb-12">
        <div className="px-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">Curated for You</h1>
          <p className="text-text-main">Based on the ingredients in your fridge.</p>
        </div>

        <div className="mb-6">
          <RecipeFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        <div className="flex-1 px-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
              <p className="text-text-main font-medium">Cooking up some ideas...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-bg-surface border border-slate-100 rounded-3xl card-shadow max-w-sm mx-auto my-12">
              <span className="text-5xl mb-4">🍽️⚡</span>
              <h3 className="text-xl font-bold text-secondary mb-2">Our Chef is Busy</h3>
              <p className="text-text-main text-sm mb-6 leading-relaxed">
                The recipe engine is experiencing heavy demand right now. Let's give it another shot!
              </p>
              <div className="flex flex-col w-full gap-3">
                <button 
                  onClick={handleRetry}
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-all duration-200 active:scale-95 uppercase tracking-wide text-sm shadow-md"
                >
                  Try Again
                </button>
                <button 
                  onClick={() => router.push('/team-1/scan')}
                  className="text-text-main hover:text-secondary font-semibold py-2 px-6 rounded-full transition-all duration-200 text-sm"
                >
                  Back to Fridge
                </button>
              </div>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-light mb-4">No recipes match this filter.</p>
              <button 
                onClick={() => setActiveFilter("All")}
                className="text-primary font-medium underline"
              >
                View all recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onSelect={handleSelectRecipe} 
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
