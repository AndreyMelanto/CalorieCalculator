wrapper_html = document.getElementsByClassName('wrapper')[0]
async function output_recipes(data) {
    post_request(get_recipes_API, {url: ''})
    wrapper_html.innerHTML = ''
    recipes = await get_request(get_recipes_API, data)
    if(recipes.length > 0) {
        for(var i = 0; i < recipes.length; i++) {
            wrapper_html.innerHTML += '<a href="'+ window.location.href + recipes[i].id +'/">'
            +'<div class="recipe default_shadow_color second_shadow_color_hover">'
            +'<div class="title first_color text bold">'+ recipes[i].title +'</div>'
            +'<div class="image" style="background-image: url('+ recipes[i].photos +');"></div>'
            +'</div>'
            +'</a>'
    }
    } else {
        wrapper_html.innerHTML = '<span class="not_found bold">Ничего не найдено</span>'
    }
}


document.getElementsByClassName('title_search')[0].addEventListener('click', title_search)
async function title_search() {
    var text = document.getElementById('input').value
    output_recipes({title_search: text})
}

document.getElementsByClassName('products_search')[0].addEventListener('click', products_search)
async function products_search() {
    var text = document.getElementById('input').value
    output_recipes({products_search: text})
}



output_recipes({})