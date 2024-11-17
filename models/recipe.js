const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true
    },
    instructions: {
      type: String,
      require: false
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true
    },
    ingredients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        require: false
      }
    ]
  },
  {
    timestamps: true
  }
)

const Recipe = mongoose.model('Recipe', recipeSchema)
module.exports = Recipe
