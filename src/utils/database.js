import cocktailsData from '../data/cocktails.json';

// Initialize local database on first load
export const initDatabase = async () => {
  try {
    const existing = localStorage.getItem('cocktails_db');
    if (!existing) {
      localStorage.setItem('cocktails_db', JSON.stringify(cocktailsData.cocktails));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Get all cocktails from local storage
export const getAllCocktails = () => {
  try {
    const data = localStorage.getItem('cocktails_db');
    return data ? JSON.parse(data) : cocktailsData.cocktails;
  } catch (error) {
    console.error('Error getting cocktails:', error);
    return cocktailsData.cocktails;
  }
};

// Search cocktails by name
export const searchByName = (query) => {
  const cocktails = getAllCocktails();
  return cocktails.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );
};

// Search cocktails by ingredients - shows cocktails you can make with available ingredients
export const searchByIngredients = (userIngredients) => {
  const cocktails = getAllCocktails();
  const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase());

  const results = cocktails
    .map(cocktail => {
      const cocktailIngredients = cocktail.ingredients.map(i => i.name.toLowerCase());

      // Count how many ingredients the user has
      let matchedCount = 0;
      const missingIngredients = [];

      cocktailIngredients.forEach(ci => {
        const hasIngredient = normalizedUserIngredients.some(
          ui => ci.includes(ui) || ui.includes(ci)
        );

        if (hasIngredient) {
          matchedCount++;
        } else {
          missingIngredients.push(ci);
        }
      });

      // Only show cocktails where user has at least the base spirit + 1 more ingredient
      const hasBaseSpirit = normalizedUserIngredients.some(ui =>
        cocktail.base.toLowerCase().includes(ui) || ui.includes(cocktail.base.toLowerCase())
      );

      if (hasBaseSpirit && matchedCount >= 1) {
        return {
          ...cocktail,
          matchedCount,
          totalIngredients: cocktailIngredients.length,
          missingIngredients,
          matchPercentage: Math.round((matchedCount / cocktailIngredients.length) * 100)
        };
      }
      return null;
    })
    .filter(c => c !== null)
    .sort((a, b) => {
      // Sort by match percentage (descending)
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      // Then by number of matched ingredients
      return b.matchedCount - a.matchedCount;
    });

  return results;
};

// Get top cocktails by base spirit (limit defaults to 10)
export const getTopByBase = (base, limit = 10) => {
  const cocktails = getAllCocktails();
  return cocktails.filter(c => c.base === base).slice(0, limit);
};

// Get ALL cocktails by base spirit (not just top 5)
export const getCocktailsByBase = (base) => {
  const cocktails = getAllCocktails();
  if (base === 'all') {
    return cocktails.sort((a, b) => a.name.localeCompare(b.name));
  }
  return cocktails
    .filter(c => c.base === base)
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Get all unique spirits
export const getAllBases = () => {
  const cocktails = getAllCocktails();
  return [...new Set(cocktails.map(c => c.base))];
};

// Get cocktail by name
export const getCocktailByName = (name) => {
  const cocktails = getAllCocktails();
  return cocktails.find(c => c.name.toLowerCase() === name.toLowerCase());
};

// Search by flavor profile
export const searchByFlavorProfile = (flavors) => {
  const cocktails = getAllCocktails();
  return cocktails.filter(cocktail =>
    flavors.some(flavor =>
      cocktail.flavorProfile.some(pf => pf.toLowerCase().includes(flavor.toLowerCase()))
    )
  );
};
