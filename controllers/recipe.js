const { render } = require('express/lib/response')
const res = require('express/lib/response')
const Recipe = require('../models/Recipe')
const User = require('../models/User')


module.exports = {
    getRecipies: async (req,res) => {
        try {
            let allRecipies = await Recipe.find()
            const user = await User.find({_id: req.user._id})
            const userMeals = await Recipe.find( {_id : {$in: user[0].currentMeals}})
            //mark any meals that the user has in their selected meals
            allRecipies.forEach(meal => {
                userMeals.forEach(userMeal =>{

                    if(meal._id.toString() === userMeal._id.toString()){
                        meal.inBasket = true
                    }
                })
            })
            res.render('recipies.ejs', { recipies : allRecipies, username: req.user.displayName, messages : req.flash('info')})
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
                description: req.body.description,
                classification: 'Chicken',
                ingredients: mealIngredients,
                image: req.body.image,
                instructions: steps,
            })
            req.flash('info',`${req.body.name} succesfully added`)
            res.json({url :'/recipes'})
        } catch (err) {
            console.error(err)
        }
    },
    uploadMealImage: async (req,res)=>{
        try {
            if(!req.files){
                res.send({
                    status: false,
                    message: 'No File Uploaded'
                })
            }
            else {
                let mainImage = req.files.mainImage
                //place image in upload directory
                mainImage.mv('./public/images/' + mainImage.name)
                res.send({
                    status: true,
                    message: 'File Upload Success',
                    data: {
                        name: mainImage.name,
                        mimeType: mainImage.mimetype,
                        size: mainImage.size
                    }
                })

            }
        } 
        catch (err){
            res.status(500).send(err)
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
            res.render('selectedMeals.ejs', {recipies: userMeals, username: req.user.displayName, messages : req.flash('info')})
        } catch (err) {
            console.error(err)
        }

        
    },
    deleteMeal: async (req,res)=>{
        try{
            console.log(req.body.mealName)
            await User.findOneAndUpdate({_id: req.user._id}, {$pull : {currentMeals: req.body.itemIdFromJSFile}})
            req.flash('info',`${req.body.mealName} removed from selected meals`)
            res.json('Deleted it')
        } catch(err){
            console.error(err)
        }
    },
    getMealInfo: async (req,res)=>{
        try {
            const data = await Recipe.find({_id: req.params.id})
            const user = await User.find({_id: req.user._id})
            const userMeals = await Recipe.find( {_id : {$in: user[0].currentMeals}})

            userMeals.forEach(meal => {
                if(meal._id.toString() === data[0]._id.toString()){
                    data[0].inBasket = true
                }
            })
            res.render('mealInfo.ejs', {mealData: data[0], messages : req.flash('info') })
        } catch (err) {
            console.error(err)
        }
        
    }
}