async function output_recipe_info() {
    var recipe = await get_request(get_recipe_API, {recipe_id: document.getElementById('recipe id').textContent})



    document.getElementsByTagName('title')[0].textContent = recipe['title']
    document.getElementsByClassName('recipe_title')[0].textContent = recipe['title']
    document.getElementsByClassName('main_image')[0].style.backgroundImage = 'url('+ recipe['photos'].split(';')[0] +')'
    document.getElementsByClassName('description')[0].textContent = recipe['description']



    document.getElementById('recipe count').textContent = 'Количество порций: ' + recipe['count']
    document.getElementById('all').textContent = 'Общее время готовки: ' + recipe['time'].split(';')[0]
    if(recipe['time'].includes('None') == false) {
        document.getElementById('active').textContent = 'Активное время готовки: ' + recipe['time'].split(';')[1]
    } else {
        document.getElementById('active').style.display = 'none'
    }
    products = recipe['ingredients'].split('|')
    products.pop()
    ing_html = document.getElementById('ing info')
    for(var i = 0; i < products.length; i++){
        product = products[i].split(';')
        product.pop()
        for(var t = 0; t < product.length; t++) {
            ingredient_html = document.getElementsByClassName('ingredient')
            ingredient_html = ingredient_html[ingredient_html.length - 1]
            if(product[t].includes('[g]')) {
                ing_html.innerHTML += '<div class="group cpfc_text bold">'+ product[t].replace('[g]', '') +'</div>'
                if(i == 0 ) {
                    document.getElementsByClassName('group')[0].style.marginTop = '3vh'
                }
            } else if(product[t].includes('[p]')) {
                ing_html.innerHTML += '<div class="ingredient text">'
                    +'<span class="p_title">'+ product[t].replace('[p]', '') +'</span>'
                    +'<span class="p_e"></span>'
                    +'</div>'
            } else if(product[t].includes('[d]')) {
                ingredient_html.innerHTML += '<span class="p_description">'+ product[t].replace('[d]', '') +'</span>'
            } else if(product[t].includes('[c]')) {
                ingredient_html.innerHTML += '<div class="line third_text_color"></div>'
                    +'<span class="p_count">'+ product[t].replace('[c]', '') +'</span>'
            } else if(product[t].includes('[e]')) {
                ingredient_html.innerHTML += '<span class="p_e">'+ product[t].replace('[e]', '') +'</span>'
            }
        }
    }



    nutritional_value = await get_request(get_nutritional_values_API, {'id': recipe['nutritional_value']})
    document.getElementById('calories info').textContent = nutritional_value['calories'] + ' Ккал'
    document.getElementById('proteins info').textContent = nutritional_value['proteins'] + 'г'
    document.getElementById('fats info').textContent = nutritional_value['fats'] + 'г'
    document.getElementById('carbohydrates info').textContent = nutritional_value['carbohydrates'] + 'г'

    proteins_percent = ((nutritional_value['proteins']*4)/nutritional_value['calories'])*100
    fats_percent = ((nutritional_value['fats']*9)/nutritional_value['calories'])*100
    carbohydrates_percent = ((nutritional_value['carbohydrates']*4)/nutritional_value['calories'])*100
    percent_sum = proteins_percent + fats_percent + carbohydrates_percent
    if(percent_sum > 100) {
        del = (percent_sum - 100)/3
        proteins_percent -= del
        fats_percent -= del
        carbohydrates_percent -= del
    }

    if(proteins_percent > 0) {
        if(proteins_percent > 2) proteins_percent -= 2
        document.getElementById('proteins').style.width = proteins_percent + '%'
        if(proteins_percent > 15) document.getElementById('proteins').textContent = Math.round(proteins_percent) + '%'
    } else document.getElementById('proteins').style.display = 'none'

    if(fats_percent > 0) {
        if(fats_percent > 2) fats_percent -= 2
        document.getElementById('fats').style.width = fats_percent + '%'
        if(fats_percent > 15) document.getElementById('fats').textContent = Math.round(fats_percent) + '%'
    } else document.getElementById('fats').style.display = 'none'

    if(carbohydrates_percent > 0) {
        if(carbohydrates_percent > 2) carbohydrates_percent -= 2
        document.getElementById('carbohydrates').style.width = carbohydrates_percent + '%'
        if(carbohydrates_percent > 15) document.getElementById('carbohydrates').textContent = Math.round(carbohydrates_percent) + '%'
    } else document.getElementById('carbohydrates').style.display = 'none'

    document.getElementById('save recipe button').value = recipe['nutritional_value']



    steps_html = document.getElementsByClassName('steps')[0]
    steps = recipe['steps'].split(';')
    steps.pop()
    photos = recipe['photos'].split(';')
    photos.pop()
    photos.shift()
    for(var i = 0; i < photos.length; i++) {
        var x = i+1
        var step = steps[i]
        if(step == undefined) step = 'Для этого шага нет описания :('
        if(i%2 == 0) var step_class = 'step_odd'
        else var step_class = 'step_even'
        steps_html.innerHTML += '<div class="first_color second_shadow_color text '+ step_class +'">'
            +'<span class="step_title bold">Шаг '+ x +'</span>'
            +'<img src="'+ photos[i] +'">'
            +'<span class="step_text">'+ step +'</span>'
            +'</div>'
    }
    steps_html.innerHTML += '<span class="empty"></span>'
}

output_recipe_info()


var click = 0
function open_description(description) {
    if(click%2 == 0) description.style.maxHeight = '1000vh'
    else description.style.maxHeight = '54vh'
    click++
}



async function save_product(button) {
    if(user_id != null) {
        var body_html = document.getElementById('body')
        var text_html = document.getElementById('save product text')
        var error_text_html = document.getElementById('error')
        var save_product_window_html = document.getElementById('save product window')
        var background_for_window_html = document.getElementById('background for window')
        var ok_button_html = document.getElementById('ok button')
        var no_button_html = document.getElementById('no button')

        product_id = button.value
        const product = await get_request(get_nutritional_values_API, {id: product_id})

        text_html.textContent = product.product
        body_html.style.overflowY = 'hidden'
        error_text_html.textContent = ''
        save_product_window_html.style.display = 'flex'
        keyboard_ignore_modal()

        ok_button_html.addEventListener('click', click_ok)
        async function click_ok() {
            input_count_html = document.getElementById('input count')
            count = +input_count_html.value

            if(isNaN(count) == false && count != 0 && count > 0 && count%1 == 0) {
                input_count_html.value = ''
                save_product_window_html.style.display = 'none'
                body_html.style.overflowY = 'auto'
                post_request(save_product_API, {user_id: user_id, product_id: product_id, count: count})
            } else if(isNaN(count)) {
                error_text_html.textContent = 'Введите число'
            } else if(count == 0) {
                error_text_html.textContent = 'Заполните поле'
            } else if(count%1 != 0) {
                error_text_html.textContent = 'Введите натуральное число'
            } else {
                error_text_html.textContent = 'Ошибка'
            }
        }

        no_button_html.addEventListener('click', click_no)
        background_for_window_html.addEventListener('click', click_no)
        async function click_no() {
            input_count_html = document.getElementById('input count')
            save_product_window_html.style.display = 'none'
            body_html.style.overflowY = 'auto'
            input_count_html.value = ''
        }
    } else {
        var url = window.location.href
        url_s = url.split('recipes')
        window.location = url_s[0] + 'account/login/?next=/recipes' + url_s[1]
    }
}