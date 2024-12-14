import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import '@/models/Food';  // Add this import to register the Food model


export async function GET() {
  try {
    console.log('Fetching recipes...');
    await connectDB();
    const recipes = await Recipe.find().populate('ingredients');
    console.log(`Fetched ${recipes.length} recipes successfully.`);
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('Creating a new recipe...');
    const body = await request.json();
    console.log('Request body:', body);
    await connectDB();
    const recipe = await Recipe.create(body);
    const populatedRecipe = await recipe.populate('ingredients');
    console.log(`Recipe created successfully: ${populatedRecipe}`);
    return NextResponse.json(populatedRecipe, { status: 201 });
  } catch (error) {
    console.error('Failed to create recipe:', error);
    return NextResponse.json(
      { error: 'Failed to create recipe' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      console.error('ID is required for deletion.');
      return NextResponse.json(
        { error: 'ID is required' }, 
        { status: 400 }
      );
    }

    console.log(`Deleting recipe with ID: ${id}...`);
    await connectDB();
    const recipe = await Recipe.findByIdAndDelete(id);

    if (!recipe) {
      console.error(`Recipe with ID ${id} not found.`);
      return NextResponse.json(
        { error: 'Recipe not found' }, 
        { status: 404 }
      );
    }

    console.log(`Recipe deleted successfully: ${recipe}`);
    return NextResponse.json(
      { message: 'Recipe deleted successfully' }
    );
  } catch (error) {
    console.error('Failed to delete recipe:', error);
    return NextResponse.json(
      { error: 'Failed to delete recipe' }, 
      { status: 500 }
    );
  }
}
