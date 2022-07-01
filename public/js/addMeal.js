const addIngredientButton = document.querySelector('.addIngredientButton').addEventListener('click',addIngredient)
const itemName = document.querySelector('#ingredientName')
const itemAmmount = document.querySelector('#ingredientAmmount')
const suggestBox = document.querySelector('.autocomplete-box')
const dirPath = '/images/ingredients/'
let imagesPaths

const instructionInput = document.querySelector('#instructionInput')
const addInstructionButton = document.querySelector('.addInstructionButton').addEventListener('click',addInstructionStep)

const ingredients = []
const instructions = []

const submitButton = document.querySelector('#submitButton').addEventListener('click',createRecipe)

fetch('http://localhost:3000/recipes/getImagePaths')
  .then(res => res.json())
  .then(data => imagesPaths = data)

function addIngredient(){
    const itemUnit = document.querySelector('#ingredientUnit')
    const ingredientsList = document.querySelector('.ingredientsList')
    const ingredientTA = document.querySelector('#ingredientsTA')

    const li = document.createElement('li')
    // const button = document.createElement('button')
    // button.innerHTML = "Delete"
    // button.classList.add('deleteButton')
    const pic = document.createElement('picture')
    const image = document.createElement('img')
    image.src = `${dirPath}${itemName.value.replace(' ','-')}.jpeg`
    image.width = 40
    image.height = 40
    image.loading = 'lazy'
    image.decoding = 'async'
    pic.appendChild(image)
    li.appendChild(pic)
    li.appendChild(document.createTextNode(`${itemAmmount.value}${itemUnit.value} ${itemName.value}`))
    

    // li.appendChild(button)
    ingredientsList.appendChild(li)

    //add ingredients array to be used for submission -- '\n' will need to be added when combining the string for submission 
    ingredients.push(`${itemName.value},${itemAmmount.value},${itemUnit.value},${dirPath}${itemName.value.replace(' ','-')}.jpeg`)

    itemName.value = ""
    itemAmmount.value = ""
    itemUnit.value = ""
    itemName.focus()
}

itemName.onkeyup = (e)=> {
    let userInput = e.target.value
    let suggestions = [] 
    if(userInput){
        suggestions = imagesPaths.filter((data)=>{
            //filter the suggestions by the users input
            return data.toLowerCase().replace('-',' ').startsWith(userInput.toLowerCase())
        })
        //return a list item with the img source reformatted
        suggestions = suggestions.map((data)=>{
            return data = `<li><picture>
            <img aria-hidden="true" loading="lazy" decoding="async" src="${dirPath}${data}" width="40" height="40">
            </picture>${data.replace('-',' ').replace(/\..+$/, '')}</li>`
        })
       suggestBox.classList.add('active')
       showSuggestions(suggestions)
       let suggestionItems = suggestBox.querySelectorAll('li')
        suggestionItems.forEach(item => {
            item.addEventListener('click',()=> {
                itemName.value = item.textContent.trim()
                suggestBox.classList.remove('active')
                itemAmmount.focus()
            })
        })
    } else {
        suggestBox.classList.remove('active')
    }
}

function showSuggestions(list){
    let listData
    if(list.length){
        listData = list.join(' ')
    } else {
        //item doesnt exist already so show users input 
        //perhaps also prompt to upload ingredient image
        listData = `<li>${itemName.value}</li>`
    }
    suggestBox.innerHTML = listData
}

function addInstructionStep(){
    const instructionsTA = document.querySelector('#instructionsTA')
    const instructionsList = document.querySelector('.instructionsList')

    const li = document.createElement('li')
    //split the input and feed into paragraphs to maintain spacing on display
    console.log(buildInstructionStepString(instructionInput.value.split('\n')))
    let paragraphs = instructionInput.value.split('\n')
    paragraphs.forEach(p => {
        //prevent empty elements
       if(p === '') return 
       let element = document.createElement('p')
       element.appendChild(document.createTextNode(p))
       li.appendChild(element)
    })
    instructionsList.appendChild(li)

    //add instructions array to be used for submission -- '\n' will need to be added after elements when combining the string for submission 
    instructions.push(buildInstructionStepString(instructionInput.value.split('\n')))
    instructionInput.value = ''
    instructionInput.focus()
}

function removeLineBreaks(string){
    return string.replace(/(\r\n|\n|\r)/gm, "")
}

function buildInstructionStepString(input){
    //takes in array from instructions removes blank elements and puts '. ' between them to create sentance structure
    let output = ''
    input.forEach(sentance => {
        if(sentance === '') return
        output += `${sentance}. `
    })
    return output.trim()
}

async function createRecipe(){

    //TODO - check we have at least 1 ingredient
    //     - check we have at least 1 instruction
    //     - check we have selected / uploaded a main image for meal


    try{
        const response = await fetch('/recipes/createRecipe', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                "name": document.querySelector('#recipeName').value,
                "style": document.querySelector('#recipeStyle').value,
                "cookingTime": document.querySelector('#cookingTime').value,
                "image": document.querySelector('#recipieImage').value,
                "ingredients": ingredients.join('\r\n'),
                "instructions": instructions.join('\r\n')
            })
        })
        location.reload()
    }catch(err){
        console.log(err)
    }
}