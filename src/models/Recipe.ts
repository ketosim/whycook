import mongoose, { Schema, Document } from 'mongoose'

// Interface to define the Recipe document structure
export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string[];
  wishlist: boolean;
  // ... any other fields your recipe has
}

// Create the schema
const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Entrees - Asian', 'Entrees - Middle Eastern', 'Entrees - European',
    'Entrees - Indian', 'Salad', 'Main', 'Italian Main', 'Soup', 'Pastry', 'Veggies', 'Desserts'],
    required: true
  },
  ingredients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food'
  }],
  instructions: [{ type: String }],
  wishlist: {
    type: Boolean,
    default: false
  }
})

// Export the model
export default mongoose.models.Recipe || mongoose.model<IRecipe>('Recipe', recipeSchema)