const express = require('express')
const router = express.Router()
const recipieController = require('../controllers/recipe')

router.get('/', recipieController.getRecipies)
router.post('/createRecipe', recipieController.createRecipe)
router.get('/addRecipe',recipieController.addRecipe)

module.exports = router