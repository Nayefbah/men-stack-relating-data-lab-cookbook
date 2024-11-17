const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const morgan = require('morgan')

const isSignedIn = require('./middleware/is-signed-in')
const passUserToView = require('./middleware/pass-user-to-view')

const PORT = process.env.PORT ? process.env.PORT : '3000'

mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}`)
})
app.use(express.static(path.join(__dirname)))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
)

app.get('/', async (req, res) => {
  res.render('index.ejs', {
    user: req.session.user
  })
})

// Require and use Controller
const authController = require('./controllers/auth.js')
const recipesController = require('./controllers/recipe.js')
const ingredientsController = require('./controllers/ingredients.js')

app.use(passUserToView)
app.use('/auth', authController)
app.use(isSignedIn)
app.use('/recipes', recipesController)
app.use('/ingredients', ingredientsController)

// Landing Page
app.get('/', async (req, res) => {
  res.render('index.ejs')
})

// Listening
app.listen(PORT, () => {
  console.log(`Running on localhost:${PORT}`)
})
