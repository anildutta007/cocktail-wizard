// List of solid/non-liquid ingredients that shouldn't show ML conversion
const SOLID_INGREDIENTS = new Set([
  // Fruits
  'cherry',
  'cherries',
  'lemon',
  'lime',
  'orange',
  'apple',
  'pineapple',
  'strawberry',
  'strawberries',
  'raspberry',
  'raspberries',
  'blueberry',
  'blueberries',
  'blackberry',
  'blackberries',
  'grape',
  'grapes',
  'melon',
  'watermelon',
  'mango',
  'peach',
  'plum',
  'berry',
  'berries',
  'fruit',
  'coconut',
  'pineapple juice',
  'mint',
  'basil',
  'thyme',
  'rosemary',
  'sage',

  // Ice and solids
  'ice',
  'cubed ice',
  'crushed ice',
  'ice cube',
  'ice cubes',
  'cracked ice',

  // Garnishes
  'olive',
  'olives',
  'twist',
  'peel',
  'slice',
  'spiral',
  'wheel',
  'zest',
  'sprig',
  'leaf',
  'leaves',
  'wedge',
  'wedges',
  'sugar cube',
  'sugar cubes',
  'candy',
  'tablet',
  'egg',
  'eggs',
  'egg white',
  'egg yolk',
  'nutmeg',
  'cinnamon',
  'star anise',
  'clove',
  'cloves',
  'cinnamon stick',
  'cinnamon sticks',
  'ginger',
  'jalapeño',
  'habanero',
  'chili',

  // Other solids
  'salt',
  'sugar',
  'powder',
  'cocoa',
  'chocolate',
  'cocoa powder',
  'whipped cream',
  'cream',
  'caviar',
  'anchovy',
  'anchovy paste',
]);

export function isLiquidIngredient(ingredientName) {
  const name = ingredientName.toLowerCase().trim();

  // Special cases: liquids that contain solid fruit names
  const liquidKeywords = ['juice', 'extract', 'syrup', 'liqueur', 'liquor', 'bitters', 'spirit', 'alcohol', 'cordial'];
  if (liquidKeywords.some(keyword => name.includes(keyword))) {
    return true;
  }

  // Check against solid ingredients list
  if (SOLID_INGREDIENTS.has(name)) {
    return false;
  }

  // Check for partial matches (e.g., "Fresh Cherry" contains "cherry")
  for (const solid of SOLID_INGREDIENTS) {
    if (name.includes(solid) && !liquidKeywords.some(kw => name.includes(kw))) {
      return false;
    }
  }

  // Everything else is considered a liquid (spirits, juices, syrups, bitters, etc.)
  return true;
}

export { SOLID_INGREDIENTS };
