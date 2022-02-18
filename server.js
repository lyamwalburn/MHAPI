const { response } = require('express')
const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())


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


app.get('/', (req,res)=>{
    res.send('<h1>Hello From Server</h1>')
})

app.get('/api/recipes',(req,res)=>{
    res.json(recipes)
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})