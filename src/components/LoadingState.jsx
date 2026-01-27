import React from 'react';
import { ChefHat } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="text-center mt-16">
      <div className="inline-flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-vanilla-cream border-t-hunter-green animate-spin" />
          <ChefHat className="h-6 w-6 text-hunter-green absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sage-green">Il nostro chef AI sta creando ricette per te...</p>
      </div>
    </div>
  );
}