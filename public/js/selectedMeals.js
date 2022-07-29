const deleteButton = document.querySelectorAll('.del')


Array.from(deleteButton).forEach((el)=>{
    el.addEventListener('click', deleteItem)
})



async function deleteItem(){
    const itemId = this.dataset.id
    const name = this.dataset.name
    try{
        const response = await fetch('/recipes/selectedMeals/deleteMeal', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'itemIdFromJSFile': itemId,
                'mealName': name
            })
        })
        const data = await response.json()
        location.reload()
    }catch(err){
        console.log(err)
    }
}
