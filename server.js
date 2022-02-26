const { application } = require('express')
const express = require('express')
const app = express()
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const recipeRoutes = require('./routes/recipe')
const shoppingListRoutes = require('./routes/shoppingList')
require('dotenv').config({path: './config/.env'})

connectDB()


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Routes
app.use('/', homeRoutes)
app.use('/recipes', recipeRoutes)
app.use('/shoppingList',shoppingListRoutes)

app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})

