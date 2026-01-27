import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Sparkles, Globe, Check, Loader2, Languages, Copy } from 'lucide-react';

const TRANSLATION_SERVICE = 'google';

const translateWithGoogle = async (text, sourceLang = 'it', targetLang = 'en') => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Estrai il testo tradotto dalla risposta complessa di Google
    if (data && Array.isArray(data[0])) {
      const translatedText = data[0]
        .map(item => item[0]) // Prendi il testo tradotto da ogni segmento
        .filter(Boolean) // Rimuovi valori nulli
        .join(''); // Unisci tutti i segmenti
      
      return translatedText || text; // Fallback al testo originale se vuoto
    }
    
    return text; // Fallback al testo originale
  } catch (error) {
    console.error('Google Translate error:', error);
    
    // Fallback simple dictionary
    const fallbackDict = {
      'pomodoro': 'tomato', 'pomodori': 'tomatoes',
      'cipolla': 'onion', 'cipolle': 'onions',
      'aglio': 'garlic', 'carota': 'carrot',
      'patata': 'potato', 'zucchina': 'zucchini',
      'melanzana': 'eggplant', 'peperone': 'bell pepper',
      'pollo': 'chicken', 'manzo': 'beef',
      'pesce': 'fish', 'uova': 'eggs',
      'latte': 'milk', 'formaggio': 'cheese',
      'pasta': 'pasta', 'riso': 'rice',
      'olio': 'oil', 'sale': 'salt',
      'pepe': 'pepper', 'zucchero': 'sugar',
      'acqua': 'water', 'vino': 'wine',
      'basilico': 'basil', 'prezzemolo': 'parsley',
      'rosmarino': 'rosemary', 'origano': 'oregano'
    };
    
    const lowerText = text.toLowerCase();
    return fallbackDict[lowerText] || text;
  }
};

const translateIngredient = async (ingredient) => {
  const lowerIngredient = ingredient.toLowerCase().trim();
  
  try {
    const translatedText = await translateWithGoogle(ingredient);
    
    return {
      original: ingredient,
      translated: translatedText,
      wasTranslated: true,
      method: 'google'
    };
  } catch (error) {
    console.error(`Translation failed for "${ingredient}":`, error);
    return {
      original: ingredient,
      translated: ingredient,
      wasTranslated: false,
      method: 'none'
    };
  }
};

// Hook per la traduzione automatica con rate limiting
const useAutoTranslateIngredients = (ingredients) => {
  const [translatedIngredients, setTranslatedIngredients] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastTranslationTime, setLastTranslationTime] = useState(0);

  const translateAllIngredients = useCallback(async (ingredientsList) => {
    if (ingredientsList.length === 0) {
      setTranslatedIngredients([]);
      return;
    }

    // Rate limiting: aspetta almeno 100ms tra le traduzioni
    const now = Date.now();
    const timeSinceLast = now - lastTranslationTime;
    if (timeSinceLast < 500) {
      await new Promise(resolve => setTimeout(resolve, 500 - timeSinceLast));
    }

    setIsTranslating(true);

    try {
      // Traduci tutti gli ingredienti in parallelo
      const translationPromises = ingredientsList.map(ingredient => 
        translateIngredient(ingredient)
      );

      const results = await Promise.all(translationPromises);
      setTranslatedIngredients(results);
      setLastTranslationTime(Date.now());
    } catch (error) {
      console.error('Bulk translation error:', error);
      
      // In caso di errore, crea array fallback
      setTranslatedIngredients(
        ingredientsList.map(ingredient => ({
          original: ingredient,
          translated: ingredient,
          wasTranslated: false,
          method: 'error'
        }))
      );
    } finally {
      setIsTranslating(false);
    }
  }, [lastTranslationTime]);

  useEffect(() => {
    const timer = setTimeout(() => {
      translateAllIngredients(ingredients);
    }, 300); // Debounce di 300ms

    return () => clearTimeout(timer);
  }, [ingredients, translateAllIngredients]);

  // Ottieni solo gli ingredienti tradotti in inglese
  const getEnglishIngredients = () => {
    return translatedIngredients.map(item => item.translated.toLowerCase());
  };

  // Statistiche della traduzione
  const getTranslationStats = () => {
    const total = translatedIngredients.length;
    const successful = translatedIngredients.filter(item => item.wasTranslated).length;
    return { 
      total, 
      successful, 
      failed: total - successful,
      percentage: total > 0 ? Math.round((successful / total) * 100) : 0 
    };
  };

  return {
    englishIngredients: getEnglishIngredients(),
    translatedInfo: translatedIngredients,
    isTranslating,
    translationStats: getTranslationStats(),
    retryTranslation: () => translateAllIngredients(ingredients)
  };
};

