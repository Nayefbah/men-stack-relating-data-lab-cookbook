const express = require('express')
const router = express.Router()
const Ingredient = require('../models/ingredient')

router.get('/', async (req, res) => {
  try {
    const populatedIngredient = await Ingredient.find().populate('owner')
    console.log('Populated Ingredient: ', populatedIngredient)
    res.render('ingredients/index.ejs', { ingredients: populatedIngredient })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// New
router.get('/new', async (req, res) => {
  res.render('ingredients/new.ejs')
})

// Create
router.post('/', async (req, res) => {
  try {
    req.body.owner = req.session.user._id
    await Ingredient.create(req.body)

    if (req.body.action === 'addAndView') {
      res.redirect('/ingredients') // Redirect to all ingredients
    } else if (req.body.action === 'addAndNew') {
      res.redirect('/ingredients/new') // Reload the new ingredient form
    }
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Show
router.get('/:ingredientId', async (req, res) => {
  try {
    const populatedIngredient = await Ingredient.findById(
      req.params.ingredientId
    ).populate('owner')

    // View Ingredient
    res.render('ingredients/show.ejs', { ingredient: populatedIngredient })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Edit
router.get('/:ingredientId/edit', async (req, res) => {
  try {
    const populatedIngredient = await Ingredient.findById(
      req.params.ingredientId
    ).populate('owner')
    res.render('ingredients/edit.ejs', { ingredient: populatedIngredient })
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Update
router.put('/:ingredientId', async (req, res) => {
  try {
    const populatedIngredient = await Ingredient.findById(
      req.params.ingredientId
    ).populate('owner')
    populatedIngredient.set(req.body)
    await populatedIngredient.save()
    res.redirect('/ingredients')
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

// Delete
router.delete('/:ingredientId', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.ingredientId)

    if (ingredient.owner.equals(req.session.user._id)) {
      await ingredient.deleteOne()
      res.redirect('/ingredients')
    } else {
      res.send("You don't have permission to do that.")
    }
  } catch (err) {
    console.log(err)
    res.redirect('/')
  }
})

module.exports = router
