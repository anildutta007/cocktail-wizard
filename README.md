# 🍸 Cocktail Wizard

A smart web app that helps you discover and make amazing cocktails based on what you have!

## Features

### 🥃 What I Have
- Input the ingredients you have available
- Get instant suggestions for cocktails you can make
- Auto-complete suggestions for common ingredients

### 📖 Search Recipe
- Search for cocktails by name
- Get detailed recipes with ingredients and instructions
- View flavor profiles and difficulty levels

### ⭐ Top Picks
- Browse top 5 cocktails for each spirit base
- Explore Gin, Vodka, Rum, Whisky, Tequila, and Mocktails
- Discover popular drinks by category

### ✨ Custom Suggestions
- Describe what you want (e.g., "sweet but not sour")
- Filter by base spirit
- Get AI-powered suggestions (optional)

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Local Storage**: IndexedDB for cocktail database
- **AI Integration**: Claude Fable API (lowest cost)
- **Styling**: Tailwind CSS with custom cocktail theme

## Setup Instructions

### 1. Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### 2. Installation

```bash
cd cocktail-app
npm install
```

### 3. Environment Setup (Optional - for AI features)

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Add your Claude API key:

```
VITE_CLAUDE_API_KEY=sk-ant-...
```

Get your API key from: https://console.anthropic.com/account/keys

### 4. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Quick Start

1. Open the app (npm run dev)
2. Try "What I Have" feature first:
   - Add some ingredients (vodka, lime juice, etc.)
   - Click "Find Cocktails"
   - See what you can make!

3. Explore other features:
   - Search by name (e.g., "Margarita")
   - Browse top picks by spirit
   - Use custom filters for specific tastes

## Project Structure

```
cocktail-app/
├── src/
│   ├── components/
│   │   ├── IngredientMatcher.jsx
│   │   ├── RecipeSearch.jsx
│   │   ├── TopSuggestions.jsx
│   │   ├── AdvancedFilter.jsx
│   │   ├── CocktailCard.jsx
│   │   └── RecipeDetail.jsx
│   ├── data/
│   │   └── cocktails.json (20+ cocktails)
│   ├── utils/
│   │   ├── database.js
│   │   └── claudeApi.js
│   └── App.jsx
├── .env.example
└── README.md
```

## Features

### ✅ 4 Main Features

1. **Ingredient Matcher** - Find cocktails by ingredients you have
2. **Recipe Search** - Search and view full recipes
3. **Top Suggestions** - Browse best cocktails by spirit base
4. **Custom Filter** - AI-powered smart filtering (optional)

### ✅ Cost Optimization

- 90% features use local database (free)
- Advanced queries use Claude Fable (very cheap)
- Falls back to local search if API fails
- No server required - runs entirely in browser

### ✅ Beautiful UI

- Cocktail bar theme with gold & purple
- Responsive design (mobile, tablet, desktop)
- Smooth animations & transitions
- High-quality cocktail images

## Troubleshooting

**Database not loading?**
- Clear browser cache
- Check localStorage is enabled
- Look at browser console (F12)

**Images not showing?**
- Check internet connection
- Fallback emoji will display

**API errors?**
- App works without API key (features fallback to local)
- Check .env.local has correct key format

## Get Your API Key (Optional)

1. Go to https://console.anthropic.com/account/keys
2. Click "Create Key"
3. Copy the key
4. Add to `.env.local`: `VITE_CLAUDE_API_KEY=sk-ant-...`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Ideas

- User accounts & favorites
- Share recipes
- Video tutorials
- Shopping list
- PWA (offline mode)
- Multi-language support

---

🍹 **Drink Responsibly!** Created with ❤️
