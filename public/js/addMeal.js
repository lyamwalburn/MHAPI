const addIngredientButton = document.querySelector('.addIngredientButton').addEventListener('click',addIngredient)
const itemName = document.querySelector('#ingredientName')
const itemAmmount = document.querySelector('#ingredientAmmount')
const suggestBox = document.querySelector('.autocomplete-box')
const dirPath = '/images/ingredients/'
let imagesPaths

const instructionInput = document.querySelector('#instructionInput')
const addInstructionButton = document.querySelector('.addInstructionButton').addEventListener('click',addInstructionStep)

let ingredients = {}
let instructions = []

const submitButton = document.querySelector('#submitButton').addEventListener('click',createRecipe)

fetch('http://localhost:3000/recipes/getImagePaths')
  .then(res => res.json())
  .then(data => imagesPaths = data)

function addIngredient(){
    const itemUnit = document.querySelector('#ingredientUnit')
    const ingredientsList = document.querySelector('.ingredientsList')

    if(!ingredients[`${itemName.value}`]){
        ingredients[`${itemName.value}`] = {name : itemName.value,ammount : itemAmmount.value, unit: itemUnit.value, image: `${dirPath}${itemName.value.replace(' ','-')}.jpeg`}
        const li = createIngredientLi(itemName.value,itemAmmount.value,itemUnit.value)
        ingredientsList.appendChild(li)
    }
    else{
        ingredients[`${itemName.value}`].ammount = parseInt(ingredients[`${itemName.value}`].ammount) + parseInt(itemAmmount.value)
        //find and update existing li text
        const li = document.querySelector(`[data-value="${itemName.value}"]`)
        li.childNodes[1].data = `${ingredients[`${itemName.value}`].ammount}${itemUnit.value} ${itemName.value}`
    }

    itemName.value = ""
    itemAmmount.value = ""
    itemUnit.value = ""
    itemName.focus()
}

function createIngredientLi(name,ammount,unit){
    const li = document.createElement('li')
    //<i class=" del fa-solid fa-trash-can"></i>
    const button = document.createElement('i')
    button.classList.add('del', 'fa-solid', 'fa-trash-can')
    button.addEventListener('click',deleteIngredient)
    const pic = document.createElement('picture')
    const image = document.createElement('img')
    image.src = `${dirPath}${name.replace(' ','-')}.jpeg`
    image.width = 40
    image.height = 40
    image.loading = 'lazy'
    image.decoding = 'async'
    pic.appendChild(image)
    li.appendChild(pic)
    li.appendChild(document.createTextNode(`${ammount}${unit} ${name}`))
    li.appendChild(button)
    li.dataset.value = `${name}`

    return li
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
    //create delete button
    const button = document.createElement('button')
    button.innerHTML = "Delete"
    button.classList.add('deleteButton')
    button.type = "button"
    button.addEventListener('click',deleteInstruction)
    li.appendChild(button)
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

function deleteIngredient(){
    //get the ingredient name from li
    let item = this.parentElement.dataset.value

    //remove the ingredient from the ingredients object
    delete ingredients[item]

    //remove li from page
    let lis = document.querySelectorAll(`[data-value="${item}"]`)
    lis.forEach(li => {
        li.remove()
   })
}


function deleteInstruction(){
    //TODO 
}

async function createRecipe(){

    //TODO - check we have at least 1 ingredient
    //     - check we have at least 1 instruction
    //     - check we have selected / uploaded a main image for meal

    //Object.keys(tempIngredients).length - measures length of objects inside object
    if(!Object.keys(tempIngredients).length > 0 && !instructions.length > 0) return  //TODO -display error messages

    //format the ingredients object to be sent to the server
    let ingredientsOutput = []
    for(let item in ingredients){
        ingredientsOutput.push(`${ingredients[item].name},${ingredients[item].ammount},${ingredients[item].unit},${ingredients[item].image}`)
    }
    try{
        const response = await fetch('/recipes/createRecipe', {
            method: 'post',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                "name": document.querySelector('#recipeName').value,
                "style": document.querySelector('#recipeStyle').value,
                "cookingTime": document.querySelector('#cookingTime').value,
                "image": document.querySelector('#recipieImage').value,
                "ingredients": ingredientsOutput.join('\r\n'),  
                "instructions": instructions.join('\r\n')
            })
        })
        .then(data => {
            //redirect back to recipies page with success message - TODO
            window.location.replace(data.url)
        })
    }catch(err){
        console.log(err)
    }
}