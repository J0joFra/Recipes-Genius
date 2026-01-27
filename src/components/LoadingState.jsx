import React from 'react';
import { ChefHat } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="text-center mt-16">
      <div className="inline-flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-alabaster-grey border-t-prussian-blue animate-spin" />
          <ChefHat className="h-6 w-6 text-prussian-blue absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-dusty-denim">Il nostro chef AI sta creando ricette per te...</p>
      </div>
    </div>
  );
}