const mongoose = require('mongoose')
//TODO fix structure so that ammount isn't stored twice once in ingredient object and independantly currently this should not be the case
const ShoppingListSchema = new mongoose.Schema({
    ingredient: {
        type: String,
        required: true,
   },
   ammount: {
       type: Number,
       required: true,
   },
   unit: {
       type: String,
       required: false,
   },
   userId: {
       type: String,
       required: false,
   },
   done: {
       type: Boolean,
       required: true,
   }

})

module.exports = mongoose.model('ShoppingList', ShoppingListSchema)