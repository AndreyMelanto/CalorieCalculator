var activity_coefficient
var goal
var gender

keyboard_ignore_calculator()



women_button = document.getElementById('women')
man_button = document.getElementById('man')
async function gender_button_click(button){
    women_button.style.cssText = ''
    man_button.style.cssText = ''
    button.style.cssText = 'background: ' + second_color + ';'
    button.style.cssText += 'color: ' + text + ';'
    gender = button.id
}



step_one_button = document.getElementById('1')
step_two_button = document.getElementById('2')
step_three_button = document.getElementById('3')
step_four_button = document.getElementById('4')
step_five_button = document.getElementById('5')
async function activity_button_click(button){
    step_one_button.style.cssText = ''
    step_two_button.style.cssText = ''
    step_three_button.style.cssText = ''
    step_four_button.style.cssText = ''
    step_five_button.style.cssText = ''
    button.style.cssText = 'background: ' + second_color + ';'
    button.style.cssText += 'color: ' + text + ';'
    activity_coefficient = button.id
    set_description(button.id)
}
async function activity_button_hover(button) {
    set_description(button.id)
}
async function activity_button_out(button) {
    if(activity_coefficient != undefined) set_description(activity_coefficient)
    else description.textContent = ''
}
description = document.getElementById('activity description')
async function set_description(id) {
    if(id == '1') description.textContent = 'Редко выхожу из дома, почти весь день сижу'
    if(id == '2') description.textContent = 'Хожу в магазин или недолго прогуливаюсь'
    if(id == '3') description.textContent = 'Ежедневно гуляю не меньше часа'
    if(id == '4') description.textContent = 'Занимаюсь активными видами спорта/досуга (велосипед, ролики, лыжи, коньки и др.) 2-3 раза в неделю'
    if(id == '5') description.textContent = 'Регулярно занимаюсь спортом (бег, гимнастика, тренажерный зал), минимум 5 раз в неделю'
}



minus_goal_button = document.getElementById('-')
null_goal_button = document.getElementById('0')
plus_goal_button = document.getElementById('+')
async function goal_button_click(button){
    minus_goal_button.style.cssText = ''
    null_goal_button.style.cssText = ''
    plus_goal_button.style.cssText = ''
    button.style.cssText = 'background: ' + second_color + ';'
    button.style.cssText += 'color: ' + text + ';'
    goal = button.id
}



get_result_button = document.getElementById('get result')
get_result_button.addEventListener('click', get_result)
async function get_result() {
    age = document.getElementById('age').value
    height = document.getElementById('height').value
    weight = document.getElementById('weight').value
    response = await post_request(calculator_API, {
        user_id: user_id,
        weight: weight,
        height: height,
        age: age,
        gender: gender,
        activity_coefficient: activity_coefficient,
        goal: goal
    })
    output_result(response, goal)
}



async function output_result(result, goal) {
    chart_html = document.getElementsByClassName('chart')[0]
    info_html = document.getElementsByClassName('info')[0]
    msg_html = document.getElementsByClassName('msg')[0]
    msg_empty_html = document.getElementsByClassName('msg_empty')[0]
    chart_html.style.display = 'flex'
    info_html.style.display = 'block'
    msg_html.style.display = 'inline-block'
    msg_empty_html.style.display = 'none'

    calories_chart_html = document.getElementById('calories')
    proteins_chart_html = document.getElementById('proteins')
    fats_chart_html = document.getElementById('fats')
    carbohydrates_chart_html = document.getElementById('carbohydrates')

    calories_info_html = document.getElementById('calories info')
    proteins_info_html = document.getElementById('proteins info')
    fats_info_html = document.getElementById('fats info')
    carbohydrates_info_html = document.getElementById('carbohydrates info')

    function out() {
        calories_chart_html.style.width = '100%'
        if(goal == '0') {
            proteins_chart_html.style.width = '14%'
            fats_chart_html.style.width = '29%'
            carbohydrates_chart_html.style.width = '54%'
        } else if(goal == '-') {
            proteins_chart_html.style.width = '19%'
            fats_chart_html.style.width = '29%'
            carbohydrates_chart_html.style.width = '49%'
        } else if(goal == '+') {
            proteins_chart_html.style.width = '24%'
            fats_chart_html.style.width = '29%'
            carbohydrates_chart_html.style.width = '44%'
        }
        calories_info_html.textContent = result['response']['norm_of_calories'] +' Ккал'
        proteins_info_html.textContent = result['response']['norm_of_proteins'] +'г'
        fats_info_html.textContent = result['response']['norm_of_fats'] +'г'
        carbohydrates_info_html.textContent = result['response']['norm_of_carbohydrates'] +'г'
    }
    setTimeout(out, 30)
}