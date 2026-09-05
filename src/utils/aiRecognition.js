// Voice and Image Recognition for ingredients

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Voice Recognition using Web Speech API
export const startVoiceRecognition = (onResult, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Voice recognition not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log('Voice recognition started...');
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    onResult(transcript);
  };

  recognition.onerror = (event) => {
    onError(`Voice recognition error: ${event.error}`);
  };

  recognition.start();
  return recognition;
};

// Image Recognition using Claude Vision API
export const recognizeIngredientsFromImage = async (imageFile) => {
  try {
    // Convert image to base64
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];
        const mediaType = imageFile.type;

        try {
          const response = await fetch(`${API_BASE_URL}/api/recognize-ingredients`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64Image,
              mediaType: mediaType,
            }),
          });

          if (!response.ok) {
            const error = await response.json();
            reject(error);
            return;
          }

          const data = await response.json();
          resolve(data.ingredients || []);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(imageFile);
    });
  } catch (error) {
    throw new Error(`Image recognition failed: ${error.message}`);
  }
};

// Parse ingredients from voice transcript
export const parseIngredientsFromText = (text) => {
  // Common ingredient keywords
  const ingredientKeywords = [
    'gin', 'vodka', 'rum', 'whisky', 'tequila', 'brandy', 'sake', 'mezcal',
    'lime', 'lemon', 'juice', 'syrup', 'water', 'soda', 'cola', 'beer',
    'cranberry', 'orange', 'pineapple', 'coconut', 'mint', 'sugar', 'ice',
    'vermouth', 'bitters', 'cream', 'milk', 'egg', 'tonic', 'ginger',
    'champagne', 'prosecco', 'wine', 'aperol', 'campari', 'kahlua',
    'baileys', 'amaretto', 'triple sec', 'cointreau'
  ];

  const foundIngredients = [];
  const lowerText = text.toLowerCase();

  ingredientKeywords.forEach(keyword => {
    if (lowerText.includes(keyword) && !foundIngredients.includes(keyword)) {
      foundIngredients.push(keyword);
    }
  });

  return foundIngredients;
};
