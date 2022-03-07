const deleteButton = document.querySelectorAll('.del')


Array.from(deleteButton).forEach((el)=>{
    el.addEventListener('click', deleteItem)
})



async function deleteItem(){
    const itemId = this.dataset.id
    console.log(this.dataset.id);
    try{
        const response = await fetch('/recipes/selectedMeals/deleteMeal', {
            method: 'put',
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
