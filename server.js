const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/database')
const authRoutes = require('./routes/auth')
const homeRoutes = require('./routes/home')
const recipeRoutes = require('./routes/recipe')
const shoppingListRoutes = require('./routes/shoppingList')
require('dotenv').config({path: './config/.env'})
require('./config/passport')(passport)

connectDB()


app.set('view engine', 'ejs')
app.set('views','./views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.DB_STRING}),
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/recipes', recipeRoutes)
app.use('/shoppingList',shoppingListRoutes)

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

