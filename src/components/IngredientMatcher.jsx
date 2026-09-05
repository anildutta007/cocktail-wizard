import { useState } from 'react';
import { searchByIngredients } from '../utils/database';
import CocktailCard from './CocktailCard';

export default function IngredientMatcher() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const commonIngredients = [
    'gin', 'vodka', 'rum', 'whisky', 'tequila', 'brandy',
    'lime juice', 'lemon juice', 'simple syrup', 'tonic water',
    'cola', 'ginger beer', 'cranberry juice', 'orange juice',
    'mint', 'sugar', 'ice', 'club soda', 'bitters', 'vermouth'
  ];

  const handleAddIngredient = (ingredient) => {
    if (!ingredients.includes(ingredient)) {
      setIngredients([...ingredients, ingredient]);
      setInputValue('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleSearch = () => {
    if (ingredients.length === 0) {
      setResults([]);
      setSearched(false);
      return;
    }
    const found = searchByIngredients(ingredients);
    setResults(found);
    setSearched(true);
  };

  const filteredSuggestions = commonIngredients.filter(
    ingredient =>
      ingredient.includes(inputValue.toLowerCase()) &&
      !ingredients.includes(ingredient)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-cocktail-gold">What You Have</h2>

        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-4 rounded-lg mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                handleAddIngredient(inputValue.trim());
              }
            }}
            placeholder="Type an ingredient..."
            className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
          />

          {inputValue && filteredSuggestions.length > 0 && (
            <div className="mt-2 bg-cocktail-dark rounded border border-cocktail-gold max-h-40 overflow-y-auto">
              {filteredSuggestions.map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleAddIngredient(suggestion)}
                  className="block w-full text-left px-4 py-2 hover:bg-cocktail-purple text-cocktail-light transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {ingredients.map(ingredient => (
            <span
              key={ingredient}
              className="bg-cocktail-gold text-cocktail-dark px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
            >
              {ingredient}
              <button
                onClick={() => handleRemoveIngredient(ingredient)}
                className="hover:text-cocktail-purple font-bold"
              >
                ✕
              </button>
            </span>
          ))}
        </div>

        <button
          onClick={handleSearch}
          disabled={ingredients.length === 0}
          className="w-full bg-gradient-to-r from-cocktail-gold to-cocktail-accent hover:opacity-90 disabled:opacity-50 text-cocktail-dark font-bold py-3 rounded-lg transition"
        >
          Find Cocktails ({ingredients.length} ingredients)
        </button>
      </div>

      {searched && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cocktail-gold">
            {results.length} Cocktails Found
          </h3>
          {results.length === 0 ? (
            <div className="bg-cocktail-purple bg-opacity-30 border border-cocktail-gold p-6 rounded-lg text-center">
              <p className="text-cocktail-light">
                No cocktails found with these ingredients. Try adding more!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map(cocktail => (
                <CocktailCard key={cocktail.id} cocktail={cocktail} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
