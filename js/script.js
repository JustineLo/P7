import recipes from './recipes.js'
import { handleTags } from './tags.js'

async function initFiltersContainers() {
    const ingredientsFilter = document.getElementById('ingredients-filter-container')

    // ingredientsFilter.addEventListener('click', (e) => {
    //     const searchContainer = e.target.parentNode
    //     if(searchContainer.classList.contains('filter-container')) {
    //         displayFilterInput(searchContainer)
    //     }
    // })

}

async function handleFilters() {
    const ingredientsFilter = document.getElementById('ingredients-filter-input')
    ingredientsFilter.addEventListener('keyup', (e) => {
        const inputString = e.target.value
        getSearchedRecipes(inputString).then(results => {
            displayRecipes(results);
        })
        
    })
}

async function displayFilterInput(searchContainer) {
    const filterInput = document.createElement('input');
    filterInput.setAttribute('type', 'text');
    filterInput.setAttribute('class', 'filter-input');
    searchContainer.innerHTML = filterInput.outerHTML + `<i class="fa-solid fa-chevron-down"></i>`;
    filterInput.focus();
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

async function displayRecipes(results) {
    if(results.length === 0) {
        return handleZeroResults()
    } else {
        document.getElementById('recipes-section').innerHTML = '';
        return results.map(recipe => displayOneRecipe(recipe))
    }
    
}

async function handleSearchInput() {
    const searchInput = document.getElementById('search-input')

    searchInput.addEventListener('keyup', (e) => {
        const inputString = e.target.value
        if(inputString.length > 2 ) {
            getSearchedRecipes(inputString).then(results => {
                displayRecipes(results);
            })
        } else {
            displayRecipes(recipes);
        }
    })
}

async function getSearchedRecipes(inputString) {

    let results = []
    results = results.concat(await getNameResults(inputString))
    results = results.concat(await getIngredientResults(inputString))
    results = results.concat(await getDescriptionResults(inputString))
    const uniqueResults = [...new Set(results)]
    return uniqueResults

}

async function getNameResults(inputString) {
    const results = recipes.filter(recipe => {
        const inputStringLowerCase = inputString.toLowerCase()
        const recipeName = recipe.name.toLowerCase()
        return recipeName.includes(inputStringLowerCase)
    })
    return results
}

async function getIngredientResults(inputString) {
    const results = recipes.filter(recipe => {
        const inputStringLowerCase = inputString.toLowerCase()
        const recipeIngredients = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase())
        return recipeIngredients.includes(inputStringLowerCase)
    })
    return results
}

async function getDescriptionResults(inputString) {
    const results = recipes.filter(recipe => {
        const inputStringLowerCase = inputString.toLowerCase()
        const recipeDescription = recipe.description.toLowerCase()
        return recipeDescription.includes(inputStringLowerCase)
    })
    return results
}


async function handleZeroResults() {
    const recipesSection = document.getElementById('recipes-section')
    recipesSection.innerHTML = `Aucune recette ne correspond à votre critère... vous pouvez
    chercher « tarte aux pommes », « poisson », etc.`
}

async function init() {
    initFiltersContainers()
    displayRecipes(recipes);
    handleSearchInput()
    handleTags()
}

init()