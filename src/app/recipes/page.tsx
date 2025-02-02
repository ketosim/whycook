'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";

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

export default function RecipePage() {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [availableIngredients, setAvailableIngredients] = React.useState<FoodItem[]>([]);
  const [newRecipeName, setNewRecipeName] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(RECIPE_CATEGORIES[0]);
  const [selectedIngredients, setSelectedIngredients] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Fetch both recipes and available ingredients
  const fetchData = async () => {
    console.log('Fetching data...');
    try {
      const [recipesRes, ingredientsRes] = await Promise.all([
        fetch('/api/recipes'),
        fetch('/api/food')  // Make sure this matches your API route
      ]);
  
      console.log('Responses:', {
        recipes: recipesRes.status,
        ingredients: ingredientsRes.status
      });
  
      if (!recipesRes.ok || !ingredientsRes.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const recipesData = await recipesRes.json();
      const ingredientsData = await ingredientsRes.json();
  
      console.log('Data:', {
        recipes: recipesData,
        ingredients: ingredientsData
      });
  
      // Add null checks and ensure we have arrays
      setRecipes(recipesData);
      setAvailableIngredients(ingredientsData.foods || ingredientsData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setRecipes([]);
      setAvailableIngredients([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchData(); // Ensure fetchData completes successfully
  }, []);
  
  if (!isLoading && availableIngredients.length === 0) {
    console.error('Available Ingredients are empty.');
    console.log('Available Ingredients:', availableIngredients); // Log all available ingredients if empty
  }
  

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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!availableIngredients || availableIngredients.length === 0) {
    return <div className="flex justify-center items-center h-screen">Ingredients data not available or empty.</div>;
  }

  const addRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRecipeName,
          category: selectedCategory,
          ingredients: selectedIngredients
        }),
      });
      
      if (!res.ok) throw new Error('Failed to create recipe');
      
      setNewRecipeName('');
      setSelectedIngredients([]);
      fetchData();
    } catch (err) {
      console.error('Failed to create recipe:', err);
    }
  };

  const deleteRecipe = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    
    try {
        const res = await fetch(`/api/recipes?id=${id}`, {
            method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete recipe');
      
      fetchData();
    } catch (err) {
      console.error('Failed to delete recipe:', err);
    }
  };

  const toggleIngredient = (ingredientId: string) => {
    console.log('Available Ingredients:', availableIngredients); // Log available ingredients
    console.log('Selected Ingredients Before Toggle:', selectedIngredients); // Log selected ingredients
    setSelectedIngredients(prev => 
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
  };
  
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
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Recipe Management</h1>
        
        {/* Add Recipe Form */}
        <Card className="mb-8">
            <CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Add New Recipe</h2>
            <form onSubmit={addRecipe}>
                <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                    <div className="flex gap-4">
                    <Input
                        type="text"
                        value={newRecipeName}
                        onChange={(e) => setNewRecipeName(e.target.value)}
                        placeholder="Recipe name"
                        className="flex-1"
                    />
                    <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                    >
                        <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        {RECIPE_CATEGORIES.map(category => (
                            <SelectItem key={category} value={category}>
                            {category}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <Button type="submit" className="w-[100px]">Add Recipe</Button>
                    </div>

                    {/* Ingredients Selection */}
                    <div>
                    <h3 className="text-md font-semibold mb-2">Select Ingredients</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="space-y-1">
                        {availableIngredients
                            .filter(ingredient => ingredient.group === 'protein') // Only protein group
                            .map(ingredient => (
                            <Button
                                key={ingredient._id}
                                type="button"
                                variant={selectedIngredients.includes(ingredient._id) ? "default" : "outline"}
                                onClick={() => toggleIngredient(ingredient._id)}
                                className="justify-start h-auto py-2 w-full"
                            >
                                {ingredient.name}
                            </Button>
                            ))}
                        </div>
                        <div className="space-y-1">
                        {availableIngredients
                            .filter(ingredient => ingredient.group === 'veggie')
                            .map(ingredient => (
                            <Button
                                key={ingredient._id}
                                type="button"
                                variant={selectedIngredients.includes(ingredient._id) ? "default" : "outline"}
                                onClick={() => toggleIngredient(ingredient._id)}
                                className="justify-start h-auto py-2 w-full"
                            >
                                {ingredient.name}
                            </Button>
                            ))}
                        </div>
                        <div className="space-y-1">
                        {availableIngredients
                            .filter(ingredient => ingredient.group === 'dairy')
                            .map(ingredient => (
                            <Button
                                key={ingredient._id}
                                type="button"
                                variant={selectedIngredients.includes(ingredient._id) ? "default" : "outline"}
                                onClick={() => toggleIngredient(ingredient._id)}
                                className="justify-start h-auto py-2 w-full"
                            >
                                {ingredient.name}
                            </Button>
                            ))}
                        </div>
                        <div className="space-y-1">
                        {availableIngredients
                            .filter(ingredient => ingredient.group === 'other')
                            .map(ingredient => (
                            <Button
                                key={ingredient._id}
                                type="button"
                                variant={selectedIngredients.includes(ingredient._id) ? "default" : "outline"}
                                onClick={() => toggleIngredient(ingredient._id)}
                                className="justify-start h-auto py-2 w-full"
                            >
                                {ingredient.name}
                            </Button>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </form>
            </CardContent>
        </Card>

      {/* Recipe Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {RECIPE_CATEGORIES.map(category => (
          <div key={category} className="space-y-2">
            {(groupedRecipes[category]?.length ?? 0) > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{category}</h2>
                  <Badge variant="secondary">
                    {groupedRecipes[category]?.length || 0}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {groupedRecipes[category]?.map(recipe => (
                    <Card key={recipe._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold flex-grow">{recipe.name}</h3>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleWishlist(recipe._id, recipe.wishlist)}
                              className="flex items-center justify-center w-10 h-10"
                            >
                              <Heart 
                                size={20}
                                className={recipe.wishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'} 
                              />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteRecipe(recipe._id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
