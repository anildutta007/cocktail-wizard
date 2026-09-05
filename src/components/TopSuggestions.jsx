import { useState, useEffect } from 'react';
import { getAllBases, getTopByBase } from '../utils/database';
import CocktailCard from './CocktailCard';
import RecipeDetail from './RecipeDetail';

export default function TopSuggestions() {
  const [bases, setBases] = useState([]);
  const [selectedBase, setSelectedBase] = useState(null);
  const [topCocktails, setTopCocktails] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  useEffect(() => {
    const availableBases = getAllBases().sort();
    setBases(availableBases);
    if (availableBases.length > 0) {
      const defaultBase = availableBases[0];
      setSelectedBase(defaultBase);
      setTopCocktails(getTopByBase(defaultBase));
    }
  }, []);

  const handleBaseSelect = (base) => {
    setSelectedBase(base);
    setTopCocktails(getTopByBase(base));
  };

  const baseEmojis = {
    gin: '🌿',
    vodka: '❄️',
    rum: '🥥',
    whisky: '🥃',
    tequila: '🌵',
    mocktail: '🎉',
    brandy: '🍷',
    champagne: '🥂',
  };

  if (selectedCocktail) {
    return (
      <div>
        <button
          onClick={() => setSelectedCocktail(null)}
          className="mb-4 bg-cocktail-gold text-cocktail-dark px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          ← Back to Top Picks
        </button>
        <RecipeDetail cocktail={selectedCocktail} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-cocktail-gold">Top Suggestions</h2>
        <p className="text-cocktail-light mb-4 text-sm">
          Discover the most popular cocktails for each spirit base
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {bases.map(base => (
            <button
              key={base}
              onClick={() => handleBaseSelect(base)}
              className={`p-4 rounded-lg font-semibold transition capitalize text-center ${
                selectedBase === base
                  ? 'bg-gradient-to-r from-cocktail-gold to-cocktail-accent text-cocktail-dark'
                  : 'bg-cocktail-purple bg-opacity-50 border border-cocktail-gold text-cocktail-light hover:bg-opacity-75'
              }`}
            >
              <div className="text-2xl mb-1">{baseEmojis[base] || '🍸'}</div>
              {base}
            </button>
          ))}
        </div>

        {selectedBase && (
          <div>
            <h3 className="text-2xl font-bold mb-4 text-cocktail-gold capitalize">
              Top {selectedBase} Cocktails
            </h3>
            {topCocktails.length === 0 ? (
              <div className="bg-cocktail-purple bg-opacity-30 border border-cocktail-gold p-6 rounded-lg text-center">
                <p className="text-cocktail-light">No cocktails found for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topCocktails.map(cocktail => (
                  <div
                    key={cocktail.id}
                    onClick={() => setSelectedCocktail(cocktail)}
                    className="cursor-pointer"
                  >
                    <CocktailCard cocktail={cocktail} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
