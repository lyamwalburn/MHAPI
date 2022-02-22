const mongoose = require('mongoose')

/*
let recipes = [
    {
        id: 1,
        recipieName: 'Chicken Tika Masala',
        cookingTime: '40 minutes',
        cuisineStyle: 'Indian',
        cassification: 'Chicken',
        ingredients: [{
            chicken: '250g',
            rice: '300g',
            yoghurt: '80g',
            tumeric: '1tsp',
            paprika: '1.5tsp',
            garamMasala: '1tsp'
        }],
        image: 'www.instagram.com',
        instructions: [{
            step1: 'cook chicken',
            step2: 'cook masala',
            step3: 'eat'
        }]
    }
]
*/
///
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