import { useState } from 'react';
import { getAllBases, getAllCocktails, getCocktailByName } from '../utils/database';
import { filterByFlavor } from '../utils/claudeApi';
import CocktailCard from './CocktailCard';

export default function AdvancedFilter() {
  const [selectedBase, setSelectedBase] = useState('vodka');
  const [flavorQuery, setFlavorQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const bases = getAllBases().sort();

  const handleSearch = async () => {
    if (!selectedBase || !flavorQuery.trim()) {
      return;
    }

    setLoading(true);
    setSearched(true);

    if (useAI) {
      // Use Claude API for advanced filtering
      const aiResults = await filterByFlavor(selectedBase, flavorQuery, getAllCocktails());

      if (aiResults && aiResults.length > 0) {
        const cocktails = getAllCocktails();
        const matched = aiResults
          .map(name => cocktails.find(c => c.name.toLowerCase() === name.toLowerCase()))
          .filter(Boolean);
        setResults(matched);
      } else {
        // Fallback to local filtering
        localSearch();
      }
    } else {
      localSearch();
    }

    setLoading(false);
  };

  const localSearch = () => {
    const cocktails = getAllCocktails();
    const baseFiltered = cocktails.filter(
      c => c.base === selectedBase || c.base === 'mixed'
    );

    const queryWords = flavorQuery.toLowerCase().split(' ');
    const scored = baseFiltered.map(cocktail => {
      let score = 0;

      // Check flavor profile matches
      queryWords.forEach(word => {
        if (cocktail.flavorProfile.some(f => f.toLowerCase().includes(word))) {
          score += 2;
        }
        if (cocktail.name.toLowerCase().includes(word)) {
          score += 1;
        }
      });

      return { cocktail, score };
    });

    const filtered = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.cocktail)
      .slice(0, 5);

    setResults(filtered);
  };

  const baseEmojis = {
    gin: '🌿',
    vodka: '❄️',
    rum: '🥥',
    whisky: '🥃',
    tequila: '🌵',
    mocktail: '🎉',
    mixed: '🍹',
    aperol: '✨',
    amaretto: '🤎',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-4 text-cocktail-gold">Custom Suggestions</h2>
        <p className="text-cocktail-light mb-6 text-sm">
          Describe what you want: "sweet but not sour", "fruity and refreshing", "smooth and warming"
        </p>

        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-6 rounded-lg space-y-4">
          <div>
            <label className="block text-cocktail-gold font-semibold mb-2">Base Spirit</label>
            <select
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
            >
              {bases.map(base => (
                <option key={base} value={base} className="bg-cocktail-dark">
                  {baseEmojis[base]} {base.charAt(0).toUpperCase() + base.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-cocktail-gold font-semibold mb-2">Your Requirements</label>
            <textarea
              value={flavorQuery}
              onChange={(e) => setFlavorQuery(e.target.value)}
              placeholder="e.g., sweet, not sour, fruity, refreshing, light, strong..."
              className="w-full px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cocktail-gold resize-none h-20"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="useAI"
              checked={useAI}
              onChange={(e) => setUseAI(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="useAI" className="text-cocktail-light text-sm">
              Use AI for smarter matching (requires API key)
            </label>
          </div>

          <button
            onClick={handleSearch}
            disabled={!selectedBase || !flavorQuery.trim() || loading}
            className="w-full bg-gradient-to-r from-cocktail-gold to-cocktail-accent hover:opacity-90 disabled:opacity-50 text-cocktail-dark font-bold py-3 rounded-lg transition"
          >
            {loading ? 'Searching...' : 'Find Cocktails'}
          </button>
        </div>
      </div>

      {searched && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cocktail-gold">
            {results.length} Cocktails Matched
          </h3>
          {results.length === 0 ? (
            <div className="bg-cocktail-purple bg-opacity-30 border border-cocktail-gold p-6 rounded-lg text-center">
              <p className="text-cocktail-light">
                No cocktails found matching your criteria. Try adjusting your requirements!
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
