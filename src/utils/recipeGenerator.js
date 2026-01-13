const SPOONACULAR_API_KEY = 'f25d7708e56a49d788142c38a197588d';

export async function generateRecipesWithAI(ingredients) {
  try {
    // Cerca ricette basate sugli ingredienti
    const searchUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${ingredients.join(',')}&number=3&ranking=2&ignorePantry=true`;
    
    const searchResponse = await fetch(searchUrl);
    const recipes = await searchResponse.json();

    if (!recipes || recipes.length === 0) {
      return null;
    }

    // Per ogni ricetta, ottieni i dettagli completi
    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const detailUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
        const detailResponse = await fetch(detailUrl);
        const details = await detailResponse.json();

        // Estrai istruzioni
        let instructions = [];
        if (details.analyzedInstructions && details.analyzedInstructions.length > 0) {
          instructions = details.analyzedInstructions[0].steps.map(step => step.step);
        } else if (details.instructions) {
          // Se non ci sono istruzioni strutturate, usa il testo libero
          instructions = [details.instructions];
        } else {
          instructions = ["Segui le istruzioni sulla confezione degli ingredienti"];
        }

        // Mappa gli ingredienti con quantità
        const ingredientsList = details.extendedIngredients.map(ing => 
          `${ing.original}`
        );

        // Determina difficoltà basata sul tempo di preparazione
        let difficulty = "Facile";
        const totalTime = (details.preparationMinutes || 0) + (details.cookingMinutes || 0);
        if (totalTime > 60) difficulty = "Difficile";
        else if (totalTime > 30) difficulty = "Medio";

        return {
          name: details.title,
          description: details.summary ? 
            details.summary.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 
            'Una deliziosa ricetta da provare!',
          difficulty: difficulty,
          cooking_time: `${details.readyInMinutes || 30} minuti`,
          servings: `${details.servings || 4} porzioni`,
          calories: details.nutrition?.nutrients?.find(n => n.name === "Calories")?.amount 
            ? `${Math.round(details.nutrition.nutrients.find(n => n.name === "Calories").amount)} kcal` 
            : "N/D",
          ingredients: ingredientsList,
          instructions: instructions,
          tips: details.tips || "Usa ingredienti freschi per un risultato migliore!",
          image_url: details.image
        };
      })
    );

    return detailedRecipes;

  } catch (error) {
    console.error('Errore Spoonacular API:', error);
    
    // Fallback con ricette mock se l'API fallisce
    return getMockRecipes(ingredients);
  }
}

// Funzione di fallback con ricette mock
function getMockRecipes(ingredients) {
  return [
    {
      name: `Delizia di ${ingredients[0] || 'ingredienti'}`,
      description: `Un piatto straordinario che esalta il sapore naturale degli ingredienti freschi. Perfetto per un pranzo leggero ma saporito.`,
      difficulty: "Facile",
      cooking_time: "20 minuti",
      servings: "2 porzioni",
      calories: "320 kcal",
      ingredients: [
        `${ingredients[0] || 'ingrediente principale'} - 200g`,
        `${ingredients[1] || 'secondo ingrediente'} - 150g`,
        "Olio d'oliva - 2 cucchiai",
        "Sale e pepe q.b.",
        "Aglio - 1 spicchio"
      ],
      instructions: [
        "Lava e prepara tutti gli ingredienti, tagliandoli a pezzetti uniformi.",
        "In una padella, scalda l'olio d'oliva con l'aglio schiacciato.",
        "Aggiungi gli ingredienti principali e cuoci a fuoco medio per 10 minuti.",
        "Aggiusta di sale e pepe, mescola bene.",
        "Servi caldo, guarnendo con erbe fresche a piacere."
      ],
      tips: "Per un risultato migliore, usa ingredienti di stagione e di ottima qualità.",
      image_url: null
    },
    {
      name: `Piatto Gourmet agli ${ingredients[0] || 'ingredienti'}`,
      description: `Una ricetta raffinata che richiede un po' più di attenzione, ma il risultato è degno di un ristorante stellato.`,
      difficulty: "Medio",
      cooking_time: "45 minuti",
      servings: "4 porzioni",
      calories: "480 kcal",
      ingredients: [
        `${ingredients[0] || 'ingrediente principale'} - 400g`,
        `${ingredients[1] || 'secondo ingrediente'} - 200g`,
        "Vino bianco - 100ml",
        "Burro - 50g",
        "Panna fresca - 200ml"
      ],
      instructions: [
        "Prepara tutti gli ingredienti lavandoli e tagliandoli finemente.",
        "In una casseruola, fai sciogliere il burro a fuoco medio.",
        "Aggiungi gli ingredienti principali e rosolali per 5 minuti.",
        "Sfuma con il vino bianco e lascia evaporare.",
        "Aggiungi la panna e cuoci a fuoco dolce per 15-20 minuti."
      ],
      tips: "La chiave è la mantecatura finale per creare una crema vellutata.",
      image_url: null
    },
    {
      name: `Fusion Creativa con ${ingredients.join(' e ')}`,
      description: `Un'interpretazione moderna e audace che combina sapori tradizionali con tecniche innovative.`,
      difficulty: "Difficile",
      cooking_time: "1 ora e 15 minuti",
      servings: "6 porzioni",
      calories: "550 kcal",
      ingredients: [
        `${ingredients[0] || 'ingrediente principale'} - 500g`,
        `${ingredients[1] || 'secondo ingrediente'} - 300g`,
        "Zenzero fresco - 30g",
        "Salsa di soia - 3 cucchiai",
        "Miele - 2 cucchiai"
      ],
      instructions: [
        "Prepara una marinata con salsa di soia, miele e zenzero.",
        "Marina gli ingredienti per 30 minuti.",
        "Scalda un wok a fuoco alto.",
        "Cuoci gli ingredienti marinati rapidamente.",
        "Servi decorando con semi di sesamo."
      ],
      tips: "Il segreto è mantenere la padella molto calda per il 'wok hei' perfetto.",
      image_url: null
    }
  ];
}