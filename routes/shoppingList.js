const express = require("express");
const router = express.Router()
const shoppingListController = require('../controllers/shoppingList')

router.get('/', shoppingListController.getShoppingList)
router.put('/markDone', shoppingListController.markDone)
router.put('/markIncomplete', shoppingListController.markIncomplete)
router.post('/addMeal',shoppingListController.addMeal)

module.exports = router