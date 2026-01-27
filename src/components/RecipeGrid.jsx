import React from 'react';
import RecipeCard from './RecipeCard';
import { Sparkles } from 'lucide-react';

export default function RecipeGrid({ recipes, onRecipeClick }) {
  if (!recipes || recipes.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-vanilla-cream rounded-full text-hunter-green text-sm mb-4">
          <Sparkles className="h-4 w-4" />
          Ricette Generate dall'AI
        </div>
        <h2 className="text-3xl md:text-4xl font-light text-hunter-green">
          Ecco cosa puoi preparare
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <RecipeCard
            key={index}
            recipe={recipe}
            index={index}
            onClick={() => onRecipeClick(recipe)}
          />
        ))}
      </div>
    </div>
  );
}