const user_id = JSON.parse(document.getElementById('user_id').textContent)
const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;

const get_nutritional_values_API = 'http://127.0.0.1:8000/api/get_nutritional_values/';
const get_saved_products_API = 'http://127.0.0.1:8000/api/get_saved_products/';
const get_norm_of_nutrients_API = 'http://127.0.0.1:8000/api/get_norm_of_nutrients/';
const get_recipes_API = 'http://127.0.0.1:8000/api/get_recipes/';
const get_recipe_API = 'http://127.0.0.1:8000/api/get_recipe/';
const get_site_statistics_API = 'http://127.0.0.1:8000/api/get_site_statistics/';

const save_product_API = 'http://127.0.0.1:8000/api/save_product/';
const delete_saved_product_API = 'http://127.0.0.1:8000/api/delete_saved_product/';
const registration_API = 'http://127.0.0.1:8000/api/registration/';
const calculator_API = 'http://127.0.0.1:8000/api/calculator/';
const generate_telegram_token_API = 'http://127.0.0.1:8000/api/generate_telegram_token/';

const text = '#fff1db';
const second_color = '#ff9c08';
const third_color = '#ffd494'; // not used

var response



async function post_request(url, data) {
    response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8', 'X-CSRFToken': csrf_token},
        body: JSON.stringify(data)
    })
    return await response.json()
}

async function get_request(url, data) {
    url += '?user_id='+ user_id
    keys = Object.keys(data)
    for(var i = 0; i < keys.length; i++) {
        url += '&'+ keys[i] +'='+ data[keys[i]]
    }
    response = await fetch(url)
    return await response.json()
}

function keyboard_ignore() {
    var wrapper_html = document.getElementsByClassName('wrapper')[0]
    wrapper_html.style.minHeight = wrapper_html.offsetHeight + 'px'

    var el = document.getElementsByTagName('form')[0]
    var style = window.getComputedStyle(el, null).getPropertyValue('border-radius');
    var borderRadius = parseFloat(style);
    el.style.borderRadius = borderRadius + 'px';


    var elements = [
        spans = document.getElementsByTagName('span'),
        inputs = document.getElementsByTagName('input'),
        divs = document.getElementsByTagName('div'),
        buttons = document.getElementsByTagName('button')
    ]

    for(var i = 0; i < 4; i++) {
        for(var t = 0; t < elements[i].length; t++) {
            var el = elements[i][t]

            var style = window.getComputedStyle(el, null).getPropertyValue('font-size')
            var fontSize = parseFloat(style)
            el.style.fontSize = fontSize + 'px'

            var style = window.getComputedStyle(el, null).getPropertyValue('border-radius')
            var borderRadius = parseFloat(style)
            el.style.borderRadius = borderRadius + 'px'
        }
    }
}
function keyboard_ignore_calculator() {
    var style

    elements = [
        document.getElementsByTagName('div'),
        document.getElementsByTagName('input'),
        document.getElementsByTagName('span')
    ]

    for(var t = 0; t < 3; t++) {
        els = elements[t]
        for(var i = 0; i < els.length; i++) {
            els[i].style.minHeight = els[i].offsetHeight + 'px'

            style = window.getComputedStyle(els[i]).getPropertyValue('font-size')
            els[i].style.fontSize = parseFloat(style) + 'px'

            style = window.getComputedStyle(els[i]).getPropertyValue('border-radius')
            els[i].style.borderRadius = parseFloat(style) + 'px'

            style = window.getComputedStyle(els[i]).getPropertyValue('border-width')
            els[i].style.borderWidth = parseFloat(style) + 'px'
        }
    }
}
function keyboard_ignore_modal() {
    var style

    elements = [
        document.getElementsByTagName('div'),
        document.getElementsByTagName('input'),
        document.getElementsByTagName('span'),
        [document.getElementsByClassName('no_button')[0], document.getElementsByClassName('ok_button')[0]]
    ]

    for(var t = 0; t < 4; t++) {
        els = elements[t]
        for(var i = 0; i < els.length; i++) {
            els[i].style.minHeight = els[i].offsetHeight + 'px'

            style = window.getComputedStyle(els[i]).getPropertyValue('font-size')
            els[i].style.fontSize = parseFloat(style) + 'px'

            style = window.getComputedStyle(els[i]).getPropertyValue('border-radius')
            els[i].style.borderRadius = parseFloat(style) + 'px'

            style = window.getComputedStyle(els[i]).getPropertyValue('border-width')
            els[i].style.borderWidth = parseFloat(style) + 'px'
        }
    }
}



function password_view(input_html) {
    input_html.type = 'text'
}
function password_hide(input_html) {
    input_html.type = 'password'
}

function pprint(text) {
    console.log(text)
}