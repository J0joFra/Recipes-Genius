import React from 'react';
import { ChefHat } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center mb-12 md:mb-16">
      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-prussian-blue to-dusk-blue shadow-lg shadow-prussian-blue/50 mb-6">
        <ChefHat className="h-8 w-8 text-white" />
      </div>
      <h1 className="text-4xl md:text-6xl font-light text-ink-black mb-4 tracking-tight">
        Recipe <span className="text-prussian-blue">Genius</span>
      </h1>
      <p className="text-dusty-denim text-lg max-w-md mx-auto">
        Trasforma i tuoi ingredienti in capolavori culinari con l'AI
      </p>
    </div>
  );
}