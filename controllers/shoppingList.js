const res = require('express/lib/response')
const ShoppingList = require('../models/ShoppingList')


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
            console.log('Added Meal')
        } catch (err) {
            console.error(err)
        }
    }

}