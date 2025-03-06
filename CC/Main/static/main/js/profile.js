async function output_saved_products() {
    var table_html = document.getElementById('product list')
    var table_title_html = document.getElementById('products title')
    var saved_products_ids = ''
    var saved_products = await get_request(get_saved_products_API, {})

    table_title_html.innerHTML = '<tr>'
        +'<th class="first_column">Продукт</th>'
        +'<th class="space_column"></th>'
        +'<th class="second_column">Масса</th>'
        +'<th class="button_column"></th>'
        +'</tr>'
    table_html.innerHTML = ''



    if(saved_products.length == 0) {
        table_title_html.innerHTML = ''
        table_html.innerHTML = '<div>Вы еще ничего не добавили</div>'
    } else if(saved_products.length == 1) {
        for(var i = 0; i < saved_products.length; i++) {
            saved_products_ids += saved_products[i].product_id + ' '
        }
        saved_products_ids = saved_products_ids.trimEnd()
        var products = await get_request(get_nutritional_values_API, {'id': saved_products_ids})
        table_html.innerHTML += '<tr>'
                +'<td class="first_column">'+ products.product +'</td>'
                +'<td class="space_column"></td>'
                +'<td class="second_column">'+ saved_products[0].count +'г</td>'
                +'<td class="button_column"><button class="second_color" value="'+ saved_products[0].id +'" onclick="delete_saved_product(this)"></button></td>'
                +'</tr>'
    } else {
        for(var i = 0; i < saved_products.length; i++) {
            saved_products_ids += saved_products[i].product_id + ' '
        }
        saved_products_ids = saved_products_ids.trimEnd()
        var products = await get_request(get_nutritional_values_API, {id: saved_products_ids})

        for(var i = 0; i < saved_products.length; i++) {
            table_html.innerHTML += '<tr>'
                +'<td class="first_column">'+ products[i].product +'</td>'
                +'<td class="space_column"></td>'
                +'<td class="second_column">'+ saved_products[i].count +'</td>'
                +'<td class="button_column"><button class="second_color" value="'+ saved_products[i].id +'" onclick="delete_saved_product(this)"></button></td>'
                +'</tr>'
        }
    }
}





delete_all_products_button_html = document.getElementById('delete all products')
delete_all_products_button_html.addEventListener('click', delete_all_products)
async function delete_all_products() {
    response = await post_request(delete_saved_product_API, {user_id: user_id, saved_product_id: 'all'})
    if(response) {
        output_saved_products()
        output_statistics()
    }
}





async function delete_saved_product(button) {
    response = await post_request(delete_saved_product_API, {user_id: user_id, saved_product_id: button.value})
    if(response) {
        output_saved_products()
        output_statistics()
    }
}



