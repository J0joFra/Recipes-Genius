import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';

export default function IngredientInput({ ingredients, setIngredients, onGenerateRecipes, isGenerating }) {
  const [inputValue, setInputValue] = useState('');

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-16">
      <div className="bg-white rounded-3xl shadow-xl shadow-alabaster-grey/50 p-8 border border-alabaster-grey">
        <label className="block text-sm font-semibold text-dusty-denim mb-4">
          I tuoi ingredienti
        </label>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Es: pomodori, mozzarella, basilico..."
            className="flex-1 px-4 py-3 rounded-xl border border-dusty-denim focus:border-prussian-blue focus:ring-2 focus:ring-prussian-blue/20 outline-none transition-all"
          />
          <button
            onClick={addIngredient}
            className="px-6 py-3 bg-prussian-blue text-white rounded-xl hover:bg-dusk-blue transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </button>
        </div>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 bg-alabaster-grey text-prussian-blue rounded-full text-sm font-medium"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="hover:bg-dusty-denim rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onGenerateRecipes}
          disabled={ingredients.length === 0 || isGenerating}
          className="w-full py-4 bg-gradient-to-r from-prussian-blue to-dusk-blue text-white rounded-xl font-semibold hover:from-dusk-blue hover:to-prussian-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-prussian-blue/50"
        >
          {isGenerating ? (
            <>
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generazione in corso...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Genera Ricette con AI
            </>
          )}
        </button>
      </div>
    </div>
  );
}