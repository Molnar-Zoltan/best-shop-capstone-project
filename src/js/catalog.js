import { 
    fetchData, createProductCards, generateStars,
    imgLocationPNG,
    goToProductPage, addToCart,
    sizes, colors, categories,
    createOptions
 } from "../assets/constants.js";

let pages;
let pageNumbers;
let results;
let currentPageNumber;
let catalogProducts;
let resultsText;
let buttonPrevious;
let buttonNext;
let pageNumberButtons;
let popupProductNotFound;
let popupProductClose;
let selectedDropdowns;
const defaultFilterOption = "Choose option";

const filter = {
    size: defaultFilterOption,
    color: defaultFilterOption,
    category: defaultFilterOption,
    salesStatus: false
}

const renderProducts = (products, pageNumber) => {
    if (pageNumber >= pages || pageNumber < 0) return;

    return createProductCards(products[pageNumber], '');
}

const updateResults = (products) => {
    results = products.flat().length;
    pages = Math.ceil(results / 12);
}

const updateResultsText = (products, pageNumber) => {
    if (products.length === 0) return 'No results found.';
    if (pageNumber >= pages || pageNumber < 0) return;

    const resultLast = pageNumber * 12 + Array.from(products[pageNumber]).length
    const resultStart = resultLast - Array.from(products[pageNumber]).length + 1;

    pageNumbers.replaceChildren(...createPageNumbers());
    pageNumberButtons = document.querySelectorAll('.page-number-button');


    return `Showing ${resultStart}-${resultLast} of ${results} Results`;

}

const createCatalog = (data) => {
    const tempData = [...data];
    const products = [];
    
    for (let i = 0; i < pages; i++) {
        products.push(tempData.splice(0, 12));
    }

    return products;
}

const createPageNumbers = () => {
    const div = document.createElement('div');

    for (let i = 1; i <= pages; i++) {
        const span = document.createElement('span')
        span.classList.add(`page-number-button`);
        span.textContent = i;
        (i  - 1) === currentPageNumber && (span.classList.add('current-page'));
        div.append(span);
    }

    return div.children;
}

const switchPage = (products, pageNumber) => {
    if (products.length === 0) catalogProducts.innerHTML = "";
    if (pageNumber > pages || pageNumber < 1) return;

    currentPageNumber = pageNumber - 1;
    catalogProducts.innerHTML = renderProducts(products, currentPageNumber);
    resultsText.textContent = updateResultsText(products, currentPageNumber);

    buttonPrevious.style.visibility = pageNumber === 1 ?  'hidden' : 'visible';
    buttonNext.style.visibility = pageNumber === pages ?  'hidden' : 'visible';
    pageNumberButtons.forEach(pageButton => {
        const pageNumber = Number(pageButton.textContent);
        pageNumber === (currentPageNumber + 1) ? 
        pageButton.classList.add('current-page') :
        pageButton.classList.remove('current-page');
    });
}

const addSidebarSets = (data) => {
    const luggageSets = data.filter(product => product.category === 'luggage sets');
    let topBestSets = [];

    for (let i = 0; i < 5; i++) {
        const randomSet = Math.floor(Math.random() * luggageSets.length);
        topBestSets.push(luggageSets.splice(randomSet, 1));
    }

    topBestSets = topBestSets.flat();

    return topBestSets.map(set => {
        const div = document.createElement('div');
        div.classList.add('top-best-set');

        div.innerHTML = 
            `
                <div class="set-image-container">
                    <img class="set-image" data-id="${set.id}"${' '}
                    src="${imgLocationPNG}products/${set.imageUrl}" alt="${set.name}">
                </div>
                <div class="set-content">
                    <p class="set-name">${set.name}</p>
                    <div class="set-rating">${set.rating}</div>
                    <p class="set-price">$${set.price}</p>
                </div>
            `;

        const ratingStars = div.querySelector('.set-rating');
        ratingStars.replaceChildren(...generateStars(set.rating));
        
        return div;
    });
}

const sortProducts = (data, sorting) => {
    const newData = [...data];

    switch(sorting) {
        case 'price-highest': newData.sort((a, b) => b.price - a.price);
        break;
        case 'price-lowest': newData.sort((a, b) => a.price - b.price);
        break;
        case 'popularity-highest': newData.sort((a, b) => b.popularity - a.popularity);
        break;
        case 'rating-highest': newData.sort((a, b) => b.rating - a.rating);
        break;
        default: return applyFilters(data);
    }

    return applyFilters(newData);
}

const searchProduct = (event, data = []) => {
    const form = event.currentTarget;
    const searchInput = form.querySelector('#search-input');
    const searchText = searchInput.value.trim().toLowerCase();

    if (!searchText) {
        return null;
    }

    const productFound = data.find(product => 
        product.name.toLowerCase().startsWith(searchText));

    if (productFound) {
        window.location.hash = `#product=${productFound.id}`;
    } else {
        popupProductNotFound.classList.add('show');
    }

}

const updateFilters = () => {
    
    selectedDropdowns.forEach(selected => {
        const selectedText = selected.querySelector('.selected-text');
        switch(selected.id) {
            case 'filters-size-select': selectedText.textContent = filter.size;
            break;
            case 'filters-color-select': selectedText.textContent = filter.color;
            break;
            case 'filters-category-select': selectedText.textContent = filter.category;
            break;
        }
    });
}

const applyFilters = (data) => {
    let products = [...data];
    currentPageNumber = 0;

    if (filter.size !== defaultFilterOption) {
        products = products.filter(product => 
            product.size.toLowerCase() === filter.size.toLocaleLowerCase());
    }
    
    if (filter.color !== defaultFilterOption) {
        products = products.filter(product => 
            product.color.toLowerCase() === filter.color.toLocaleLowerCase());
    }

    if (filter.category !== defaultFilterOption) {
        products = products.filter(product => product.category === filter.category);
    }

    if (filter.salesStatus) {
        products = products.filter(product => product.salesStatus === filter.salesStatus);
    }
    
    updateResults(products);
    resultsText.textContent = updateResultsText(products, 1);

    return createCatalog(products);
}

