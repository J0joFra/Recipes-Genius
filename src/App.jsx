import React, { useState } from 'react';
import Header from './components/Header';
import IngredientInput from './components/IngredientInput';
import RecipeGrid from './components/RecipeGrid';
import RecipeModal from './components/RecipeModal';
import LoadingState from './components/LoadingState';
import { generateRecipesWithAI } from './utils/recipeGenerator';

export default function App() {
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleGenerateRecipes = async () => {
    if (ingredients.length === 0) return;
    
    setIsGenerating(true);
    setRecipes([]);

    const generatedRecipes = await generateRecipesWithAI(ingredients);
    
    if (generatedRecipes) {
      setRecipes(generatedRecipes);
    }

    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 px-4 py-12 md:py-20 max-w-7xl mx-auto">
        <Header />

        <IngredientInput
          ingredients={ingredients}
          setIngredients={setIngredients}
          onGenerateRecipes={handleGenerateRecipes}
          isGenerating={isGenerating}
        />

        {isGenerating && <LoadingState />}

        {recipes.length > 0 && (
          <RecipeGrid 
            recipes={recipes} 
            onRecipeClick={setSelectedRecipe} 
          />
        )}

        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      </div>
    </div>
  );
}