async function output_statistics() {
    async function scale_transition(scale, norm, nutrient){
        var width = (nutrient/(norm*2))*100
        if(width > 7) {
            scale.style.width = width + '%'
            if(width < 30) {
                scale.style.backgroundColor = '#0095ff'
            } else if(29 < width && width < 45 ){
                scale.style.backgroundColor = '#f2eb1d'
            } else if(44 < width && width < 65) {
                scale.style.backgroundColor = '#1df224'
            } else if(64 < width && width < 80) {
                scale.style.backgroundColor = '#f2eb1d'
            } else {
                scale.style.backgroundColor = '#f01d1d'
            }
        }
        if(20 < width && width < 71) {
            info = document.getElementById(scale.id +' more')
            info.style.justifyContent = 'center'
        } else if(70 < width) {
            info = document.getElementById(scale.id +' more')
            info.style.justifyContent = 'none'
            info = document.getElementById(scale.id +' info')
            info.style.right = '0'
        }
    }

    var saved_products = await get_request(get_saved_products_API, {})
    if(saved_products.length > 0) {
        var norm_of_nutrients = await get_request(get_norm_of_nutrients_API, {})
        if(norm_of_nutrients['norm_of_nutrients'] != undefined) {
            norm_of_nutrients = norm_of_nutrients['norm_of_nutrients'].split(';')
            var norm_of_calories = norm_of_nutrients[0]
            var norm_of_proteins = norm_of_nutrients[1]
            var norm_of_fats = norm_of_nutrients[2]
            var norm_of_carbohydrates = norm_of_nutrients[3]

            var scale_html
            var saved_products_ids = ''
            var count
            var calories = 0
            var proteins = 0
            var fats = 0
            var carbohydrates = 0

            if(saved_products.length == 1) {
                for(var i = 0; i < saved_products.length; i++) {
                    saved_products_ids += saved_products[i].product_id + ' '
                }
                saved_products_ids = saved_products_ids.trimEnd()
                var products = await get_request(get_nutritional_values_API, {id: saved_products_ids})
                count = saved_products[0].count

                calories = products.calories*count
                proteins = products.proteins*count
                fats = products.fats*count
                carbohydrates = products.carbohydrates*count

            } else {
                for(var i = 0; i < saved_products.length; i++) {
                    saved_products_ids += saved_products[i].product_id + ' '
                }
                saved_products_ids = saved_products_ids.trimEnd()
                var products = await get_request(get_nutritional_values_API, {id: saved_products_ids})

                for(var i = 0; i < saved_products.length; i++) {
                    count = saved_products[i].count

                    calories += products[i].calories*count
                    proteins += products[i].proteins*count
                    fats += products[i].fats*count
                    carbohydrates += products[i].carbohydrates*count
                }
            }
            calories /= 100
            proteins /= 100
            fats /= 100
            carbohydrates /= 100

            calories_more_html.innerHTML = 'Вы потребили: '+ calories.toFixed(2) +' Ккал<br>Ваша норма: '+ norm_of_calories +' Ккал'
            proteins_more_html.innerHTML = 'Вы потребили: '+ proteins.toFixed(2) +'г<br>Ваша норма: '+ norm_of_proteins +'г'
            fats_more_html.innerHTML = 'Вы потребили: '+ fats.toFixed(2) +'г<br>Ваша норма: '+ norm_of_fats +'г'
            carbohydrates_more_html.innerHTML = 'Вы потребили: '+ carbohydrates.toFixed(2) +'г<br>Ваша норма: '+ norm_of_carbohydrates +'г'

            scale_html = document.getElementById('calories')
            scale_transition(scale_html, norm_of_calories, calories)
            scale_html = document.getElementById('proteins')
            scale_transition(scale_html, norm_of_proteins, proteins)
            scale_html = document.getElementById('fats')
            scale_transition(scale_html, norm_of_fats, fats)
            scale_html = document.getElementById('carbohydrates')
            scale_transition(scale_html, norm_of_carbohydrates, carbohydrates)
        } else {
            element_html = document.getElementsByClassName('info')[0]
            element_html.innerHTML = '<span class="text">Рассчитайте свою суточную норму</span>'
        }
    } else {
        element_html = document.getElementsByClassName('info')[0]
            element_html.innerHTML = '<span class="text">Вы еще ничего не добавили</span>'
    }
}



calories_more_html = document.getElementById('calories info')
proteins_more_html = document.getElementById('proteins info')
fats_more_html = document.getElementById('fats info')
carbohydrates_more_html = document.getElementById('carbohydrates info')
async function more_info_hover(button) {
    if(button.id == 'calories more') calories_more_html.style.display = 'flex'
    if(button.id == 'proteins more') proteins_more_html.style.display = 'flex'
    if(button.id == 'fats more') fats_more_html.style.display = 'flex'
    if(button.id == 'carbohydrates more') carbohydrates_more_html.style.display = 'flex'
}
async function more_info_out(button) {
    if(button.id == 'calories more') calories_more_html.style.display = 'none'
    if(button.id == 'proteins more') proteins_more_html.style.display = 'none'
    if(button.id == 'fats more') fats_more_html.style.display = 'none'
    if(button.id == 'carbohydrates more') carbohydrates_more_html.style.display = 'none'
}



async function link_telegram() {
    response = await post_request(generate_telegram_token_API, {'user_id': user_id})
    window.location = response['link']
}



output_saved_products()
output_statistics()