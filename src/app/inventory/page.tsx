'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodItem {
  _id: string;
  name: string;
  type: 'main' | 'secondary' | 'pantry';
  group: 'protein' | 'veggie' | 'dairy' | 'other';
  instock: boolean;
  lastPurchased: string | null;
  notes: string;
}

export default function InventoryPage() {
  const [items, setItems] = React.useState<FoodItem[]>([]);
  const [newItemName, setNewItemName] = React.useState('');
  const [selectedType, setSelectedType] = React.useState<FoodItem['type']>('main');
  const [selectedGroup, setSelectedGroup] = React.useState<FoodItem['group']>('protein');
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/food');
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();
      setItems(data.foods || data); // Handle both response formats
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          type: selectedType,
          group: selectedGroup,
          instock: false,
          notes: ''
        }),
      });
      if (!res.ok) throw new Error('Failed to add item');
      setNewItemName('');
      fetchInventory();
    } catch (err) {
      console.error('Failed to add item:', err);
    }
  };

  const toggleInstock = async (id: string, currentInstock: boolean) => {
    try {
      const res = await fetch('/api/food', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          _id: id,
          instock: !currentInstock,
          lastPurchased: !currentInstock ? new Date().toISOString() : null
        }),
      });
      if (!res.ok) throw new Error('Failed to update item');
      fetchInventory();
    } catch (err) {
      console.error('Failed to update item:', err);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await fetch(`/api/food?id=${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      fetchInventory();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const groupedItems = React.useMemo(() => {
    return items.reduce((acc: Record<string, FoodItem[]>, item) => {
      if (!acc[item.group]) {
        acc[item.group] = [];
      }
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [items]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-[1800px] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">why cook :(</h1>
      
      {/* Add Item Form */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={addItem} className="flex flex-wrap gap-4">
            <Input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add new ingredient"
              className="flex-1 min-w-[200px]"
            />
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as FoodItem['type'])}
              className="px-3 py-2 border rounded bg-background min-w-[150px]"
            >
              <option value="main">Main</option>
              <option value="secondary">Secondary</option>
              <option value="pantry">Pantry</option>
            </select>
            <select 
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as FoodItem['group'])}
              className="px-3 py-2 border rounded bg-background min-w-[150px]"
            >
              <option value="protein">Protein</option>
              <option value="veggie">Veggie</option>
              <option value="dairy">Dairy</option>
              <option value="other">Other</option>
            </select>
            <Button type="submit">Add Item</Button>
          </form>
        </CardContent>
      </Card>

      {/* Category Lists */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {(['protein', 'veggie', 'dairy', 'other'] as const).map(category => (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold capitalize">{category}</h2>
              <Badge variant="secondary">
                {groupedItems[category]?.length || 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {(groupedItems[category] || [])
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(item => (
                  <div 
                    key={item._id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 bg-card rounded-lg border gap-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      {item.lastPurchased && (
                        <span className="text-xs text-muted-foreground">
                          Last purchased: {new Date(item.lastPurchased).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                      <Button
                        size="sm"
                        variant={item.instock ? "default" : "secondary"}
                        onClick={() => toggleInstock(item._id, item.instock)}
                        className="w-24"
                      >
                        {item.instock ? 'In Stock' : 'Out'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem(item._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
              ))}
              {(!groupedItems[category] || groupedItems[category].length === 0) && (
                <div className="text-center text-muted-foreground py-4 bg-card rounded-lg border">
                  No items
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}