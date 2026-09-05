import { useEffect, useState } from 'react';
import { initDatabase } from './utils/database';
import { speakWelcomeMessage } from './utils/speechSynthesis';
import IngredientMatcher from './components/IngredientMatcher';
import RecipeSearch from './components/RecipeSearch';
import TopSuggestions from './components/TopSuggestions';
import AdvancedFilter from './components/AdvancedFilter';
import Logo from './components/Logo';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('matcher');
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => {
      setDbReady(true);
      // Play welcome message after a short delay to ensure app is loaded
      setTimeout(() => {
        speakWelcomeMessage('Welcome to Dutta Cocktail Wizard!! Enjoy!!');
      }, 500);
    });
  }, []);

  if (!dbReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cocktail-dark via-cocktail-purple to-cocktail-dark flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div style={{ width: '80px', height: '80px' }}>
              <Logo />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-cocktail-gold mb-2">Cocktail Wizard</h1>
          <p className="text-cocktail-accent text-sm font-semibold mb-4">by Dutta</p>
          <p className="text-cocktail-light">Loading your cocktail database...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'matcher', label: 'What I Have', icon: '🥃' },
    { id: 'search', label: 'Search Recipe', icon: '📖' },
    { id: 'suggestions', label: 'Top Picks', icon: '⭐' },
    { id: 'advanced', label: 'Custom', icon: '✨' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cocktail-dark via-cocktail-purple to-cocktail-dark text-cocktail-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple border-b border-cocktail-gold shadow-2xl shadow-cocktail-gold/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="text-3xl font-bold text-cocktail-gold font-serif">Cocktail Wizard</h1>
                <p className="text-cocktail-light text-sm">Find & Mix Perfect Drinks</p>
                <p className="text-cocktail-accent text-xs font-semibold mt-1">by Dutta</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cocktail-gold to-cocktail-accent text-cocktail-dark'
                    : 'bg-cocktail-purple bg-opacity-50 border border-cocktail-gold text-cocktail-light hover:bg-opacity-75'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'matcher' && <IngredientMatcher />}
        {activeTab === 'search' && <RecipeSearch />}
        {activeTab === 'suggestions' && <TopSuggestions />}
        {activeTab === 'advanced' && <AdvancedFilter />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple border-t border-cocktail-gold mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm mb-2">
            🍹 Craft the perfect cocktail with Cocktail Wizard | Drink Responsibly 🍹
          </p>
          <p className="text-cocktail-accent text-xs">
            Created with ❤️ by <span className="font-bold">Anil Dutta</span> | All cocktail data sourced from TheCocktailDB
          </p>
        </div>
      </footer>
    </div>
  );
}
