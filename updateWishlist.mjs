import mongoose from 'mongoose';
import Recipe from './dist/models/Recipe.js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

async function addWishlistToRecipes() {
  try {
    // Connect to MongoDB with explicit database name
    const mongoUri = process.env.MONGODB_URI.replace('whycook', 'dinner-planner');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB (dinner-planner)');

    // First, let's check how many recipes we have
    const totalRecipes = await Recipe.countDocuments();
    console.log(`Total recipes in database: ${totalRecipes}`);

    // Check how many recipes don't have wishlist field
    const recipesWithoutWishlist = await Recipe.countDocuments({ wishlist: { $exists: false } });
    console.log(`Recipes without wishlist field: ${recipesWithoutWishlist}`);

    // Update all recipes
    const result = await Recipe.updateMany(
      { wishlist: { $exists: false } }, // only update recipes without wishlist
      { $set: { wishlist: false } }
    );
    
    console.log(`Updated ${result.modifiedCount} recipes`);
    console.log('Update complete');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

addWishlistToRecipes();