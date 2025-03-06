async function set_info() {
    data = await get_request(get_site_statistics_API, {})
    products = document.getElementById('products')
    recipes = document.getElementById('recipes')
    products.textContent = products.textContent.replace('products_count', data['products_count'])
    recipes.textContent = recipes.textContent.replace('recipes_count', data['recipes_count'])
}

set_info()