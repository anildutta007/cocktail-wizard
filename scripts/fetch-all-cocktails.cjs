const fs = require('fs');
const https = require('https');

const COCKTAIL_DB_API = 'https://www.thecocktaildb.com/api/json/v1/1';

function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function getFlavorProfile(drink) {
  const flavors = new Set();
  const text = `${drink.strDrink} ${drink.strCategory} ${drink.strInstructions || ''}`.toLowerCase();

  if (text.includes('sweet') || text.includes('syrup') || text.includes('juice')) flavors.add('sweet');
  if (text.includes('sour') || text.includes('lime') || text.includes('lemon')) flavors.add('sour');
  if (text.includes('bitter') || text.includes('bitters') || text.includes('campari')) flavors.add('bitter');
  if (text.includes('fresh') || text.includes('mint') || text.includes('herb')) flavors.add('fresh');
  if (text.includes('tropical') || text.includes('coconut') || text.includes('pineapple')) flavors.add('tropical');
  if (text.includes('fruity') || text.includes('fruit') || text.includes('berry')) flavors.add('fruity');
  if (text.includes('spicy') || text.includes('jalapeño')) flavors.add('spicy');
  if (text.includes('smoky') || text.includes('smoke') || text.includes('mezcal')) flavors.add('smoky');

  return Array.from(flavors).slice(0, 3) || ['balanced'];
}

function getBaseSpiritFromDrink(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    if (ingredient) ingredients.push(ingredient.toLowerCase());
  }

  const ingredientStr = ingredients.join(' ');
  
  if (ingredientStr.includes('vodka')) return 'vodka';
  if (ingredientStr.includes('gin')) return 'gin';
  if (ingredientStr.includes('rum')) return 'rum';
  if (ingredientStr.includes('whisky') || ingredientStr.includes('whiskey')) return 'whisky';
  if (ingredientStr.includes('tequila')) return 'tequila';
  if (ingredientStr.includes('brandy')) return 'brandy';
  if (ingredientStr.includes('sake')) return 'sake';
  if (ingredientStr.includes('mezcal')) return 'mezcal';
  if (ingredientStr.includes('champagne') || ingredientStr.includes('prosecco')) return 'champagne';
  
  const hasSpirit = ['vodka', 'gin', 'rum', 'whisky', 'tequila', 'brandy', 'sake'].some(s => ingredientStr.includes(s));
  return hasSpirit ? 'mixed' : 'mocktail';
}

function convertIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    
    if (ingredient) {
      const amount = measure ? parseFloat(measure) || 0.5 : 0.5;
      const unit = measure ? measure.trim() : 'oz';
      
      ingredients.push({
        name: ingredient.trim(),
        amount: amount,
        unit: unit
      });
    }
  }
  return ingredients;
}

async function fetchAllCocktails() {
  try {
    console.log('🍹 Fetching cocktails from TheCocktailDB...\n');

    const allCocktails = new Map();
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const searchTerms = ['vodka', 'gin', 'rum', 'whisky', 'tequila', 'brandy', 'mojito', 'martini', 'margarita'];
    
    let total = 0;

    // Search by first letter
    for (const letter of letters) {
      try {
        const response = await fetchFromAPI(`${COCKTAIL_DB_API}/search.php?s=${letter}`);
        
        if (response.drinks) {
          for (const drink of response.drinks) {
            if (!allCocktails.has(drink.idDrink)) {
              allCocktails.set(drink.idDrink, drink);
              total++;
            }
          }
        }
        process.stdout.write(`\r  ⏳ Found ${total} cocktails so far...`);
      } catch (e) {
        // Continue on error
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Search by ingredient
    for (const term of searchTerms) {
      try {
        const response = await fetchFromAPI(`${COCKTAIL_DB_API}/search.php?i=${term}`);
        
        if (response.drinks) {
          for (const drink of response.drinks) {
            if (!allCocktails.has(drink.idDrink)) {
              allCocktails.set(drink.idDrink, drink);
              total++;
            }
          }
        }
        process.stdout.write(`\r  ⏳ Found ${total} cocktails so far...`);
      } catch (e) {
        // Continue on error
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log(`\n\n✅ Total found: ${total} unique cocktails\n`);

    const cocktails = [];
    let processed = 0;

    for (const drink of allCocktails.values()) {
      if (processed >= 500) break; // Limit to 500

      try {
        const fullDrink = drink;
        const instructions = fullDrink.strInstructions || 'Mix ingredients and serve.';
        
        const cocktail = {
          id: cocktails.length + 1,
          name: fullDrink.strDrink,
          base: getBaseSpiritFromDrink(fullDrink),
          ingredients: convertIngredients(fullDrink),
          instructions: instructions,
          flavorProfile: getFlavorProfile(fullDrink),
          difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
          image: fullDrink.strDrinkThumb || ''
        };

        // Only include if has ingredients
        if (cocktail.ingredients.length > 0) {
          cocktails.push(cocktail);
          processed++;

          if (processed % 100 === 0) {
            console.log(`  ⏳ Processed: ${processed}/500`);
          }
        }
      } catch (e) {
        // Skip on error
      }
    }

    const output = { cocktails };
    const outputPath = './src/data/cocktails.json';
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`\n✅ Successfully saved ${cocktails.length} cocktails!`);
    console.log(`📁 Saved to: ${outputPath}\n`);
    
    const baseCount = {};
    cocktails.forEach(c => {
      baseCount[c.base] = (baseCount[c.base] || 0) + 1;
    });
    
    console.log('📊 Cocktails by Base Spirit:');
    Object.entries(baseCount).sort((a, b) => b[1] - a[1]).forEach(([base, count]) => {
      console.log(`  ${base}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fetchAllCocktails();
