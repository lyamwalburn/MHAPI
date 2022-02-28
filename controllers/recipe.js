const res = require('express/lib/response')
const Recipe = require('../models/Recipe')

module.exports = {
    getRecipies: async (req,res) => {
        try {
            const allRecipies = await Recipe.find()
            res.render('recipies.ejs', { recipies : allRecipies})
        } catch (err) {
            console.error(err)
        }
    },
    createRecipe: async (req,res)=>{
        console.log(req.body)
        //split the instructions by new line
        let steps = req.body.instructions.split(/\r\n/)
        let ingredients = req.body.ingredients.split(/\r\n/)
        //TODO - store ingredient ammounts and make cooking time changeable
        try {
            await Recipe.create({
                recipeName: req.body.name, 
                cookingTime: 30,
                cuisineStyle: req.body.style,
                classification: 'Chicken',
                ingredients: ingredients,
                image: req.body.image,
                instructions: steps,
            })
            res.redirect('/recipes')
        } catch (err) {
            console.error(err)
        }
    },
    addRecipe: (req,res)=>{
        res.render('addMeal.ejs')
    }
}