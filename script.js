import recipes from './recipes.js'

async function initFiltersContainers() {
    const ingredientsFilter = document.getElementById('ingredients-filter-container')

    ingredientsFilter.addEventListener('click', (e) => {
        const searchContainer = e.target.parentNode
        if(searchContainer.classList.contains('filter-container')) {
            displayFilterInput(searchContainer)
        }
    })
}

async function displayFilterInput(searchContainer) {
    const filterInput = document.createElement('input');
    filterInput.setAttribute('type', 'text');
    filterInput.setAttribute('class', 'filter-input');
    searchContainer.innerHTML = filterInput.outerHTML + `<i class="fa-solid fa-chevron-down"></i>`;
    filterInput.focus();
    filterInput.value = "wtf"
}

async function displayOneRecipe(recipe) {
    const recipeContainer = document.createElement('div');
    recipeContainer.setAttribute('class', 'recipe-container');
    recipeContainer.innerHTML = `
        <div class="recipe-img">
           
        </div>
        <div class="recipe-info">
            <div class="recipe-header">
                <h3>${recipe.name}</h3>
                <div class="recipe-time">
                    <i class="fa-solid fa-clock"></i>
                    <p>${recipe.time} min</p>
                </div>
            </div>
            <div class="recipe-body">
                <div class="recipe-ingredients">
                    <ul>
                        ${recipe.ingredients.map(ingredient => `<li>${ingredient.ingredient}${ingredient.quantity ? ": " + ingredient.quantity : ""} ${ingredient.unit ? ingredient.unit : ""} </li>`).join('')}

                    </ul>
                </div>
                <div class="recipe-description">
                    <p>${recipe.description}</p>
                </div>
            </div>
        </div>
    `
    document.getElementById('recipes-section').appendChild(recipeContainer)
}

async function init() {
    initFiltersContainers()
    recipes.map(recipe => displayOneRecipe(recipe))
}

init()