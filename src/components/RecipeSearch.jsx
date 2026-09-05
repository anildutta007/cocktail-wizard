import { useState } from 'react';
import { searchByName } from '../utils/database';
import RecipeDetail from './RecipeDetail';
import CocktailCard from './CocktailCard';

export default function RecipeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setResults([]);
      setSearched(false);
      return;
    }
    const found = searchByName(searchQuery);
    setResults(found);
    setSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (selectedCocktail) {
    return (
      <div>
        <button
          onClick={() => setSelectedCocktail(null)}
          className="mb-4 bg-cocktail-gold text-cocktail-dark px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          ← Back to Results
        </button>
        <RecipeDetail cocktail={selectedCocktail} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-cocktail-gold">Search by Name</h2>

        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-4 rounded-lg mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Margarita, Mojito, Old Fashioned..."
            className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
          />

          <button
            onClick={handleSearch}
            className="w-full mt-4 bg-gradient-to-r from-cocktail-gold to-cocktail-accent hover:opacity-90 text-cocktail-dark font-bold py-3 rounded-lg transition"
          >
            Search Recipe
          </button>
        </div>
      </div>

      {searched && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cocktail-gold">
            {results.length} Results Found
          </h3>
          {results.length === 0 ? (
            <div className="bg-cocktail-purple bg-opacity-30 border border-cocktail-gold p-6 rounded-lg text-center">
              <p className="text-cocktail-light">
                No cocktails found matching "{searchQuery}". Try a different name!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(cocktail => (
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
  );
}
