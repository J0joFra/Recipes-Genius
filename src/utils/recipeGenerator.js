export async function generateRecipesWithAI(ingredients) {
  const prompt = `Sei uno chef professionista. Basandoti su questi ingredienti: ${ingredients.join(', ')}, suggerisci 3 ricette creative e deliziose che possono essere preparate principalmente usando questi ingredienti (puoi includere ingredienti comuni come sale, pepe, olio, ecc.).

Per ogni ricetta, fornisci:
- Un nome creativo
- Una breve descrizione appetitosa (1-2 frasi)
- Livello di difficoltà (Facile, Medio o Difficile)
- Tempo di cottura stimato
- Numero di porzioni
- Lista completa degli ingredienti con quantità
- Istruzioni passo-passo (chiare e dettagliate)
- Un consiglio utile dello chef
- Calorie stimate per porzione

Rendi le ricette diverse - una veloce/facile, una più elaborata e una creativa inaspettata.

Rispondi SOLO con un oggetto JSON valido in questo formato esatto:
{
  "recipes": [
    {
      "name": "nome ricetta",
      "description": "descrizione",
      "difficulty": "Facile/Medio/Difficile",
      "cooking_time": "30 minuti",
      "servings": "4 porzioni",
      "calories": "350 kcal",
      "ingredients": ["ingrediente 1", "ingrediente 2"],
      "instructions": ["passo 1", "passo 2"],
      "tips": "consiglio dello chef"
    }
  ]
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      const result = JSON.parse(jsonMatch[0]);
      return result?.recipes || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error generating recipes:', error);
    return null;
  }
}