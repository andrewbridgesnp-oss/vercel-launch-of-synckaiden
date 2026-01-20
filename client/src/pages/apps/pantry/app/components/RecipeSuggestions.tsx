import { useState, useEffect } from 'react';
import { ChefHat, ExternalLink, Loader2 } from 'lucide-react';
import { PantryItem } from './PantryItem';

interface RecipeSuggestionsProps {
  expiringItems: PantryItem[];
}

interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  time: string;
  url?: string;
  matchedIngredients?: number;
}

const RECIPE_DATABASE: Recipe[] = [
  {
    name: 'Quick Scrambled Eggs',
    description: 'Classic breakfast made simple with fresh eggs and cheese',
    ingredients: ['Eggs', 'Cheese', 'Milk', 'Butter'],
    time: '10 min',
    url: 'https://www.example.com/scrambled-eggs'
  },
  {
    name: 'Grilled Chicken Salad',
    description: 'Healthy and protein-packed salad with fresh vegetables',
    ingredients: ['Chicken Breast', 'Lettuce', 'Tomatoes', 'Cheese', 'Olive Oil'],
    time: '20 min',
    url: 'https://www.example.com/chicken-salad'
  },
  {
    name: 'Chicken Sandwich',
    description: 'Satisfying sandwich with grilled chicken and fresh veggies',
    ingredients: ['Bread', 'Chicken Breast', 'Lettuce', 'Tomatoes', 'Mayo'],
    time: '15 min',
    url: 'https://www.example.com/chicken-sandwich'
  },
  {
    name: 'Caprese Salad',
    description: 'Simple Italian salad with fresh tomatoes and cheese',
    ingredients: ['Tomatoes', 'Cheese', 'Basil', 'Olive Oil'],
    time: '5 min',
    url: 'https://www.example.com/caprese-salad'
  },
  {
    name: 'Yogurt Parfait',
    description: 'Healthy breakfast or snack layered with yogurt and toppings',
    ingredients: ['Yogurt', 'Granola', 'Berries', 'Honey'],
    time: '5 min',
    url: 'https://www.example.com/yogurt-parfait'
  },
  {
    name: 'French Toast',
    description: 'Sweet breakfast classic using bread and eggs',
    ingredients: ['Bread', 'Eggs', 'Milk', 'Cinnamon', 'Butter'],
    time: '15 min',
    url: 'https://www.example.com/french-toast'
  },
  {
    name: 'Chicken Lettuce Wraps',
    description: 'Low-carb wraps with seasoned chicken',
    ingredients: ['Chicken Breast', 'Lettuce', 'Soy Sauce', 'Garlic'],
    time: '20 min',
    url: 'https://www.example.com/lettuce-wraps'
  },
  {
    name: 'Cheese Omelette',
    description: 'Fluffy omelette filled with melted cheese',
    ingredients: ['Eggs', 'Cheese', 'Butter', 'Salt', 'Pepper'],
    time: '10 min',
    url: 'https://www.example.com/cheese-omelette'
  },
  {
    name: 'Chicken Stir Fry',
    description: 'Quick and healthy stir fry with chicken and vegetables',
    ingredients: ['Chicken Breast', 'Vegetables', 'Soy Sauce', 'Rice'],
    time: '25 min',
    url: 'https://www.example.com/chicken-stir-fry'
  },
  {
    name: 'Grilled Cheese Sandwich',
    description: 'Classic comfort food with melted cheese',
    ingredients: ['Bread', 'Cheese', 'Butter'],
    time: '10 min',
    url: 'https://www.example.com/grilled-cheese'
  },
  {
    name: 'Chicken Quesadilla',
    description: 'Crispy tortilla filled with chicken and cheese',
    ingredients: ['Chicken Breast', 'Cheese', 'Tortilla', 'Salsa'],
    time: '15 min',
    url: 'https://www.example.com/quesadilla'
  },
  {
    name: 'Egg Salad Sandwich',
    description: 'Creamy egg salad on fresh bread',
    ingredients: ['Eggs', 'Bread', 'Mayo', 'Lettuce'],
    time: '15 min',
    url: 'https://www.example.com/egg-salad'
  }
];

export function RecipeSuggestions({ expiringItems }: RecipeSuggestionsProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expiringItems.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const expiringItemNames = expiringItems.map(item => item.name.toLowerCase());
      
      // Enhanced matching algorithm - scores recipes based on how many expiring items they use
      const scoredRecipes = RECIPE_DATABASE.map(recipe => {
        let matchCount = 0;
        let score = 0;
        
        recipe.ingredients.forEach(ingredient => {
          const ingredientLower = ingredient.toLowerCase();
          expiringItemNames.forEach(item => {
            // Check for exact match or partial match
            if (ingredientLower.includes(item) || item.includes(ingredientLower)) {
              matchCount++;
              score += 2; // Higher score for matching expiring items
            }
          });
        });
        
        // Bonus points for using more expiring items
        score += matchCount * 5;
        
        return {
          ...recipe,
          matchedIngredients: matchCount,
          score
        };
      })
      .filter(recipe => recipe.matchedIngredients && recipe.matchedIngredients > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
      
      setRecipes(scoredRecipes);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [expiringItems]);

  if (expiringItems.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-emerald-900/50 rounded-lg">
            <ChefHat className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100">Recipe Suggestions</h2>
        </div>
        <p className="text-slate-400">No items expiring soon. Your pantry is fresh! 🎉</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-amber-600 to-amber-800 rounded-lg shadow-lg">
          <ChefHat className="w-6 h-6 text-amber-100" />
        </div>
        <h2 className="text-xl font-semibold text-slate-100">Recipe Suggestions</h2>
      </div>

      <p className="text-slate-400 mb-4">
        Use these items before they expire: <span className="font-medium text-amber-400">{expiringItems.map(i => i.name).join(', ')}</span>
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : recipes.length > 0 ? (
        <div className="space-y-3">
          {recipes.map((recipe, idx) => (
            <div key={idx} className="border border-slate-600/50 bg-slate-700/30 rounded-lg p-4 hover:border-amber-500/50 hover:bg-amber-900/20 transition-colors backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-100">{recipe.name}</h3>
                    {recipe.matchedIngredients && recipe.matchedIngredients > 1 && (
                      <span className="text-xs bg-amber-600/20 text-amber-400 px-2 py-0.5 rounded-full">
                        {recipe.matchedIngredients} matches
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 mt-1">{recipe.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-500">⏱️ {recipe.time}</span>
                    <span className="text-xs text-slate-500">🥘 {recipe.ingredients.length} ingredients</span>
                  </div>
                </div>
                <a 
                  href={recipe.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  aria-label={`View recipe for ${recipe.name}`}
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-400 text-sm">
            No specific recipes found. Try searching online for: <span className="font-medium text-amber-400">{expiringItems.map(i => i.name).join(', ')}</span>
          </p>
        </div>
      )}
    </div>
  );
}
