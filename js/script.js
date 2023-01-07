import recipes from './recipes.js'
import { handleTags } from './tags.js'

const filters = ["ingredients", "appliances", "ustensils"];
let displayedRecipes = recipes;
let tags = [];

function initFiltersContainers() {
    const ingredientsList = getIngredientsList(displayedRecipes);
    const appliancesList = getAppliancesList(displayedRecipes);
    const ustensilsList = getUstensilsList(displayedRecipes);
    initOneFilterContainer('ingredients', ingredientsList);
    initOneFilterContainer('appliances', appliancesList);
    initOneFilterContainer('ustensils', ustensilsList);
}

function getFilterAllDOMElements(filterCategory) {
    const filterContainer = document.getElementById(`${filterCategory}-filter-container`)
    const filterLabel = document.getElementById(`${filterCategory}-filter-label`)
    const filterInput = document.getElementById(`${filterCategory}-filter-input`)
    const filterChevron = document.getElementById(`${filterCategory}-filter-chevron`)
    const filterList = document.getElementById(`${filterCategory}-filter-list`)

    return { filterContainer, filterLabel, filterInput, filterChevron, filterList }
}

function initOneFilterContainer(filterCategory, list) {
    const filterDOMElements = getFilterAllDOMElements(filterCategory);
    const { filterContainer, filterInput, filterList } = filterDOMElements;

    // open/close filter list on click
    filterContainer.addEventListener('click', () => {
        if(getComputedStyle(filterList).display == "none") {
            openFilterList(filterCategory, filterDOMElements, list);
        } else {
            closeFilterList(filterDOMElements);
        }
    })

    // filter list on input
    filterInput.addEventListener('keyup', (e) => {
        const inputString = e.target.value;
        displayFilterList(filterCategory, inputString)
    })
}

function openFilterList(filterCategory) {
    
    // close all other lists
    const otherFilters = filters.filter(filter => filter != filterCategory);
    otherFilters.map(filter => {
        const filterDOMElements = getFilterAllDOMElements(filter);
        closeFilterList(filterDOMElements);
    })

    // display selected list
    const selectedFilter = getFilterAllDOMElements(filterCategory);
    selectedFilter.filterChevron.classList.remove('fa-chevron-down')
    selectedFilter.filterChevron.classList.add('fa-chevron-up')
    selectedFilter.filterLabel.style.display = 'none';
    selectedFilter.filterList.style.display = 'flex';
    selectedFilter.filterContainer.style.width = '667px'
    selectedFilter.filterInput.style.display = "flex";
    selectedFilter.filterInput.focus();
    
    displayFilterList(filterCategory)
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

function displayFilterList(filterCategory, inputString) {
    const filterListDOM = document.getElementById(`${filterCategory}-filter-list`)
    let filterListItems = [];

    switch(filterCategory) {
        case 'ingredients':
            filterListItems = getIngredientsList(displayedRecipes);
            break;
        case 'appliances':
            filterListItems = getAppliancesList(displayedRecipes);
            break;
        case 'ustensils':
            filterListItems = getUstensilsList(displayedRecipes);
            break;
    }

    if(inputString) {
        filterListItems = filterListItems.filter(item => item.toLocaleLowerCase().includes(inputString.toLocaleLowerCase()))
    }

    const thirtyFirstItems = filterListItems.slice(0, 30);

    filterListDOM.innerHTML = '';
    thirtyFirstItems.map(item => {
        const button = document.createElement('button');
        button.setAttribute('class', 'list-button')
        button.innerHTML = item;
        filterListDOM.appendChild(button);

        button.addEventListener('click', () => {
            createTag(item, filterCategory);
            tags.push({item, filterCategory});
            displayedRecipes = getFilteredRecipes(displayedRecipes, item, filterCategory);
            displayRecipes(displayedRecipes);
        })
    })
}

function getIngredientsList(recipesList) {
    const ingredients = recipesList.map(recipe => recipe.ingredients).flat()
    const uniqueIngredients = [...new Set(ingredients.map(ingredient => ingredient.ingredient.toLocaleLowerCase()))]
    return uniqueIngredients
}

function getAppliancesList(recipesList) {
    const appliances = recipesList.map(recipe => recipe.appliance)
    const uniqueAppliances = [...new Set(appliances.map(appliance => appliance.toLocaleLowerCase()))]
    return uniqueAppliances
}

function getUstensilsList(recipesList) {
    const ustensils = recipesList.map(recipe => recipe.ustensils).flat();
    const uniqueUstensils = [...new Set(ustensils.map(ustensil => ustensil.toLocaleLowerCase()))]
    return uniqueUstensils
}

function getFilteredRecipes(recipes, item, filterCategory) {
    switch(filterCategory) {
        case 'ingredients':
            return getRecipesFilteredByIngredients(recipes, item)
        case 'appliances':
            return getRecipesFilteredByAppliances(recipes, item)
        case 'ustensils':
            return getRecipesFilteredByUstensils(recipes, item)
    }
}

function getRecipesFilteredByIngredients(recipes, item) {
    return recipes.filter(recipe => {
        return recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(item.toLowerCase()))
    })
}

