import recipes from './recipes.js'
import { handleTags } from './tags.js'

let displayedRecipes = recipes;

async function initFiltersContainers() {
    const ingredientsList = getIngredientsList(displayedRecipes);
    initOneFilterContainer('ingredients', ingredientsList);
    const appliancesList = getIngredientsList(displayedRecipes);
    initOneFilterContainer('appliances', ingredientsList);
    const ustensilsList = getIngredientsList(displayedRecipes);
    initOneFilterContainer('ustensils', ingredientsList);
}

function initOneFilterContainer(filterCategory, list) {
    const filterContainer = document.getElementById(`${filterCategory}-filter-container`)
    const filterLabel = document.getElementById(`${filterCategory}-filter-label`)
    const filterInput = document.getElementById(`${filterCategory}-filter-input`)
    const filterChevron = document.getElementById(`${filterCategory}-filter-chevron`)
    const filterList = document.getElementById(`${filterCategory}-filter-list`)
    const filterDOMElements = { filterContainer, filterLabel, filterInput, filterChevron, filterList }

    filterContainer.addEventListener('click', () => {
        if(getComputedStyle(filterList).display == "none") {
            openFilterList(filterCategory, filterDOMElements, list)
        } else {
            closeFilterList(filterDOMElements)
        }
    })

    filterInput.addEventListener('keyup', (e) => {
        const inputString = e.target.value;
        const results = list.filter(item => item.toLocaleLowerCase().includes(inputString.toLocaleLowerCase()))
        displayFilterList('ingredients', results)
    })
}

function openFilterList(filterCategory, filterDOMElements, list) {
    const {filterChevron, filterContainer, filterList, filterInput, filterLabel} = filterDOMElements;

    filterChevron.classList.remove('fa-chevron-down')
    filterChevron.classList.add('fa-chevron-up')
    filterLabel.style.display = 'none';
    filterList.style.display = 'flex';
    filterContainer.style.width = '667px'
    filterInput.style.display = "flex";
    filterInput.focus();
    
    displayFilterList(filterCategory, list)
}

function closeFilterList(filterDOMElements) {
    const {filterChevron, filterContainer, filterList, filterInput, filterLabel} = filterDOMElements;

    filterChevron.classList.remove('fa-chevron-up')
    filterChevron.classList.add('fa-chevron-down')
    filterContainer.style.width = '223px'
    filterList.innerHTML = '';
    filterList.style.display = "none";
    filterInput.style.display = "none";
    filterLabel.style.display = 'block';
}

function displayFilterList(filterCategory, list) {
    const filterList = document.getElementById(`${filterCategory}-filter-list`)
    const thirtyFirstItems = list.slice(0, 30);

    filterList.innerHTML = '';
    thirtyFirstItems.map(item => {
        const button = document.createElement('button');
        button.setAttribute('class', 'list-button')
        button.innerHTML = item;
        filterList.appendChild(button);

        button.addEventListener('click', () => {
            createTag(item);
            displayedRecipes = getRecipesFilteredByIngredients(displayedRecipes, item);
            displayRecipes(displayedRecipes);
        })
    })
}

function getRecipesFilteredByIngredients(recipes, item) {
    return recipes.filter(recipe => {
        return recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(item.toLowerCase()))
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
    tagContainer.setAttribute('class', 'tag-container');

    const tagLabel = document.createElement('p');
    tagLabel.innerHTML = tag;
    const tagCloseButton = document.createElement('button');
    tagCloseButton.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`
    tagCloseButton.addEventListener('click', (e) => {
        e.target.parentElement.parentElement.remove()
        displayedRecipes = recipes;
        displayRecipes(displayedRecipes)
    })
   
    tagContainer.appendChild(tagLabel)
    tagContainer.appendChild(tagCloseButton)
    tagContainer.style.backgroundColor = 'var(--blue)'
    tagSection.appendChild(tagContainer)
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