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
        //input from ejs should be item,ammount,unit

        //split the instructions & ingredients by new line
        let steps = req.body.instructions.split(/\r\n/)
        let ingredients = req.body.ingredients.split(/\r\n/)
        //split ingredient into item, ammount, unit and put into obj
        mealIngredients = []
        ingredients.forEach(ingredient => {
            let i = ingredient.split(',')
            let obj = {
                item : i[0],
                ammount: i[1],
                unit: i[2]
            }
            mealIngredients.push(obj)
        })
        //TODO - make cooking time changeable
        try {
            await Recipe.create({
                recipeName: req.body.name, 
                cookingTime: 30,
                cuisineStyle: req.body.style,
                classification: 'Chicken',
                ingredients: mealIngredients,
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