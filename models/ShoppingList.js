const mongoose = require('mongoose')

const ShoppingListSchema = new mongoose.Schema({
    ingredient: {
        type: String,
        required: true
   },
   ammount: {
       type: String,
       required: false
   },
   done: {
       type: Boolean,
       required: true
   }

})

module.exports = mongoose.model('ShoppingList', ShoppingListSchema)