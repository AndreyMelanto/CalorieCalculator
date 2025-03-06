async function main() {
    const products = await get_request(get_nutritional_values_API, {})

    const more_button_html = '<button class="more_products_button background second_text_color_hover" id="more products">Еще продукты</button>'

    async function output(product_list) {
        if(product_list.length != 0) {
            table.innerHTML = ''
            var page = 1

            for(var i = 0; i < 50  && i < product_list.length; i++) {
                if(product_list[i].is_product) {
                    table.innerHTML += '<tr>'
                    +'<td class="first_column">'+ product_list[i].product +'</td>'
                    +'<td class="second_column">'+ product_list[i].calories +' Ккал</td>'
                    +'<td class="third_to_fifth_column">'+ product_list[i].proteins +'г</td>'
                    +'<td class="third_to_fifth_column">'+ product_list[i].fats +'г</td>'
                    +'<td class="third_to_fifth_column">'+ product_list[i].carbohydrates +'г</td>'
                    +'<td class="sixth_column background"><button class="add_button add_button_border_color first_color_hover" onclick="save_product(this)" value='+ product_list[i].id +'></button></td>'
                    +'</tr>'
                }
            }
            if(product_list.length > 50) {
                table.innerHTML += more_button_html
                var more_button = document.getElementById('more products')
                more_button.addEventListener('click', more_products)
            }

            async function more_products() {
                table.innerHTML = table.innerHTML.replace(more_button_html, '')
                for(var i = page*50; i < page*50+50; i++) {
                    if(product_list[i].is_product) {
                        table.innerHTML += '<tr>'
                        +'<td class="first_column">'+ product_list[i].product +'</td>'
                        +'<td class="second_column">'+ product_list[i].calories +' Ккал</td>'
                        +'<td class="third_to_fifth_column">'+ product_list[i].proteins +'г</td>'
                        +'<td class="third_to_fifth_column">'+ product_list[i].fats +'г</td>'
                        +'<td class="third_to_fifth_column">'+ product_list[i].carbohydrates +'г</td>'
                        +'<td class="sixth_column background"><button class="add_button add_button_border_color" onclick="save_product(this)" value='+ product_list[i].id +'></button></td>'
                        +'</tr>'
                    }
                }
                if(product_list.length > page*50) {
                    table.innerHTML += more_button_html
                    page += 1
                }
                more_button = document.getElementById('more products')
                more_button.addEventListener('click', more_products)
            }
        } else {
            table.innerHTML = '<div class="not_found">Ничего не найдено</div>'
        }
    }

    output(products)

    input.addEventListener('input', filter)
    async function filter() {
        var product_list = []
        var search_list = input.value.toLowerCase().split(' ')
        for(var i = 0; i < products.length; i++) {
            if(products[i].is_product) {
                var result = true
                for(var search_word = 0; search_word < search_list.length; search_word++) {
                    if(products[i].product.toLowerCase().includes(search_list[search_word]) == false) {
                        result = false
                    }
                }
                if(result) product_list.push(products[i])
            }
        }
        output(product_list)
    }
}
main()



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
        //keyboard_ignore_modal()

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
        url = url.replace('products', 'account/login')
        window.location = url + '?next=/products    /'
    }
}