const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    }
  },
  {
    timestamps: true
  }
)

const Ingredient = mongoose.model('Ingredient', ingredientSchema)
module.exports = Ingredient
