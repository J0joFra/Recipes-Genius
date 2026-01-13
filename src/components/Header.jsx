import React from 'react';
import { ChefHat } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-12 md:mb-16">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-200/50 mb-6">
        <ChefHat className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-4 tracking-tight">
        Recipe <span className="text-orange-600">Genius</span>
      </h1>
      <p className="text-gray-500 text-lg max-w-md mx-auto">
        Trasforma i tuoi ingredienti in capolavori culinari con l'AI
      </p>
    </div>
  );
}