export default function IngredientInput({ 
  ingredients, 
  setIngredients, 
  onGenerateRecipes, 
  isGenerating 
}) {
  const [inputValue, setInputValue] = useState('');
  const [showTranslationPanel, setShowTranslationPanel] = useState(true);
  const [inputLanguage, setInputLanguage] = useState('it');
  const [isPasting, setIsPasting] = useState(false);

  // Usa l'hook di traduzione
  const { 
    englishIngredients, 
    translatedInfo, 
    isTranslating, 
    translationStats,
    retryTranslation
  } = useAutoTranslateIngredients(ingredients);

  const addIngredient = () => {
    const trimmed = inputValue.trim();
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

  const handleGenerate = () => {
    if (englishIngredients.length > 0) {
      onGenerateRecipes(englishIngredients);
    }
  };

  const clearAllIngredients = () => {
    setIngredients([]);
  };

  // Aggiungi ingredienti da testo separato da virgole
  const handlePasteIngredients = () => {
    setIsPasting(true);
    const pasteText = prompt('Incolla gli ingredienti (separati da virgole, punti e virgola o a capo):');
    
    if (pasteText) {
      const newIngredients = pasteText
        .split(/[,;\n]/)
        .map(ing => ing.trim())
        .filter(ing => 
          ing.length > 0 && 
          !ingredients.includes(ing) &&
          !ing.match(/^\d/) // Filtra numeri
        )
        .slice(0, 20); // Limite a 20 ingredienti per volta
      
      if (newIngredients.length > 0) {
        setIngredients([...ingredients, ...newIngredients]);
      }
    }
    setIsPasting(false);
  };

  // Aggiungi ingredienti di esempio
  const addExampleIngredients = () => {
    const examples = [
      'pomodori',
      'mozzarella',
      'basilico',
      'olio d\'oliva',
      'aglio',
      'pasta',
      'parmigiano'
    ];
    
    const newIngredients = examples.filter(ing => !ingredients.includes(ing));
    if (newIngredients.length > 0) {
      setIngredients([...ingredients, ...newIngredients]);
    }
  };

  // Copia gli ingredienti tradotti
  const copyTranslatedIngredients = () => {
    const textToCopy = translatedInfo
      .map(item => `${item.original} → ${item.translated}`)
      .join('\n');
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert('Traduzioni copiate negli appunti!');
      })
      .catch(err => {
        console.error('Errore nella copia:', err);
      });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-16">
      <div className="bg-white rounded-3xl shadow-xl shadow-vanilla-cream/50 p-8 border border-vanilla-cream">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold text-hunter-green">
              Inserisci i tuoi ingredienti
            </h2>
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-sage-green" />
              <select
                value={inputLanguage}
                onChange={(e) => setInputLanguage(e.target.value)}
                className="text-xs border border-sage-green rounded px-2 py-1 bg-white"
              >
                <option value="it">Italiano 🇮🇹</option>
                <option value="en">English 🇬🇧</option>
                <option value="fr">Français 🇫🇷</option>
                <option value="es">Español 🇪🇸</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-sage-green">
            Scrivi gli ingredienti in qualsiasi lingua. Li tradurremo automaticamente in inglese per cercare le migliori ricette!
          </p>
        </div>

        {/* Input principale */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Esempio: ${inputLanguage === 'it' ? 'pomodori, mozzarella, basilico' : 'tomatoes, cheese, basil'}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-sage-green focus:border-hunter-green focus:ring-2 focus:ring-hunter-green/20 outline-none transition-all"
            disabled={isPasting}
          />
          <button
            onClick={addIngredient}
            disabled={!inputValue.trim() || isPasting}
            className="px-6 py-3 bg-hunter-green text-white rounded-xl hover:bg-sage-green transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            Aggiungi
          </button>
        </div>

        {/* Pulsanti rapidi */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={addExampleIngredients}
            disabled={isPasting}
            className="px-3 py-2 text-xs bg-vanilla-cream text-hunter-green rounded-lg hover:bg-sage-green/20 transition-colors disabled:opacity-50"
          >
            + Ingredienti esempio
          </button>
          <button
            onClick={handlePasteIngredients}
            disabled={isPasting}
            className="px-3 py-2 text-xs bg-vanilla-cream text-hunter-green rounded-lg hover:bg-sage-green/20 transition-colors disabled:opacity-50"
          >
            {isPasting ? 'Incollando...' : '+ Incolla lista'}
          </button>
        </div>

        {ingredients.length > 0 && (
          <div className="space-y-6 mb-6">
            {/* Ingredienti inseriti */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-sage-green">
                    I tuoi ingredienti
                  </h3>
                  <span className="text-xs bg-hunter-green text-white px-2 py-1 rounded-full">
                    {ingredients.length}
                  </span>
                  {isTranslating && (
                    <Loader2 className="h-3 w-3 text-blue-500 animate-spin" />
                  )}
                </div>
                
                <button
                  onClick={() => setShowTranslationPanel(!showTranslationPanel)}
                  className="text-xs text-sage-green hover:text-hunter-green transition-colors flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {showTranslationPanel ? 'Nascondi traduzioni' : 'Mostra traduzioni'}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-vanilla-cream text-hunter-green rounded-full text-sm font-medium"
                  >
                    {ingredient}
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="hover:bg-sage-green rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Pannello traduzioni (sempre visibile) */}
            <div className={`transition-all duration-300 ${showTranslationPanel ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-semibold text-blue-700">
                      Traduzione automatica in inglese
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={copyTranslatedIngredients}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      title="Copia traduzioni"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    
                    {translationStats.total > 0 && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        translationStats.percentage === 100 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {translationStats.percentage}% tradotto
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Lista traduzioni */}
                <div className="space-y-2 mb-3 max-h-60 overflow-y-auto pr-2">
                  {translatedInfo.map((item, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-2 rounded-lg ${
                        item.wasTranslated 
                          ? 'bg-green-50 border border-green-100' 
                          : 'bg-yellow-50 border border-yellow-100'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-gray-600">{item.original}</div>
                        <div className={`font-medium truncate ${
                          item.wasTranslated ? 'text-green-700' : 'text-yellow-700'
                        }`}>
                          {item.translated}
                        </div>
                      </div>
                      {item.wasTranslated ? (
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                      ) : (
                        <span className="text-xs text-yellow-600 flex-shrink-0 mt-1">No trad</span>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Footer traduzioni */}
                <div className="flex justify-between items-center text-xs text-blue-600">
                  <div className="flex items-center gap-2">
                    <span>Google Translate</span>
                    {translationStats.failed > 0 && !isTranslating && (
                      <button
                        onClick={retryTranslation}
                        className="hover:text-blue-800 underline"
                      >
                        Riprova ({translationStats.failed})
                      </button>
                    )}
                  </div>
                  <span>
                    {englishIngredients.length} ingredienti pronti per la ricerca
                  </span>
                </div>
              </div>
            </div>

            {/* Pulsanti azioni */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <button
                onClick={clearAllIngredients}
                className="text-sm text-gray-500 hover:text-hunter-green transition-colors flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Cancella tutto
              </button>
              
              <div className="text-xs text-gray-500">
                {isTranslating ? 'Traduzione in corso...' : 'Pronto per generare ricette'}
              </div>
            </div>
          </div>
        )}

        {/* Pulsante principale */}
        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            disabled={ingredients.length === 0 || isGenerating || isTranslating}
            className="w-full py-4 bg-gradient-to-r from-hunter-green to-sage-green text-white rounded-xl font-semibold hover:from-sage-green hover:to-hunter-green disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-hunter-green/50"
          >
            {isGenerating ? (
              <>
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generazione in corso...
              </>
            ) : isTranslating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Traduzione...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Genera Ricette con AI
              </>
            )}
          </button>

          {/* Info footer */}
          <div className="text-xs text-gray-500 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Globe className="h-3 w-3 text-green-600" />
              <span className="font-medium text-green-600">
                Traduzione automatica attiva
              </span>
            </div>
            <p className="text-gray-400">
              Gli ingredienti verranno tradotti in inglese per una ricerca ottimale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
