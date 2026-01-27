import React from 'react';
import { ChefHat, Clock, Users, Flame, ArrowRight } from 'lucide-react';
import { getDifficultyColor } from '../utils/helpers';

export default function RecipeCard({ recipe, onClick, index }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-alabaster-grey hover:border-prussian-blue">
        {/* Image Placeholder */}
        <div className="relative h-52 bg-gradient-to-br from-alabaster-grey to-dusty-denim flex items-center justify-center">
          <ChefHat className="h-16 w-16 text-prussian-blue" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Difficulty Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
              {recipe.difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-ink-black mb-2 group-hover:text-prussian-blue transition-colors">
            {recipe.name}
          </h3>
          <p className="text-dusty-denim text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>

          {/* Info Row */}
          <div className="flex items-center gap-4 text-xs text-dusty-denim mb-4">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{recipe.cooking_time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{recipe.servings}</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5" />
              <span>{recipe.calories}</span>
            </div>
          </div>

          {/* View Recipe Button */}
          <button className="w-full py-2.5 border-2 border-orange-500 text-orange-600 rounded-xl font-medium hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 group-hover:gap-3">
            Vedi Ricetta
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}