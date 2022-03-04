const express = require("express");
const router = express.Router()
const shoppingListController = require('../controllers/shoppingList')
const { ensureAuth, ensureGuest} = require('../middleware/auth')

router.get('/',ensureAuth, shoppingListController.getShoppingList)
router.put('/markDone', shoppingListController.markDone)
router.put('/markIncomplete', shoppingListController.markIncomplete)
router.post('/addMeal/:id',ensureAuth,shoppingListController.addMeal)
router.delete('/deleteItem',ensureAuth,shoppingListController.deleteItem)
router.delete('/clearList',ensureAuth,shoppingListController.deleteAllItems)

module.exports = router