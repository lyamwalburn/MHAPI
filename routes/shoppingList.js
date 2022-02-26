const express = require("express");
const router = express.Router()
const shoppingListController = require('../controllers/shoppingList')

router.get('/', shoppingListController.getShoppingList)
router.put('/markDone', shoppingListController.markDone)
router.put('/markIncomplete', shoppingListController.markIncomplete)
router.post('/addMeal/:id',shoppingListController.addMeal)
router.delete('/deleteItem',shoppingListController.deleteItem)

module.exports = router