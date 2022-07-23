const res = require('express/lib/response')
const ShoppingList = require('../models/ShoppingList')
const Recipie = require('../models/Recipe')
const User = require('../models/User')

module.exports = {

    getShoppingList: async(req,res)=>{
        try {
            let listItems = await ShoppingList.find({ userId: req.user._id})   
            res.render('shoppingList.ejs', {items : listItems, username : req.user.displayName})
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
            //Add the chosen meal's ingredients to our shopping list
            let recipeData = await Recipie.find({_id: req.params.id}).lean()
           for(let i =0;i<recipeData[0].ingredients.length;i++){
               //if this ingredient is already in the list just update it's ammount
                await ShoppingList.updateOne({  ingredient : recipeData[0].ingredients[i].item,
                                                done: false,
                                                unit: recipeData[0].ingredients[i].unit,
                                                image: recipeData[0].ingredients[i].image,
                                                userId: req.user._id,
                                             },{ $inc:{ammount: recipeData[0].ingredients[i].ammount} },{ upsert: true}
                                            )
            }
            //Add the recipie id to the user so we can keep track of what meals they are having
            await User.updateOne( {_id: req.user._id},{ $push: {currentMeals: req.params.id}})
            req.flash('info',`${recipeData[0].recipeName} added successfully`)
            res.redirect('/recipes')
           
        } catch (err) {
            console.error(err)
        }
    },
    deleteItem: async (req,res)=>{
        try{
            await ShoppingList.findOneAndDelete({_id:req.body.itemIdFromJSFile})
            res.json('Deleted it')
        } catch(err){
            console.error(err)
        }
    },
    deleteAllItems: async (req,res)=> {
        try {           
            await ShoppingList.deleteMany({userId : req.user._id})
            res.json('List Deleted')
        } catch (error) {
            console.error(err)
        }
    }

}