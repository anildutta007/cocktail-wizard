// Text-to-Speech utility using Web Speech API
export const speakWelcomeMessage = (message = "Welcome to Dutta Cocktail Wizard!! Enjoy!!") => {
  // Check if Speech Synthesis API is supported
  const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;

  if (!SpeechSynthesisUtterance) {
    console.log('Speech Synthesis not supported in this browser');
    return;
  }

  try {
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(message);

    // Configure voice properties
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Optionally select a female voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Try to find a female voice
      const femaleVoice = voices.find(voice => voice.name.includes('Female') || voice.name.includes('woman'));
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else {
        utterance.voice = voices[0]; // Use first available voice
      }
    }

    // Speak
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.log('Error speaking message:', error);
  }
};

// Alternative: Stop speaking if already playing
export const stopSpeech = () => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
};
