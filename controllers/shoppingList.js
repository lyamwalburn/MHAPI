const res = require('express/lib/response')
const ShoppingList = require('../models/ShoppingList')
const Recipie = require('../models/Recipe')

module.exports = {

    getShoppingList: async(req,res)=>{
        try {
            let listItems = await ShoppingList.find()   //todo find only current users items once auth added
            res.render('shoppingList.ejs', {items : listItems})
        } catch (err) {
            console.error(err)
        }
    },
    markDone: async (req,res)=>{
        try {
            console.log('Mark Complete')
        } catch (err) {
            console.error(err)
        }
    },
    markIncomplete: async (req,res)=>{
        try {
            console.log('Mark Complete')
        } catch (err) {
            console.error(err)
        }
    },
    addMeal: async (req,res)=>{
        try {
            console.log(`Added Meal ${req.params.id}`)
            let recipeData = await Recipie.find({_id: req.params.id}).lean()
            console.log(recipeData[0].ingredients)
           for(let i =0;i<recipeData[0].ingredients.length;i++){
                await ShoppingList.create({
                    ingredient: recipeData[0].ingredients[i], 
                    done: false,
                    ammount: '100g',
                })
            }
            res.redirect('/recipes')
           
        } catch (err) {
            console.error(err)
        }
    }

}