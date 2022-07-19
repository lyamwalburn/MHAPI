const express = require('express')
const router = express.Router()
const recipieController = require('../controllers/recipe')
const { ensureAuth, ensureGuest} = require('../middleware/auth')
const { getDirectoryContent} = require('../middleware/filenames')

router.get('/',ensureAuth, recipieController.getRecipies)
router.post('/createRecipe', recipieController.createRecipe)
router.post('/upMealImage',recipieController.uploadMealImage)
router.get('/addRecipe',recipieController.addRecipe)
router.get('/getImagePaths',getDirectoryContent,recipieController.getImagePaths)
router.get('/selectedMeals',recipieController.getSelectedMeals)
router.put('/selectedMeals/deleteMeal',recipieController.deleteMeal)
router.get('/mealInfo/:id',recipieController.getMealInfo)

module.exports = router