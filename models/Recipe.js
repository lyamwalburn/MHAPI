const mongoose = require('mongoose')

//TODO add ammounts with ingredients so ingredients is object like {Chicken breasts : 2}, {Red Pepper : 1}, for spices sauces flours should contain units e.g { Paprika : 1, unit : 'tsp'}, {Soy sauce : 30, unit :'ml'}
const RecipieSchema = new mongoose.Schema({
    recipeName: {
        type: String,
        required: true
    },
    cookingTime: {
        type: Number,
        required: true
    },
    cuisineStyle: {
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false
    },
    classification: {
        type: String,
        required: false
    },
    ingredients:{
        type: Array,
        required: false
    },
    image:{
        type: String,
        required: false
    },
    instructions:{
        type: Array,
        required: false
    }

})

module.exports = mongoose.model('Recipie', RecipieSchema)