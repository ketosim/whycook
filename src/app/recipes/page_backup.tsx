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
}

const RECIPE_CATEGORIES = [
  'Entrees - Asian',
  'Entrees - Middle Eastern',
  'Entrees - European',
  'Entrees - Indian',
  'Salad',
  'Main',
  'Italian Main',
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

  const fetchData = async () => {
    console.log('fetchData is being called');

    try {
      const [recipesRes, ingredientsRes] = await Promise.all([
        fetch('/api/recipes'),
        fetch('/api/food')
      ]);
  
      // Log raw response body
      const rawIngredients = await ingredientsRes.text();
      console.log('Raw ingredients response body:', rawIngredients);
  
      if (!recipesRes.ok || !ingredientsRes.ok) {
        throw new Error('Failed to fetch data');
      }
  
      const recipesData = await recipesRes.json();
      const ingredientsData = JSON.parse(rawIngredients); // Parse manually if raw response logged successfully
  
      console.log('Ingredients fetched:', ingredientsData);
      setRecipes(Array.isArray(recipesData) ? recipesData : []);
      setAvailableIngredients(Array.isArray(ingredientsData) ? ingredientsData : []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  

  

  React.useEffect(() => {
    fetchData();
  }, []);

  const addRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName || selectedIngredients.length === 0) return;

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
      
      if (!res.ok) throw new Error('Failed to add recipe');
      
      setNewRecipeName('');
      setSelectedIngredients([]);
      fetchData();
    } catch (err) {
      console.error('Failed to add recipe:', err);
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
    setSelectedIngredients(prev => 
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    );
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
    return <div className="flex justify-center items-center h-screen">Loading... but cooking takes longer you know</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Why I have to cook</h1>
      
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
                  <Button type="submit" disabled={!newRecipeName || selectedIngredients.length === 0}>
                    Add Recipe
                  </Button>
                </div>

                <div>
                  <h3 className="text-md font-semibold mb-2">Select Ingredients</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm">Proteins</h4>
                      {availableIngredients
                        .filter(ingredient => ingredient.group === 'protein')
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
                      <h4 className="font-medium text-sm">Vegetables</h4>
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
                      <h4 className="font-medium text-sm">Dairy</h4>
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
                      <h4 className="font-medium text-sm">Other</h4>
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {RECIPE_CATEGORIES.map(category => {
          const categoryRecipes = groupedRecipes[category] || [];
          if (categoryRecipes.length === 0) return null;

          return (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{category}</h2>
                <Badge variant="secondary">
                  {categoryRecipes.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {categoryRecipes.map(recipe => (
                  <Card key={recipe._id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold">{recipe.name}</h3>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteRecipe(recipe._id)}
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ingredients.map(ingredient => (
                          <Badge 
                            key={ingredient._id}
                            variant="outline"
                            className={`text-xs ${!ingredient.instock ? 'text-gray-300' : ''}`}
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
          );
        })}
      </div>
    </div>
  );
}