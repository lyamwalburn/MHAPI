const express = require('express')
const router = express.Router()
const recipieController = require('../controllers/recipe')
const { ensureAuth, ensureGuest} = require('../middleware/auth')

router.get('/',ensureAuth, recipieController.getRecipies)
router.post('/createRecipe', recipieController.createRecipe)
router.get('/addRecipe',recipieController.addRecipe)
router.get('/selectedMeals',recipieController.getSelectedMeals)
router.put('/selectedMeals/deleteMeal',recipieController.deleteMeal)

module.exports = router