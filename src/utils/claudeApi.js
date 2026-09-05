// Claude API integration for advanced cocktail suggestions
// Uses Claude Fable (lowest cost model) for AI-powered features

const API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export const generateCocktailSuggestions = async (userQuery, cocktails) => {
  try {
    if (!API_KEY) {
      console.warn('Claude API key not configured. Falling back to local suggestions.');
      return null;
    }

    const cocktailList = cocktails
      .map(c => `${c.name} (${c.base}) - Flavors: ${c.flavorProfile.join(', ')}`)
      .join('\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022', // Lowest cost model
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a bartender. Based on this query: "${userQuery}", suggest cocktails from this list:\n\n${cocktailList}\n\nReturn ONLY the names of 3-5 best matching cocktails, one per line. No explanations.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return null;
    }

    const data = await response.json();
    const suggestions = data.content[0].text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());

    return suggestions;
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return null;
  }
};

export const filterByFlavor = async (baseSpirit, flavorRequirements, cocktails) => {
  try {
    if (!API_KEY) {
      console.warn('Claude API key not configured. Using local filtering.');
      return null;
    }

    const cocktailList = cocktails
      .filter(c => c.base === baseSpirit || c.base === 'mixed')
      .map(c => `${c.name} - Flavors: ${c.flavorProfile.join(', ')}`)
      .join('\n');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022', // Lowest cost model
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `As a bartender, filter these ${baseSpirit}-based cocktails based on: ${flavorRequirements}\n\n${cocktailList}\n\nReturn ONLY the names of the 3-5 best matches, one per line.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return null;
    }

    const data = await response.json();
    const filtered = data.content[0].text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());

    return filtered;
  } catch (error) {
    console.error('Error filtering with Claude API:', error);
    return null;
  }
};
