const addIngredientButton = document.querySelector('.addIngredientButton').addEventListener('click',addIngredient)
const imagesPath = '/images/ingredients/'
function addIngredient(){
    const itemName = document.querySelector('#ingredientName')
    const itemAmmount = document.querySelector('#ingredientAmmount')
    const itemUnit = document.querySelector('#ingredientUnit')
    const itemImage = document.querySelector('#ingredientImage')
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
        ingredientTA.value += `\n${itemName.value},${itemAmmount.value},${itemUnit.value},${imagesPath}${itemImage.value}`
    else 
        ingredientTA.value += `${itemName.value},${itemAmmount.value},${itemUnit.value},${imagesPath}${itemImage.value}`

    itemName.value = ""
    itemAmmount.value = ""
    itemUnit.value = ""
    itemImage.value = ""

    itemName.focus()
}
