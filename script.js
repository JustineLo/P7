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

async function init() {
    initFiltersContainers()
}

init()