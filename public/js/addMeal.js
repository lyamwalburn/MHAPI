const addIngredientButton = document.querySelector('.addIngredientButton').addEventListener('click',addIngredient)
const itemName = document.querySelector('#ingredientName')
const itemAmmount = document.querySelector('#ingredientAmmount')
const suggestBox = document.querySelector('.autocomplete-box')
const dirPath = '/images/ingredients/'
let imagesPaths

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

    li.appendChild(document.createTextNode(`${itemAmmount.value}${itemUnit.value} ${itemName.value}`))
    // li.appendChild(button)
    ingredientsList.appendChild(li)

    if(ingredientTA.value !== '')
        ingredientTA.value += `\n${itemName.value},${itemAmmount.value},${itemUnit.value},${dirPath}${itemName.value.replace(' ','-')}.jpeg`
    else 
        ingredientTA.value += `${itemName.value},${itemAmmount.value},${itemUnit.value},${dirPath}${itemName.value.replace(' ','-')}.jpeg`

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
            return data.toLowerCase().startsWith(userInput.toLowerCase())
        })
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