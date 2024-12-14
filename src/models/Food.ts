import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  instock: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['main', 'secondary', 'pantry'],
    required: true
  },
  group: {
    type: String,
    enum: ['protein', 'veggie', 'dairy', 'other'],
    required: true
  },
  lastPurchased: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
})

export default mongoose.models.Food || mongoose.model('Food', foodSchema)