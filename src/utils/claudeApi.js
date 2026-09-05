// Claude API integration for advanced cocktail suggestions
// Calls secure backend proxy to keep API key private

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const generateCocktailSuggestions = async (userQuery, cocktails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/suggest-cocktails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userQuery,
        cocktails: cocktails,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('API error:', error);
      return null;
    }

    const data = await response.json();
    return data.suggestions || null;
  } catch (error) {
    console.warn('Error calling API:', error);
    return null;
  }
};

export const filterByFlavor = async (baseSpirit, flavorRequirements, cocktails) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/filter-by-flavor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        baseSpirit,
        requirements: flavorRequirements,
        cocktails,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.warn('API error:', error);
      return null;
    }

    const data = await response.json();
    return data.filtered || null;
  } catch (error) {
    console.warn('Error calling API:', error);
    return null;
  }
};
