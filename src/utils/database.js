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

// Search cocktails by ingredients
export const searchByIngredients = (userIngredients) => {
  const cocktails = getAllCocktails();
  const normalizedUserIngredients = userIngredients.map(i => i.toLowerCase());

  return cocktails.filter(cocktail => {
    const cocktailIngredients = cocktail.ingredients.map(i => i.name.toLowerCase());
    return cocktailIngredients.every(ci =>
      normalizedUserIngredients.some(ui => ci.includes(ui) || ui.includes(ci))
    );
  });
};

// Get top cocktails by base spirit
export const getTopByBase = (base) => {
  const cocktails = getAllCocktails();
  return cocktails.filter(c => c.base === base).slice(0, 5);
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
