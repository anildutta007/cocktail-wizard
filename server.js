import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Disable caching for dynamic content and HTML files
app.use((req, res, next) => {
  // Prevent caching of HTML and API responses
  if (req.path.endsWith('.html') || req.path.startsWith('/api/')) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Proxy endpoint for Claude API calls
app.post('/api/suggest-cocktails', async (req, res) => {
  try {
    if (!CLAUDE_API_KEY) {
      return res.status(400).json({
        error: 'API key not configured. Set CLAUDE_API_KEY in environment variables.'
      });
    }

    const { query, cocktails } = req.body;

    if (!query || !cocktails) {
      return res.status(400).json({ error: 'Missing query or cocktails' });
    }

    const cocktailList = cocktails
      .map(c => `${c.name} (${c.base}) - Flavors: ${c.flavorProfile.join(', ')}`)
      .join('\n');

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are a bartender. Based on this query: "${query}", suggest cocktails from this list:\n\n${cocktailList}\n\nReturn ONLY the names of 3-5 best matching cocktails, one per line. No explanations.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ error: 'API request failed' });
    }

    const data = await response.json();
    const suggestions = data.content[0].text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());

    res.json({ suggestions });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Proxy endpoint for flavor-based filtering
app.post('/api/filter-by-flavor', async (req, res) => {
  try {
    if (!CLAUDE_API_KEY) {
      return res.status(400).json({
        error: 'API key not configured'
      });
    }

    const { baseSpirit, requirements, cocktails } = req.body;

    if (!baseSpirit || !requirements || !cocktails) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const cocktailList = cocktails
      .filter(c => c.base === baseSpirit || c.base === 'mixed')
      .map(c => `${c.name} - Flavors: ${c.flavorProfile.join(', ')}`)
      .join('\n');

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `As a bartender, filter these ${baseSpirit}-based cocktails based on: ${requirements}\n\n${cocktailList}\n\nReturn ONLY the names of the 3-5 best matches, one per line.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ error: 'API request failed' });
    }

    const data = await response.json();
    const filtered = data.content[0].text
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.trim());

    res.json({ filtered });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Image recognition endpoint for ingredient detection
app.post('/api/recognize-ingredients', async (req, res) => {
  try {
    if (!CLAUDE_API_KEY) {
      return res.status(400).json({
        error: 'API key not configured'
      });
    }

    const { image, mediaType } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType || 'image/jpeg',
                  data: image,
                },
              },
              {
                type: 'text',
                text: 'Look at this image and identify all cocktail/drink ingredients you can see. Return ONLY a comma-separated list of ingredient names (no descriptions, no quantities). Focus on spirits, juices, mixers, and garnishes. If you see bottles, identify what\'s inside them. Return the list only, nothing else.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ error: 'Image analysis failed' });
    }

    const data = await response.json();
    const ingredientText = data.content[0].text;

    // Parse the comma-separated list
    const ingredients = ingredientText
      .split(',')
      .map(i => i.trim().toLowerCase())
      .filter(i => i.length > 0);

    res.json({ ingredients });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', apiConfigured: !!CLAUDE_API_KEY });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/suggest-cocktails`);
  console.log(`   POST /api/filter-by-flavor`);
  console.log(`   GET  /api/health`);
  console.log(`🔑 API Key configured: ${!!CLAUDE_API_KEY}`);
});
