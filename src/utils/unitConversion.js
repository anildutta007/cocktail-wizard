// Conversion factors to ML
const CONVERSIONS = {
  'shot': 30,
  'shots': 30,
  'oz': 29.5735,
  'ounce': 29.5735,
  'ounces': 29.5735,
  'ml': 1,
  'milliliter': 1,
  'milliliters': 1,
  'l': 1000,
  'liter': 1000,
  'liters': 1000,
  'cup': 236.588,
  'cups': 236.588,
  'tbsp': 14.787,
  'tablespoon': 14.787,
  'tablespoons': 14.787,
  'tsp': 4.929,
  'teaspoon': 4.929,
  'teaspoons': 4.929,
  'dash': 0.616,
  'dashes': 0.616,
  'splash': 10,
  'splashes': 10,
  'drop': 0.05,
  'drops': 0.05,
  'pint': 473.176,
  'pints': 473.176,
  'quart': 946.353,
  'quarts': 946.353,
};

// Parse a measurement string and convert to ML
export const convertToML = (unitString) => {
  if (!unitString) return null;

  const str = unitString.toLowerCase().trim();

  // Try to extract amount and unit from strings like "1 3/4 shot", "2 oz", "50 ml"
  const match = str.match(/^([0-9./\s]+)([a-z\s]+)?$/);

  if (!match) return null;

  const amountStr = match[1].trim();
  const unitStr = (match[2] || '').trim();

  // Parse the amount (handle fractions like "1 3/4")
  let amount = 0;
  const parts = amountStr.split(/\s+/);

  for (const part of parts) {
    if (part.includes('/')) {
      const [num, den] = part.split('/');
      amount += parseFloat(num) / parseFloat(den);
    } else {
      amount += parseFloat(part);
    }
  }

  // Find matching unit conversion
  let conversionFactor = 1;
  for (const [unitKey, factor] of Object.entries(CONVERSIONS)) {
    if (unitStr.includes(unitKey)) {
      conversionFactor = factor;
      break;
    }
  }

  const ml = amount * conversionFactor;
  return isNaN(ml) ? null : parseFloat(ml.toFixed(1));
};

// Format ML value nicely
export const formatML = (ml) => {
  if (!ml) return '';
  if (ml >= 1000) {
    return `${(ml / 1000).toFixed(1)}L`;
  }
  return `${ml.toFixed(0)}ml`;
};

// Convert unit string to ML with nice formatting
export const unitToML = (unitString) => {
  const ml = convertToML(unitString);
  return ml ? formatML(ml) : null;
};
