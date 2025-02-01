'use client';

import React from 'react';
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";





interface FoodItem {
  _id: string;
  name: string;
  type: string;
  group: string;
  instock: boolean;
}

interface Recipe {
  _id: string;
  name: string;
  category: string;
  ingredients: FoodItem[];
  wishlist: boolean;
}

const RECIPE_CATEGORIES = [
  'Entrees - Asian',
  'Entrees - Middle Eastern',
  'Entrees - European',
  'Entrees - Indian',
  'Salad',
  'Main',
  'Itlian Main',
  'Soup',
  'Pastry',
  'Veggies',
  'Desserts'
];

export default function RecipeList() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await fetch('/api/recipes');
      if (!res.ok) throw new Error('Failed to fetch recipes');
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecipes();
  }, []);

  async function toggleWishlist(recipeId: string, currentValue: boolean) {
    try {
      const response = await fetch('/api/recipes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: recipeId,
          wishlist: !currentValue 
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update wishlist');
      
      // Refresh the page or update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };


  const groupedRecipes = React.useMemo(() => {
    return recipes.reduce((acc: Record<string, Recipe[]>, recipe) => {
      if (!acc[recipe.category]) {
        acc[recipe.category] = [];
      }
      acc[recipe.category].push(recipe);
      return acc;
    }, {});
  }, [recipes]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...cooking takes longer you know</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="space-y-6">
        {RECIPE_CATEGORIES.map(category => (
          groupedRecipes[category]?.length ? (
            <div key={category} className="space-y-3">
              <div className="sticky top-0 bg-background/95 backdrop-blur z-10 py-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{category}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {groupedRecipes[category]?.length || 0}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                {groupedRecipes[category]?.map(recipe => (
                  <Card key={recipe._id} className="bg-card">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-medium mb-2 twin-peaks-title">{recipe.name}</h3>
                        <div onClick={() => toggleWishlist(recipe._id,recipe.wishlist)} className="cursor-pointer">
                          <Heart 
                            size={24} //                            

                            className={recipe.wishlist ? 'text-red-500' : 'text-gray-500'} 
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recipe.ingredients.map(ingredient => (
                          <Badge
                            key={ingredient._id}
                            variant={ingredient.instock ? "default" : "secondary"}
                          >
                            {ingredient.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}