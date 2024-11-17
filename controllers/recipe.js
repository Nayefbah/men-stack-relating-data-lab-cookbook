const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipe')
const Ingredient = require('../models/ingredient')

router.get('/', async (req, res) => {
  try {
    const populatedRecipe = await Recipe.find().populate('owner')
    console.log('Populated Recipe: ', populatedRecipe)
    res.render('recipes/index.ejs', { recipes: populatedRecipe })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// New
router.get('/new', async (req, res) => {
  try {
    const allIngredients = await Ingredient.find()
    res.render('recipes/new.ejs', { ingredients: allIngredients })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Create
router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id
    const recipe = await Recipe.create(req.body)
    res.redirect('/recipes')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Show
router.get('/:recipeId', async (req, res) => {
  try {
    const populatedRecipe = await Recipe.findById(req.params.recipeId)
      .populate('owner')
      .populate('ingredients')

    // View recipes
    res.render('recipes/show.ejs', { recipe: populatedRecipe })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Edit
router.get('/:recipeId/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId).populate(
      'ingredients'
    ) // Fetch the recipe
    const ingredients = await Ingredient.find() // Fetch all ingredients
    res.render('recipes/edit.ejs', { recipe, ingredients }) // Pass both recipe and ingredients
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Update
router.put('/:recipeId', async (req, res) => {
  try {
    const populatedRecipe = await Recipe.findById(req.params.recipeId).populate(
      'owner'
    )
    populatedRecipe.set(req.body)
    await populatedRecipe.save()
    res.redirect('/recipes')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Delete
router.delete('/:recipeId', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId)
    if (recipe.owner.equals(req.session.user._id)) {
      await recipe.deleteOne()
      res.redirect('/recipes')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

module.exports = router
