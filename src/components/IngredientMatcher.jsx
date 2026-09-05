import { useState, useRef } from 'react';
import { searchByIngredients } from '../utils/database';
import { startVoiceRecognition, recognizeIngredientsFromImage, parseIngredientsFromText } from '../utils/aiRecognition';
import CocktailCard from './CocktailCard';

export default function IngredientMatcher() {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const cameraInputRef = useRef(null);
  const recognitionRef = useRef(null);

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

  const handleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const recognition = startVoiceRecognition(
      (transcript) => {
        const foundIngredients = parseIngredientsFromText(transcript);
        foundIngredients.forEach(ing => {
          if (!ingredients.includes(ing)) {
            setIngredients(prev => [...prev, ing]);
          }
        });
        setIsListening(false);
      },
      (error) => {
        console.error(error);
        setIsListening(false);
        alert(`Voice recognition error: ${error}`);
      }
    );
    recognitionRef.current = recognition;
  };

  const handleCameraCapture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    try {
      const recognizedIngredients = await recognizeIngredientsFromImage(file);
      recognizedIngredients.forEach(ing => {
        const normalizedIng = ing.toLowerCase().trim();
        if (!ingredients.includes(normalizedIng)) {
          setIngredients(prev => [...prev, normalizedIng]);
        }
      });
    } catch (error) {
      console.error('Image recognition error:', error);
      alert(`Failed to recognize ingredients: ${error.message}`);
    } finally {
      setIsAnalyzingImage(false);
      // Reset input so same file can be selected again
      event.target.value = '';
    }
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

        <div className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple p-4 rounded-lg mb-4 space-y-3">
          <div className="flex gap-2">
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
              className="flex-1 px-4 py-2 rounded bg-cocktail-dark border border-cocktail-gold text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cocktail-gold"
            />

            {/* Voice Input Button */}
            <button
              onClick={handleVoiceInput}
              title={isListening ? 'Stop listening' : 'Speak ingredients'}
              className={`px-4 py-2 rounded font-semibold transition ${
                isListening
                  ? 'bg-cocktail-accent text-white animate-pulse'
                  : 'bg-cocktail-gold text-cocktail-dark hover:opacity-90'
              }`}
            >
              {isListening ? '🎤 Listening...' : '🎤'}
            </button>

            {/* Camera Input Button */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              disabled={isAnalyzingImage}
              title="Take photo of ingredients"
              className={`px-4 py-2 rounded font-semibold transition ${
                isAnalyzingImage
                  ? 'bg-gray-500 text-white opacity-50 cursor-not-allowed'
                  : 'bg-cocktail-gold text-cocktail-dark hover:opacity-90'
              }`}
            >
              {isAnalyzingImage ? '📷 Analyzing...' : '📷'}
            </button>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              onChange={handleCameraCapture}
              hidden
            />
          </div>

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
            {results.length} Cocktails You Can Make
          </h3>
          {results.length === 0 ? (
            <div className="bg-cocktail-purple bg-opacity-30 border border-cocktail-gold p-6 rounded-lg text-center">
              <p className="text-cocktail-light">
                Add at least one ingredient + the base spirit to find cocktails you can make!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map(cocktail => (
                <div
                  key={cocktail.id}
                  className="bg-gradient-to-r from-cocktail-dark to-cocktail-purple border border-cocktail-gold rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-xl font-bold text-cocktail-gold">{cocktail.name}</h4>
                      <p className="text-sm text-gray-400 capitalize">{cocktail.base}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cocktail-accent">
                        {cocktail.matchPercentage}%
                      </div>
                      <div className="text-xs text-gray-400">
                        {cocktail.matchedCount} of {cocktail.totalIngredients}
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-cocktail-dark rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cocktail-gold to-cocktail-accent h-full"
                      style={{ width: `${cocktail.matchPercentage}%` }}
                    />
                  </div>

                  {/* Missing ingredients */}
                  {cocktail.missingIngredients.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-cocktail-gold mb-1">
                        Missing ({cocktail.missingIngredients.length}):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cocktail.missingIngredients.map((ingredient, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-cocktail-accent bg-opacity-20 text-cocktail-accent px-2 py-1 rounded capitalize"
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Flavor profile */}
                  <div className="flex flex-wrap gap-1">
                    {cocktail.flavorProfile.map((flavor, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-cocktail-gold bg-opacity-20 text-cocktail-gold px-2 py-1 rounded capitalize"
                      >
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
