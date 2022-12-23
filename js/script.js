import recipes from './recipes.js'
import { handleTags } from './tags.js'

let displayedRecipes = recipes;

async function initFiltersContainers() {
    const ingredientsFilter = document.getElementById('ingredients-filter-container')
    const filterLabel = document.getElementById('ingredients-filter-label')
    const filterInput = document.getElementById('ingredients-filter-input')
    const filterChevron = document.getElementById('ingredients-filter-chevron')
    const filterList = document.getElementById('ingredients-filter-list')

    ingredientsFilter.addEventListener('click', (e) => {
        
        filterChevron.classList.remove('fa-chevron-down')
        filterChevron.classList.add('fa-chevron-up')
        filterLabel.style.display = 'none';
        ingredientsFilter.style.width = '667px'
        filterList.style.display = 'block';
        filterInput.focus();
    })

    ingredientsFilter.addEventListener('focusout', (e) => {
        if(filterInput.value.length === 0) {
            filterLabel.style.display = 'block';
        }
        filterChevron.classList.remove('fa-chevron-up')
        filterChevron.classList.add('fa-chevron-down')
        ingredientsFilter.style.width = '223px'
        filterList.style.display = 'none';
    })
    //handleFiltersSearch()
}

async function handleFiltersSearch() {
    const ingredientsFilter = document.getElementById('ingredients-filter-input')
    let filteredRecipes = [];
    ingredientsFilter.addEventListener('keyup', (e) => {
        const inputStringLowerCase = e.target.value.toLowerCase()
        filteredRecipes = displayedRecipes.filter(recipe => {
            return recipe.ingredients.some(ingredient => {
                return ingredient.ingredient.toLowerCase().includes(inputStringLowerCase)
            });
        })
        displayRecipes(filteredRecipes);
    })
    ingredientsFilter.addEventListener('focusout', () => {
        displayedRecipes = filteredRecipes;
        console.log(displayedRecipes);
    })
}

async function displayFilterInput(searchContainer) {
    
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
        const inputString = e.target.value;
        console.log(displayedRecipes);
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