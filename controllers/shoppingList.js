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
            await ShoppingList.findOneAndUpdate({_id:req.body.itemIdFromJSFile},{
                done: true
            })
            res.json('marked complete')
        } catch (err) {
            console.error(err)
        }
    },
    markIncomplete: async (req,res)=>{
        try {
            await ShoppingList.findOneAndUpdate({_id:req.body.itemIdFromJSFile},{
                done: false
            })
            res.json('marked incomplete')
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
                await ShoppingList.updateOne({  ingredient : recipeData[0].ingredients[i],
                                                done: false,
                                             },{ $inc:{ammount: 1} },{ upsert: true}
                                            )
            }
            res.redirect('/recipes')
           
        } catch (err) {
            console.error(err)
        }
    },
    deleteItem: async (req,res)=>{
        console.log(req.body);
        try{
            await ShoppingList.findOneAndDelete({_id:req.body.itemIdFromJSFile})
            console.log('Deleted Item')
            res.json('Deleted it')
        } catch(err){
            console.error(err)
        }
    },
    deleteAllItems: async (req,res)=> {
       console.log('Clearing Shopping List')
        try {
            //TODO - only remove current logged in users items from the collection - req auth to be implemented 

            await ShoppingList.deleteMany({})
            console.log('Deleted All items')
            res.json('List Deleted')
        } catch (error) {
            console.error(err)
        }
    }

}