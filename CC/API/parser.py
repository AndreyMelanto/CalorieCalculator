from requests import get
from bs4 import BeautifulSoup

def get_recipe(url):
    try:
        html = BeautifulSoup(get(url).content, 'html.parser')

        # Название
        name = html.find('h1').text

        # Описание
        description = html.select(f'.description')[0].contents[0]

        # Количество порций
        count = str(html.findAll("input", {"id": "yield_num_input", })[0]).split('"')[-2]

        # Время приготовления
        time_html = html.findAll('div', {'class': 'prep-time-block is-flex is-align-items-center'})[0]
        time = f'{time_html.findAll("span", {"class": "label"})[0].find("strong").contents[0]};'
        if time_html.findAll('span', {'class': 'label mr-1'}):
            time += time_html.findAll('span', {'class': 'label mr-1'})[0].find('strong').contents[0]
        else:
            time += 'None'

        # Ингредиенты
        ingredients = ''
        elements = html.findAll("form", {"id": "recept-list", })[0].contents
        for el in elements:
            if 'class="group-name"' in str(el):
                ingredients += f'[g]{el.contents[0]};'
            elif 'class="ingredient list-item"' in str(el):
                product_info = el.contents
                for info in product_info:
                    if 'class="list-column align-top"' in str(info):
                        ingredients += f'[p]{info.find("a").contents[0]};'
                        if info.find('span') is not None:
                            ingredients += f'[d]{info.find("span").contents[0]};'
                    elif 'class="list-column no-shrink"' in str(info):
                        spans = info.findAll('span')
                        if spans[0].contents:
                            ingredients += f'[c]{spans[0].contents[0]};'
                            options = info.findAll("option")
                            for option in options:
                                if 'selected' in str(option):
                                    ingredients += f'[e]{option.contents[0]};'
                        else:
                            ingredients += f'[c]{spans[1].contents[0]};'
                ingredients += '|'

        # Нутриенты
        nutrients = {
            'calories': html.findAll("span", {"id": "nutr_kcal", })[0].contents[0],
            'proteins': html.findAll("span", {"class": "grams", })[0].contents[1].contents[0],
            'fats': html.findAll("span", {"class": "grams", })[1].contents[1].contents[0],
            'carbohydrates': html.findAll("span", {"class": "grams", })[2].contents[1].contents[0]
        }

        # Шаги
        steps = ''
        elements = html.findAll("p", {"class": "instruction", })
        for el in elements:
            steps += f'{el.contents[0]};'

        # Фото
        main_photo = str(html.findAll('div', {'class': 'main-photo imgr links-no-style'})[0].find('img')).split('"')[7]
        photos = f'https:{main_photo};'
        elements = html.findAll("ol", {"class": "instructions", })[0]
        for el in elements:
            el = el.find('a')
            if el is not None and el != -1:
                photo = str(el).split('\"')[3]
                photos += f'https:{photo};'

        return {
            'name': name,
            'description': description,
            'count': count,
            'time': time,
            'ingredients': ingredients,
            'nutrients': nutrients,
            'steps': steps,
            'photos': photos
        }
    except:
        return None



def decode_products(products):
    products = products.split('|')
    products.pop()
    for product in products:
        product = product.split(';')
        product.pop()
        for el in product:
            if '[g]' in el:
                print(f'Группа: {el.replace("[g]", "")}')
            elif 'p' in el:
                print(f'\tПродукт: {el.replace("[p]", "")}')
            elif 'd' in el:
                print(f'\t\tОписание: {el.replace("[d]", "")}')
            elif 'c' in el:
                print(f'\t\tКоличество: {el.replace("[c]", "")}')
            elif 'e' in el:
                print(f'\t\tИзмерение: {el.replace("[e]", "")}')