export async function render(htmlPromise) {
    const html = await htmlPromise;
    const main = document.querySelector('main');
    main.replaceChildren(html);

    const response = await fetchData();

    if (!response.success)  {
        main.innerHTML = response.error;
        return;
    }

    const data = response.data.data;

    const sidebarSets = main.querySelector('.sidebar-sets');
    sidebarSets.replaceChildren(...addSidebarSets(data));
    
    results = data.length;
    pages = Math.ceil(results / 12);
    let products = createCatalog(data);

    pageNumbers = main.querySelector('.page-numbers');
    buttonPrevious = main.querySelector('.previous-container');
    buttonNext = main.querySelector('.next-container');
    catalogProducts = main.querySelector('.catalog-products');
    resultsText = main.querySelector('.results');
    const sortingDropdown = main.querySelector('#sorting-dropdown');
    const searchForm = main.querySelector('.search-form');
    popupProductNotFound = main.querySelector('.popup-product-not-found');
    popupProductClose = main.querySelector('.popup-product-close');
    const popupFilters = main.querySelector('.popup-filters');
    const showFiltersButton = main.querySelector('.show-filters-button');
    const filtersDropdownContent = main.querySelectorAll('.dropdown-content');
    const filtersCheckbox = main.querySelector('#filter-sales');
    selectedDropdowns = document.querySelectorAll('.dropdown-selected');
    currentPageNumber = 0;

    pageNumbers.replaceChildren(...createPageNumbers());
    pageNumberButtons = main.querySelectorAll('.page-number-button');
    
    filtersDropdownContent.forEach(dropdown => {
        switch(dropdown.id) {
            case 'filters-size': dropdown.append(...createOptions(sizes, 'div'));
            break;
            case 'filters-color': dropdown.append(...createOptions(colors, 'div'));
            break;
            case 'filters-category': dropdown.append(...createOptions(categories, 'div'));
            break;
        }

        dropdown.addEventListener("touchend", () => {
            setTimeout(() => {
                dropdown.style.display = "none";
            }, 600);
        }); 
    });

    selectedDropdowns.forEach(selected => {
        switch(selected.id) {
            case 'filters-size-select': 
                selected.addEventListener("touchstart", () => {
                    const dropdownContent = document.querySelector('#filters-size');
                    dropdownContent.style.display = "block";
                });
                break;
            case 'filters-color-select': 
                selected.addEventListener("touchstart", () => {
                    const dropdownContent = document.querySelector('#filters-color');
                    dropdownContent.style.display = "block";
                });
                break;
            case 'filters-category-select': 
                selected.addEventListener("touchstart", () => {
                    const dropdownContent = document.querySelector('#filters-category');
                    dropdownContent.style.display = "block";
                });
                break;
        }
    });

    switchPage(products, 1);
    
    pageNumbers.addEventListener('click', (event) => {
        const target = event.target;
        if (target.closest('.page-number-button')) {
            const pageNum = Number(target.textContent);
            switchPage(products, pageNum);
        } 
    });

    buttonNext.addEventListener('click', () => {
        if (currentPageNumber === (pages - 1)) return;
        currentPageNumber++;
        switchPage(products, currentPageNumber + 1);
    });

    buttonPrevious.addEventListener('click', () => {
        if (currentPageNumber === 0) return;
        currentPageNumber--;
        switchPage(products, currentPageNumber + 1);
    });

    sortingDropdown.addEventListener('change', (event) => {
        currentPageNumber = 0;
        products = sortProducts(data, event.target.value);
        catalogProducts.innerHTML = renderProducts(products, currentPageNumber);
        switchPage(products, currentPageNumber + 1);
    });

    catalogProducts.addEventListener('click', (event) => {
        event.target.closest('.product-image-container') && goToProductPage(event);
        event.target.closest('.add-to-cart') &&  addToCart(event, data);
    });

    sidebarSets.addEventListener('click', (event) => {
        event.target.closest('.set-image-container img') && goToProductPage(event);
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchProduct(event, data);
    });

    popupProductClose.addEventListener('click', 
        () => popupProductNotFound.classList.remove('show'));

    popupFilters.addEventListener('click', (event) => {
        const target = event.target;
        const currentTarget = event.currentTarget;

        target.closest('.popup-filters-hide') && (currentTarget.classList.remove('show'));

        if (target.closest('.dropdown-content')) {
            target.closest('#filters-size div') && (filter.size = target.textContent);
            target.closest('#filters-color div') && (filter.color = target.textContent);
            target.closest('#filters-category div') && (filter.category = target.textContent);
            updateFilters();
            products = sortProducts(data, sortingDropdown.value);
            switchPage(products, 1);
        }
        
        if (target.closest('.popup-filters-clear')) {
            for (let key in filter) {
                if (key !== 'salesStatus') {
                    filter[key] = defaultFilterOption;
                } else {
                    filter[key] = false;
                }
            }
            
            updateFilters();
            filtersCheckbox.checked = filter.salesStatus;

            products = sortProducts(data, sortingDropdown.value);
            switchPage(products, 1);
        } 
            
    });

    filtersCheckbox.addEventListener('click', () => {
        filter.salesStatus = !filter.salesStatus;
        filtersCheckbox.checked = filter.salesStatus;

        products = sortProducts(data, sortingDropdown.value);
        switchPage(products, 1);
    });

    showFiltersButton.addEventListener('click', () => popupFilters.classList.add('show'));
}