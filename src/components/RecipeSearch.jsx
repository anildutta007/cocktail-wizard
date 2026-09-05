import { useState, useEffect } from 'react';
import { searchByName, getAllBases, getAllCocktails, getCocktailsByBase } from '../utils/database';
import RecipeDetail from './RecipeDetail';
import CocktailCard from './CocktailCard';

export default function RecipeSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBase, setSelectedBase] = useState('all');
  const [availableBases, setAvailableBases] = useState([]);
  const [availableCocktails, setAvailableCocktails] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCocktail, setSelectedCocktail] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const bases = getAllBases().sort();
    setAvailableBases(bases);
    // Load cocktails for initial base (all)
    setAvailableCocktails(getCocktailsByBase('all'));
  }, []);

  useEffect(() => {
    // Update available cocktails when base changes
    setAvailableCocktails(getCocktailsByBase(selectedBase));
  }, [selectedBase]);

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setResults([]);
      setSearched(false);
      return;
    }
    let found = searchByName(searchQuery);

    // Filter by selected base if not 'all'
    if (selectedBase !== 'all') {
      found = found.filter(c => c.base === selectedBase);
    }

    setResults(found);
    setSearched(true);
  };

  const handleSelectCocktailFromDropdown = (cocktail) => {
    setSelectedCocktail(cocktail);
    setSearched(false);
    setSearchQuery('');
    setResults([]);
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-cocktail-gold">Search by Name</h2>

        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-4 rounded-lg mb-4 space-y-4">
          <div>
            <label className="block text-cocktail-gold font-semibold mb-2">Spirit Type</label>
            <select
              value={selectedBase}
              onChange={(e) => {
                setSelectedBase(e.target.value);
                if (searched) {
                  handleSearch(); // Re-search with new filter
                }
              }}
              className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
            >
              <option value="all">All Types</option>
              {availableBases.map(base => (
                <option key={base} value={base} className="bg-cocktail-dark">
                  {baseEmojis[base] || '🍸'} {base.charAt(0).toUpperCase() + base.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-cocktail-gold font-semibold mb-2">Available Cocktails</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const cocktailId = parseInt(e.target.value);
                  const cocktail = availableCocktails.find(c => c.id === cocktailId);
                  if (cocktail) {
                    handleSelectCocktailFromDropdown(cocktail);
                  }
                  e.target.value = '';
                }
              }}
              className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
            >
              <option value="">
                Select a {selectedBase === 'all' ? 'cocktail' : selectedBase} drink...
              </option>
              {availableCocktails.map(cocktail => (
                <option key={cocktail.id} value={cocktail.id.toString()} className="bg-cocktail-dark">
                  {cocktail.name}
                </option>
              ))}
            </select>
            {availableCocktails.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {availableCocktails.length} cocktail{availableCocktails.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          <div>
            <label className="block text-cocktail-gold font-semibold mb-2">Or Search by Name</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Margarita, Mojito, Old Fashioned..."
              className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-gradient-to-r from-cocktail-gold to-cocktail-accent hover:opacity-90 text-cocktail-dark font-bold py-3 rounded-lg transition"
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
