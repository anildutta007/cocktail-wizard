import { useState } from 'react';
import { unitToML } from '../utils/unitConversion';
import { isLiquidIngredient } from '../utils/ingredientTypes';

export default function RecipeDetail({ cocktail }) {
  const [showML, setShowML] = useState(false);

  const difficultyEmojis = {
    easy: '⭐',
    medium: '⭐⭐',
    hard: '⭐⭐⭐',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Image and Info */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 space-y-4">
          <div className="bg-gradient-to-r from-cocktail-gold to-cocktail-accent rounded-lg overflow-hidden h-80 flex items-center justify-center">
            {cocktail.image ? (
              <img
                src={cocktail.image}
                alt={cocktail.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-gradient-to-r', 'from-cocktail-gold', 'to-cocktail-accent');
                }}
              />
            ) : (
              <div className="text-8xl">🍸</div>
            )}
          </div>

          <div className="bg-cocktail-purple bg-opacity-50 border border-cocktail-gold p-4 rounded-lg space-y-3">
            <div>
              <p className="text-cocktail-gold text-sm font-semibold">BASE SPIRIT</p>
              <p className="text-cocktail-light capitalize text-lg font-bold">{cocktail.base}</p>
            </div>

            <div>
              <p className="text-cocktail-gold text-sm font-semibold">DIFFICULTY</p>
              <p className="text-cocktail-light text-lg">
                {difficultyEmojis[cocktail.difficulty] || '⭐'} {cocktail.difficulty}
              </p>
            </div>

            <div>
              <p className="text-cocktail-gold text-sm font-semibold">FLAVOR PROFILE</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {cocktail.flavorProfile.map((flavor, idx) => (
                  <span
                    key={idx}
                    className="bg-cocktail-accent bg-opacity-30 text-cocktail-accent text-xs px-2 py-1 rounded capitalize"
                  >
                    {flavor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-cocktail-gold mb-2">{cocktail.name}</h1>
          <p className="text-gray-400">A classic cocktail recipe</p>
        </div>

        {/* Ingredients */}
        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-6 rounded-lg border border-cocktail-gold">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cocktail-gold">Ingredients</h2>
            <button
              onClick={() => setShowML(!showML)}
              className="text-xs bg-cocktail-gold bg-opacity-20 text-cocktail-gold px-3 py-1 rounded hover:bg-opacity-40 transition"
            >
              {showML ? 'Show Original' : 'Show ML'}
            </button>
          </div>
          <div className="space-y-3">
            {cocktail.ingredients.map((ingredient, idx) => {
              const isLiquid = isLiquidIngredient(ingredient.name);
              const mlValue = isLiquid ? unitToML(`${ingredient.amount} ${ingredient.unit}`) : null;
              return (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 bg-cocktail-dark bg-opacity-50 rounded border border-cocktail-gold border-opacity-30"
                >
                  <span className="text-cocktail-light capitalize font-medium">
                    {ingredient.name}
                  </span>
                  <span className="text-cocktail-gold font-bold">
                    {showML && mlValue ? (
                      <span>{mlValue}</span>
                    ) : (
                      <span>{ingredient.amount} {ingredient.unit}</span>
                    )}
                    {!showML && mlValue && (
                      <span className="text-xs text-gray-400 ml-2">({mlValue})</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-6 rounded-lg border border-cocktail-gold">
          <h2 className="text-2xl font-bold text-cocktail-gold mb-4">How to Make It</h2>
          <div className="space-y-4">
            {cocktail.instructions.split('.').map((step, idx) => {
              const trimmed = step.trim();
              return trimmed ? (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cocktail-gold text-cocktail-dark flex items-center justify-center font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-cocktail-light pt-1">{trimmed}.</p>
                </div>
              ) : null;
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-cocktail-accent bg-opacity-10 border border-cocktail-accent p-6 rounded-lg">
          <h3 className="text-lg font-bold text-cocktail-accent mb-2">💡 Pro Tips</h3>
          <ul className="text-cocktail-light space-y-2 text-sm">
            <li>• Always use fresh ingredients for the best taste</li>
            <li>• Chill your glass before pouring</li>
            <li>• Use quality spirits - they make a difference</li>
            <li>• Fresh citrus juice is always better than bottled</li>
            <li>• Don't over-dilute with ice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
