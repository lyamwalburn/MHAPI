const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const connectDB = require('./config/database')
const fileUpload = require('express-fileupload')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')

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
app.use(cookieParser())

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.DB_STRING}),
    })
  )
app.use(flash())

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//File upload
app.use(fileUpload({
  createParentPath: true
}))

//Routes
app.use('/', homeRoutes)
app.use('/auth', authRoutes)
app.use('/recipes', recipeRoutes)
app.use('/shoppingList',shoppingListRoutes)

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

