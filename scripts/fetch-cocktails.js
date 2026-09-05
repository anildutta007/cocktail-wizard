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
  const text = `${drink.strDrink} ${drink.strCategory} ${drink.strInstructions}`.toLowerCase();

  if (text.includes('sweet') || text.includes('syrup') || text.includes('juice')) flavors.add('sweet');
  if (text.includes('sour') || text.includes('lime') || text.includes('lemon')) flavors.add('sour');
  if (text.includes('bitter') || text.includes('bitters')) flavors.add('bitter');
  if (text.includes('fresh') || text.includes('mint')) flavors.add('fresh');
  if (text.includes('tropical') || text.includes('coconut')) flavors.add('tropical');
  if (text.includes('fruity') || text.includes('fruit')) flavors.add('fruity');

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
  
  const hasSpirit = ['vodka', 'gin', 'rum', 'whisky', 'tequila', 'brandy', 'sake'].some(s => ingredientStr.includes(s));
  return hasSpirit ? 'mixed' : 'mocktail';
}

function convertIngredients(drink) {
  const ingredients = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}`];
    const measure = drink[`strMeasure${i}`];
    
    if (ingredient) {
      ingredients.push({
        name: ingredient.trim(),
        amount: measure ? parseFloat(measure) || 0.5 : 0.5,
        unit: measure ? (measure.trim().split(' ')[0] || 'oz') : 'oz'
      });
    }
  }
  return ingredients;
}

async function fetchAllCocktails() {
  try {
    console.log('🍹 Fetching cocktails from TheCocktailDB...\n');

    const allDrinksResponse = await fetchFromAPI(`${COCKTAIL_DB_API}/search.php?s=a`);
    
    if (!allDrinksResponse.drinks) {
      console.log('Error: Could not fetch drinks');
      return;
    }

    const drinks = allDrinksResponse.drinks.slice(0, 500);
    console.log(`✅ Found ${drinks.length} cocktails\n`);

    const cocktails = [];
    let processed = 0;

    for (let i = 0; i < drinks.length; i++) {
      const drink = drinks[i];
      
      try {
        const detailResponse = await fetchFromAPI(
          `${COCKTAIL_DB_API}/lookup.php?i=${drink.idDrink}`
        );

        if (detailResponse.drinks && detailResponse.drinks.length > 0) {
          const fullDrink = detailResponse.drinks[0];
          
          const cocktail = {
            id: cocktails.length + 1,
            name: fullDrink.strDrink,
            base: getBaseSpiritFromDrink(fullDrink),
            ingredients: convertIngredients(fullDrink),
            instructions: fullDrink.strInstructions || 'Mix ingredients and serve.',
            flavorProfile: getFlavorProfile(fullDrink),
            difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)],
            image: fullDrink.strDrinkThumb || ''
          };

          cocktails.push(cocktail);
          processed++;

          if (processed % 50 === 0) {
            console.log(`  ⏳ Processed: ${processed}/${drinks.length}`);
          }
        }
      } catch (e) {
        console.log(`  ⚠️ Error processing drink ${i + 1}`);
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const output = { cocktails };
    const outputPath = './src/data/cocktails.json';
    
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`\n✅ Successfully saved ${cocktails.length} cocktails!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    const baseCount = {};
    cocktails.forEach(c => {
      baseCount[c.base] = (baseCount[c.base] || 0) + 1;
    });
    
    console.log('\n📊 Cocktails by Base Spirit:');
    Object.entries(baseCount).sort((a, b) => b[1] - a[1]).forEach(([base, count]) => {
      console.log(`  ${base}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fetchAllCocktails();
