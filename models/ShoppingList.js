const mongoose = require('mongoose')

const ShoppingListSchema = new mongoose.Schema({
    ingredient: {
        type: String,
        required: true
   },
   ammount: {
       type: Number,
       required: true
   },
   done: {
       type: Boolean,
       required: true
   }

})

module.exports = mongoose.model('ShoppingList', ShoppingListSchema)