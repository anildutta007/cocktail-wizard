export default function CocktailCard({ cocktail }) {
  return (
    <div className="bg-gradient-to-br from-cocktail-purple to-cocktail-dark border border-cocktail-gold rounded-lg overflow-hidden hover:shadow-2xl hover:shadow-cocktail-gold/50 transition transform hover:scale-105">
      <div className="relative h-40 bg-gradient-to-r from-cocktail-gold to-cocktail-accent flex items-center justify-center overflow-hidden">
        {cocktail.image ? (
          <img
            src={cocktail.image}
            alt={cocktail.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.classList.add('bg-gradient-to-r', 'from-cocktail-gold', 'to-cocktail-accent');
            }}
          />
        ) : (
          <div className="text-6xl">🍸</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-xl font-bold text-cocktail-gold mb-2">{cocktail.name}</h3>

        <div className="mb-3">
          <span className="inline-block bg-cocktail-gold bg-opacity-20 border border-cocktail-gold text-cocktail-gold text-xs font-semibold px-2 py-1 rounded capitalize">
            {cocktail.base}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {cocktail.flavorProfile.slice(0, 2).map((flavor, idx) => (
              <span
                key={idx}
                className="text-xs bg-cocktail-accent bg-opacity-30 text-cocktail-accent px-2 py-1 rounded"
              >
                {flavor}
              </span>
            ))}
            {cocktail.flavorProfile.length > 2 && (
              <span className="text-xs text-cocktail-light px-2 py-1">
                +{cocktail.flavorProfile.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          <p>Ingredients: {cocktail.ingredients.length}</p>
          <p className="capitalize mt-1">Difficulty: {cocktail.difficulty}</p>
        </div>
      </div>
    </div>
  );
}
