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
        console.log(steps);
        try {
            await Recipe.create({recipeName: req.body.name, cookingTime: 30})
            res.redirect('/recipes')
        } catch (err) {
            console.error(err)
        }
    },
    addRecipe: (req,res)=>{
        res.render('addMeal.ejs')
    }
}