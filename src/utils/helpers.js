export function getDifficultyColor(difficulty) {
  switch(difficulty?.toLowerCase()) {
    case 'facile':
      return 'bg-green-100 text-green-700';
    case 'medio':
      return 'bg-yellow-100 text-yellow-700';
    case 'difficile':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}