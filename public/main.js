const deleteBtn = document.querySelectorAll('.del')
const listItem = document.querySelectorAll('span.not')
const itemComplete = document.querySelectorAll('span.completed')
const delAllButton = document.querySelector('.del-all').addEventListener('click', deleteAllItems)
const startDeleteButton = document.querySelector('.del-start')
if(startDeleteButton){
    startDeleteButton.addEventListener('click',toggleDeleteBox)
}
const cancelButton = document.querySelector('.cancel').addEventListener('click',toggleDeleteBox)

const item = document.querySelectorAll('.shoppingItem')

Array.from(item).forEach((el)=>{
    el.addEventListener('click',toggleDone)
})

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteItem)
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
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function toggleDone(){
    const itemSpan = this.children[0].children[1]
    if(itemSpan.classList.contains('not')) {
        const todoId = itemSpan.parentNode.dataset.id
        try{
            const response = await fetch('shoppingList/markDone', {
                method: 'put',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'itemIdFromJSFile': todoId
                })
            })
            const data = await response.json()
            location.reload()
        }catch(err){
            console.log(err)
        }
    }
    else if(itemSpan.classList.contains('completed')){
        const todoId = itemSpan.parentNode.dataset.id
        try{
            const response = await fetch('shoppingList/markIncomplete', {
                method: 'put',
                headers: {'Content-type': 'application/json'},
                body: JSON.stringify({
                    'itemIdFromJSFile': todoId
                })
            })
            const data = await response.json()
            location.reload()
        }catch(err){
            console.log(err)
        }
    }
}

function toggleDeleteBox(){
    const messagebox = document.querySelector('.alert-container')
    const message = document.querySelector('.alert-message')
    message.textContent = `You still have items in your shopping list, are you sure you wish to delete all items this cannot be undone`
    messagebox.classList.toggle('active')
}

async function deleteAllItems(){
    try {
        const response = await fetch('shoppingList/clearList', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
            })
        })
        const data = await response.json()
        location.reload()
    } catch (err) {
        console.error(err)
    }
}