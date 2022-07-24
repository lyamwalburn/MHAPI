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

fetch('/recipes/getImagePaths')
  .then(res => res.json())
  .then(data => imagesPaths = data)

function addIngredient(){
    //check the field has been filled for item name and ammount
    //TODO - add error message
    if(itemName.value.trim() === "" || itemAmmount.value.trim() === "") return

    const itemUnit = document.querySelector('#ingredientUnit')
    const ingredientsList = document.querySelector('.ingredientsList')

    if(!ingredients[`${itemName.value}`]){
        ingredients[`${itemName.value}`] = {name : itemName.value,ammount : itemAmmount.value, unit: itemUnit.value, image: `${dirPath}${itemName.value.replaceAll(' ','-')}.jpeg`}
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
    removeChildMessages(itemName.parentNode.parentNode)
    itemName.focus()
}

function createIngredientLi(name,ammount,unit){
    const li = document.createElement('li')
    const button = document.createElement('i')
    button.classList.add('del', 'fa-solid', 'fa-trash-can')
    button.addEventListener('click',deleteIngredient)
    const pic = document.createElement('picture')
    const image = document.createElement('img')
    image.src = `${dirPath}${name.replaceAll(' ','-')}.jpeg`
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
            </picture>${data.replaceAll('-',' ').replace(/\..+$/, '')}</li>`
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

//hide the suggest box if focus is moved -- TODO fix as trying to click on a dropdown moves focus and thus closes it
// itemName.addEventListener('focusout', ()=> {
//     suggestBox.classList.remove('active')
// })

function showSuggestions(list){
    let listData
    if(list.length){
        listData = list.join(' ')
    } else {
        //item doesnt exist already so show users input 
        //todo also prompt to upload ingredient image
        listData = `<li>${itemName.value}</li>`
    }
    suggestBox.innerHTML = listData
}

function addInstructionStep(){
    const instructionsList = document.querySelector('.instructionsList')
    if(instructionInput.value.trim() === "") return
    const li = document.createElement('li')
    //split the input and feed into paragraphs to maintain spacing on display
   // console.log(buildInstructionStepString(instructionInput.value.split('\n')))
    let paragraphs = instructionInput.value.split('\n')
    const stepContainer = document.createElement('div')
    stepContainer.classList.add('instructionText')
    paragraphs.forEach(p => {
        //prevent empty elements
       if(p === '') return 
       let element = document.createElement('p')
       element.appendChild(document.createTextNode(p))
       stepContainer.appendChild(element)
    })
    li.appendChild(stepContainer)
    //create delete button
    const button = document.createElement('i')
    button.classList.add('del', 'fa-solid', 'fa-trash-can')
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
    //removes the instruction and deletes the li displaying it

    //if you delete an instruction that starts the same as another instruction it will delete both
    //TODO fix this 
    instructions = instructions.filter(el=>{
       return !el.startsWith(this.parentElement.childNodes[0].childNodes[0].innerText)
    })
    this.parentElement.remove()
   
}

async function createRecipe(){

    if(!validatePageThree()) return 

    //format the ingredients object to be sent to the server
    //TODO send the input as it is here and sort the data server side????
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
                "image": `/images/${fileInput.files[0].name}`, 
                "ingredients": ingredientsOutput.join('\r\n'),  
                "instructions": instructions.join('\r\n')
            })
        })
        const data = await response.json()
        window.location.replace(data.url)
    }catch(err){
        console.log(err)
    }
}

//Image Upload-----------------------------------------------------------------------------------
const fileInput = document.querySelector('#recipieImage')
fileInput.addEventListener('change', ()=> {
    //removes any previous error success messages when sending to server should perhaps be onchange for the input instead
    let messages = fileInput.parentNode.parentNode.querySelectorAll('.message')
    messages.forEach(message=>{
        message.remove()
    })
   
    //change the span text to reflect the chosen file
    const fileName = document.querySelector('.fileName')
    fileName.textContent = fileInput.files[0].name
    fileName.style.opacity = 1

    //change the background of the preview area to show the image
    const reader = new FileReader()
    reader.addEventListener('load',()=>{
        let uploadedImage = reader.result
        const previewArea = document.querySelector('.previewImage').style.backgroundImage = `url(${uploadedImage})`
    })
    reader.readAsDataURL(fileInput.files[0])
    uploadFile(fileInput.files[0])
})

//TODO -- ammend function to take route and name as params so can be used for ingredients as well
//TODO -- sanatise uploads to just jpg png etc
//TODO -- add recapatcha to prevent spam uploads
const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('mainImage',file)
    const response = await fetch('/recipes/upMealImage', {
      method: 'POST',
      body: formData //File to upload
    })
    const success = await response.json()
    console.log(success) // Handle the success response object
        //display upload success on page 
        if(success.status){
            //create a success message and append it to the dom
            fileInput.parentNode.classList.remove('focus')
            fileInput.parentNode.parentNode.appendChild(createMessage(MESSAGETYPE.SUCCESS,'Image uploaded successfully'))
        }
        else {
            //display error on page 
            fileInput.parentNode.parentNode.appendChild(createMessage(MESSAGETYPE.ERROR,'Image uploaded failed'))
        }        
   
  }


  //Multipage form next back button control
  let pageNumber = 0
  const tabs = document.querySelectorAll('.tab')
  const nextButtons = document.querySelectorAll('.next')
  const backButtons = document.querySelectorAll('.back')
  const trackerSteps = document.querySelectorAll('.step')
  nextButtons.forEach(button=> {
    button.addEventListener('click', ()=>{
        //check required fields
        switch(pageNumber){
            case 0: if(!validatePageOne()) return
            break
            case 1: if(!validatePageTwo()) return
            break
            case 2: //if(!validatePageThree()) return -- final page validation is done in createRecipe()
        }
        if(pageNumber <2) pageNumber++
        setActiveTab()
      })
  })
  backButtons.forEach(button=> {
    button.addEventListener('click', ()=>{
        if(pageNumber >0) pageNumber--
        setActiveTab()
    })
    })

function setActiveTab(){
    tabs.forEach(tab=>{
            tab.classList.remove('active')
    })
    trackerSteps.forEach(step=>{
        step.classList.remove('active')
    })
        switch(pageNumber){
            case 0: tabs[0].classList.add('active') 
                    trackerSteps[0].classList.add('active')
            break
            case 1: tabs[1].classList.add('active')
                    trackerSteps[1].classList.add('active')
            break
            case 2: tabs[2].classList.add('active')
                    trackerSteps[2].classList.add('active')
            break
        }
}


//Form Validation--------------------------------------------------------------------------------------------
function validatePageOne(){
    const recipeName = document.querySelector('#recipeName')
    recipeName.addEventListener('keyup', ()=>{
        removeChildMessages(recipeName.parentNode)
    })
    if(recipeName.value.length < 1) {
        if(recipeName.parentNode.childElementCount <3) {
            recipeName.parentNode.appendChild(createMessage(MESSAGETYPE.REQUIRED,'recipie must have a title'))
        }
        recipeName.focus()
        return false
    }
    const style = document.querySelector('#recipeStyle')
    style.addEventListener('keyup', ()=>{
        removeChildMessages(style.parentNode)
    })
    if(style.value.length < 1) {
        if(style.parentNode.childElementCount <3) {
            style.parentNode.appendChild(createMessage(MESSAGETYPE.REQUIRED,'enter a cuisine style'))
        }
        style.focus()
        return false
    }
    const time = document.querySelector('#cookingTime')
    time.addEventListener('keyup', ()=>{
        removeChildMessages(time.parentNode)
    })
    if(time.value < 1) {
        if(time.parentNode.childElementCount <3) {
            time.parentNode.appendChild(createMessage(MESSAGETYPE.REQUIRED,'enter cooking duration'))
        }
        time.focus()
        return false
    }
    if(!fileInput.files[0]){
        if(fileInput.parentNode.parentNode.childElementCount <3) {
            fileInput.parentNode.parentNode.appendChild(createMessage(MESSAGETYPE.REQUIRED,'upload a meal image'))
        }
        //TODO - add blue border around input area to draw attention
        fileInput.parentNode.classList.add('focus')
        return false
    }
    return true
}

function validatePageTwo(){
    if(!Object.keys(ingredients).length > 0){
        const container = document.querySelector('.left')
        if(container.childElementCount <5) {
            container.appendChild(createMessage(MESSAGETYPE.REQUIRED,'enter at least one ingredient'))
        }
        itemName.focus()
        return false
    }
    return true
}

function validatePageThree(){
    if(!instructions.length > 0){
        const container = instructionInput.parentNode
        console.log(container.lastChild)
        if(container.childElementCount <3) {
            container.insertBefore(createMessage(MESSAGETYPE.REQUIRED,'please enter instructions'),container.lastChild)
        }
        instructionInput.focus()
        return false
    }
    return true
}

//Messaging -- Success, Error, Required ---------------------------------------

const MESSAGETYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    REQUIRED: 'required'
}
//create a message element with custom message

const createMessage = (type, messageText)=>{
    const message = document.createElement('div')
    message.classList.add('message', `${type}`, 'active') //aslo add type class required success failure
    const icon = document.createElement('i')
    switch (type) {
        case MESSAGETYPE.ERROR : icon.classList.add('fa-solid','fa-xmark')
        break
        case MESSAGETYPE.SUCCESS : icon.classList.add('fa-solid','fa-check')
        break
        case MESSAGETYPE.REQUIRED : icon.classList.add('fa-solid','fa-exclamation')
        break
    }
    const textContainer = document.createElement('div')
    const headerText = document.createElement('span')
    headerText.textContent = type
    const messageInfo = document.createElement('span')
    messageInfo.textContent = messageText
    textContainer.classList.add('textContainer')
    textContainer.appendChild(headerText)
    textContainer.appendChild(messageInfo)
    message.appendChild(icon)
    message.appendChild(textContainer)
    return message
}

const removeChildMessages = (node) => {
    let messages = node.querySelectorAll('.message')
        messages.forEach(message=>{
            message.remove()
        })
}
