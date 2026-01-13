import React from 'react';
import { X, ChefHat, Clock, Users, Flame, Check } from 'lucide-react';
import { getDifficultyColor } from '../utils/helpers';

export default function RecipeModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl max-h-[90vh] overflow-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Section */}
        <div className="relative h-64 bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
          <ChefHat className="h-24 w-24 text-orange-300" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{recipe.name}</h2>
            <p className="text-gray-600 mb-4">{recipe.description}</p>
            
            {/* Info Pills */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {recipe.cooking_time}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 flex items-center gap-2">
                <Users className="h-4 w-4" />
                {recipe.servings}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700 flex items-center gap-2">
                <Flame className="h-4 w-4" />
                {recipe.calories}
              </span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Ingredienti
            </h3>
            <div className="bg-orange-50 rounded-2xl p-6">
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700">
                    <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Istruzioni
            </h3>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-gray-700 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Chef's Tip */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
            <div className="flex items-start gap-3">
              <ChefHat className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Consiglio dello Chef</h4>
                <p className="text-gray-700">{recipe.tips}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}