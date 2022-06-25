const { render } = require('express/lib/response')
const res = require('express/lib/response')
const Recipe = require('../models/Recipe')
const User = require('../models/User')


module.exports = {
    getRecipies: async (req,res) => {
        try {
            const allRecipies = await Recipe.find()
            res.render('recipies.ejs', { recipies : allRecipies, username: req.user.displayName})
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
        //split ingredient into item, ammount, unit, image path and put into obj
        mealIngredients = []
        ingredients.forEach(ingredient => {
            let i = ingredient.split(',')
            let obj = {
                item : i[0],
                ammount: i[1],
                unit: i[2],
                image: i[3]
            }
            mealIngredients.push(obj)
        })
        try {
            await Recipe.create({
                recipeName: req.body.name, 
                cookingTime: req.body.cookingTime,
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
        res.render('addMeal.ejs', { images: res.locals.filenames})
    },
    getImagePaths: (req,res)=>{
        //sends a list of the files in the static public/images/ingredients folder
        // let files =  res.locals.filenames.map(file => {
        //     return  `/images/ingredients/${file}`
        // })
        let files = res.locals.filenames
        res.send(files.filter((file) => /\.(jpe?g|png)$/.test(file)))
    },
    getSelectedMeals: async (req,res)=>{
        try {
            //Currently ignore's if you have chosen same meal twice despite id being in twice on mongo TODO - fix
            const user = await User.find({_id: req.user._id})
            const userMeals = await Recipe.find( {_id : {$in: user[0].currentMeals}})
            res.render('selectedMeals.ejs', {recipies: userMeals, username: req.user.displayName})
        } catch (err) {
            console.error(err)
        }

        
    },
    deleteMeal: async (req,res)=>{
        try{
            await User.findOneAndUpdate({_id: req.user._id}, {$pull : {currentMeals: req.body.itemIdFromJSFile}})
            res.json('Deleted it')
        } catch(err){
            console.error(err)
        }
    },
    getMealInfo: async (req,res)=>{
        console.log(req.params.id)
        try {
            const data = await Recipe.find({_id: req.params.id})
            res.render('mealInfo.ejs', {mealData: data[0]})
        } catch (err) {
            console.error(err)
        }
        
    }
}