function getRecipesFilteredByAppliances(recipes, item) {
    return recipes.filter(recipe => {
        return recipe.appliance.toLowerCase().includes(item.toLowerCase())
    })
}

function getRecipesFilteredByUstensils(recipes, item) {
    return recipes.filter(recipe => {
        return recipe.ustensils.some(ustensil => ustensil.toLowerCase().includes(item.toLowerCase()))
    })
}

function getRecipesFilteredAllAtOnce(recipes, tags) {
    let filteredRecipes = recipes;
    tags.forEach(tag => {
        filteredRecipes = getFilteredRecipes(filteredRecipes, tag.item, tag.filterCategory)
    })
    return filteredRecipes
}

function createTag(tag, filterCategory) {
    const tagSection = document.getElementById('tags-section')
    const tagContainer = document.createElement('div');
    tagContainer.setAttribute('class', 'tag-container');
    let color = 'blue';
    switch(filterCategory) {
        case 'appliances':
            color = 'green'
            break;
        case 'ustensils':
            color = 'red'
            break;
    }
    tagContainer.style.backgroundColor = `var(--${color})`;

    const tagLabel = document.createElement('p');
    tagLabel.innerHTML = tag;
    const tagCloseButton = document.createElement('button');
    tagCloseButton.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`
    tagCloseButton.addEventListener('click', (e) => {
        tagContainer.remove();
        tags = tags.filter(tagObject => tagObject.item !== tag);
        displayedRecipes = getRecipesFilteredAllAtOnce(recipes, tags);
        displayRecipes(displayedRecipes)
    })
   
    tagContainer.appendChild(tagLabel)
    tagContainer.appendChild(tagCloseButton)
    tagSection.appendChild(tagContainer)
} 

async function displayOneRecipe(recipe) {
    const recipeContainer = document.createElement('div');
    recipeContainer.setAttribute('class', 'recipe-container');
    recipeContainer.innerHTML = ` 
        <div class="recipe-img"></div>
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

function displayRecipes(results) {
    if(results.length === 0) {
        return handleZeroResults()
    } else {
        document.getElementById('recipes-section').innerHTML = '';
        return results.map(recipe => displayOneRecipe(recipe))
    }
}

function handleSearchInput(recipes) {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', (e) => {
        const inputString = e.target.value;
        recipes = getRecipesFilteredAllAtOnce(recipes, tags);
        if(inputString.length > 2 ) {
            displayedRecipes = getSearchedRecipes(inputString, recipes);
        } else {
            displayedRecipes = recipes;
        }
        displayRecipes(displayedRecipes);
    })
}

function getSearchedRecipes(inputString, displayedRecipes) {
    const results = displayedRecipes.filter(recipe => {
        const inputStringLowerCase = inputString.toLowerCase();
        const checkRecipeName = recipe.name.toLowerCase().includes(inputStringLowerCase);
        const checkRecipeIngredients = recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(inputStringLowerCase));
        const checkRecipeDescription = recipe.description.toLowerCase().includes(inputStringLowerCase);
        return checkRecipeName || checkRecipeIngredients || checkRecipeDescription;
    });

    return results;
}


function handleZeroResults() {
    const recipesSection = document.getElementById('recipes-section')
    recipesSection.innerHTML = `Aucune recette ne correspond à votre critère... vous pouvez
    chercher « tarte aux pommes », « poisson », etc.`
}

function init() {
    initFiltersContainers()
    displayRecipes(recipes);
    handleSearchInput(displayedRecipes)
    handleTags()
}

init()