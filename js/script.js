import recipes from './recipes.js'
import { handleTags } from './tags.js'

let displayedRecipes = recipes;

async function initFiltersContainers() {
    const ingredientsFilter = document.getElementById('ingredients-filter-container')
    const filterLabel = document.getElementById('ingredients-filter-label')
    const filterInput = document.getElementById('ingredients-filter-input')
    const filterChevron = document.getElementById('ingredients-filter-chevron')
    const filterList = document.getElementById('ingredients-filter-list')

    ingredientsFilter.addEventListener('click', () => {
        if(getComputedStyle(filterList).display == "none") {
            filterInput.style.display = "flex";
            const ingredientsList = getIngredientsList(displayedRecipes)
            filterChevron.classList.remove('fa-chevron-down')
            filterChevron.classList.add('fa-chevron-up')
            filterLabel.style.display = 'none';
            filterList.style.display = 'flex';
            ingredientsFilter.style.width = '667px'
            filterInput.focus();
            displayIngredientsList(ingredientsList)
        } else {
            closeFilterList()
        }

    })

    filterInput.addEventListener('keyup', (e) => {
        const inputString = e.target.value;
        const ingredientsList = getIngredientsList(displayedRecipes);
        const results = ingredientsList.filter(item => item.toLocaleLowerCase().includes(inputString.toLocaleLowerCase()))
        displayIngredientsList(results)
        // createTag(e.target.value)
        //     getSearchedRecipes()
    })


    function closeFilterList() {
        filterChevron.classList.remove('fa-chevron-up')
        filterChevron.classList.add('fa-chevron-down')
        ingredientsFilter.style.width = '223px'
        filterList.innerHTML = '';
        filterList.style.display = "none";
        filterInput.style.display = "none";
        filterLabel.style.display = 'block';
    }
}

function displayIngredientsList(list) {
    const ingredientsList = document.getElementById('ingredients-filter-list')
    ingredientsList.innerHTML = '';
    const thirtyFirstItems = list.slice(0, 30)
    thirtyFirstItems.map(ingredientName => {
        const button = document.createElement('button');
        button.setAttribute('class', 'list-button')
        button.innerHTML = ingredientName;
        button.addEventListener('click', (e) => {
            createTag(ingredientName)
            displayedRecipes = displayedRecipes.filter(recipe => {
                return recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(ingredientName.toLowerCase()))
            })
            displayRecipes(displayedRecipes)
            
            
        })
        ingredientsList.appendChild(button)
    })
}

function getIngredientsList(recipesList) {
    const ingredients = recipesList.map(recipe => recipe.ingredients).flat()
    const uniqueIngredients = [...new Set(ingredients.map(ingredient => ingredient.ingredient.toLocaleLowerCase()))]
    return uniqueIngredients
}

function createTag(tag) {
    const tagSection = document.getElementById('tags-section')
    const tagContainer = document.createElement('div');
    tagContainer.setAttribute('class', 'tag-container')
    tagContainer.innerHTML = `
        <p>${tag}</p>
        <i class="fa-regular fa-circle-xmark"></i>
    `
    tagContainer.style.backgroundColor = 'var(--blue)'
    tagSection.appendChild(tagContainer)
} 

async function handleFiltersSearch(items) {
    const ingredientsList = document.getElementById('ingredients-filter-list')
    const filterInput = document.getElementById('ingredients-filter-input')
    filterInput.addEventListener('keyup', (e) => {
        const inputString = e.target.value;
        const results = items.filter(item => item.toLocaleLowerCase().includes(inputString.toLocaleLowerCase()))
        ingredientsList.innerHTML = '';
        results.map(ingredient => {
            const button = document.createElement('button');
            button.setAttribute('class', 'list-button')
            button.innerHTML = ingredient;
            ingredientsList.appendChild(button)
        })
    })
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
        const inputString = e.target.value;
        if(inputString.length > 2 ) {
            getSearchedRecipes(inputString, displayedRecipes).then(results => {
                displayedRecipes = results;
                displayRecipes(displayedRecipes);
            })
        } else {
            displayedRecipes = recipes;
            displayRecipes(displayedRecipes);
        }
    })
}

async function getSearchedRecipes(inputString, displayedRecipes) {
    const results = displayedRecipes.filter(recipe => {
        const inputStringLowerCase = inputString.toLowerCase()
        const checkRecipeName = recipe.name.toLowerCase().includes(inputStringLowerCase)
        const checkRecipeIngredients = recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(inputStringLowerCase))
        const checkRecipeDescription = recipe.description.toLowerCase().includes(inputStringLowerCase)
        return checkRecipeName || checkRecipeIngredients || checkRecipeDescription
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