import mongoose from 'mongoose'

const recipeSchema = new mongoose.Schema({
  name: {
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
  }]
})

export default mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema)