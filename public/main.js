const deleteBtn = document.querySelectorAll('.del')
const listItem = document.querySelectorAll('span.not')
const itemComplete = document.querySelectorAll('span.completed')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteItem)
})

Array.from(listItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(itemComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

async function deleteItem(){
    const itemId = this.parentNode.dataset.id
    console.log(this.parentNode.dataset.id);
    try{
        const response = await fetch('shoppingList/deleteItem', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'itemIdFromJSFile': itemId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('shoppingList/markDone', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'itemIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('shoppingList/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'itemIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}
// add clear all button