import { 
    fetchData, createProductCards, 
    goToProductPage, addToCart, 
    imgLocationPNG 
} from "../assets/constants.js";

const travelSuitcases = [
    {
        name: 'Duis vestibulum elit vel neque.',
        description: 'Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.',
        image: `${imgLocationPNG}/products/travel-suitcase-1.png`
    },
    {
        name: 'Neque vestibulum elit nequvel.',
        description: 'Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.',
        image: `${imgLocationPNG}/products/travel-suitcase-2.png`
    },
    {
        name: 'Elituis stibulum elit velneque.',
        description: 'Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.',
        image: `${imgLocationPNG}/products/travel-suitcase-3.png`
    },
    {
        name: 'Vel vestibulum elit tuvel euqen.',
        description: 'Duis vestibulum vel neque pharetra vulputate. Quisque scelerisque nisi.',
        image: `${imgLocationPNG}/products/travel-suitcase-4.png`
    }
];

const customers = [
    { 
        name: 'Ethan Wade',
        location: 'New York',
        image: `${imgLocationPNG}customer-ethan-wade.png`
    },
    { 
        name: 'Jane Reyes',
        location: 'California',
        image: `${imgLocationPNG}customer-jane-reyes.png`
    },
    { 
        name: 'Erica Banks',
        location: 'Miami',
        image: `${imgLocationPNG}customer-erica-banks.png`
    }
];


const filterByBlocks = (data, blockName) => {
    try {
        if (!Array.isArray(data)) return [];
        
        return data.filter(product => 
            product?.blocks?.includes(blockName)
        );
    } catch (_) {
        return [];
    }
};

const createTravelSuitcaseCards = () => {
    return travelSuitcases.map(suitcase => {
        const div = document.createElement('div');
        div.classList.add('travel-suitcases-item');
        div.style.backgroundImage = 
            `
                linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), 
                url(${suitcase.image})
            `;

        div.innerHTML = 
            `
                <div class="suitcase-text-container">
                    <p class="suitcase-title">${suitcase.name}</p>
                    <p class="suitcase-description">${suitcase.description}</p>
                </div>
            `;

        return div;
    });
}



const createCustomerCards = () => {
    return customers.map(customer => {
        const div = document.createElement('div');
        div.classList.add('customer-card');

        div.innerHTML = 
            `
                <img class="customer-image" src="${customer.image}" alt="${customer.name}">
                <p>Curabitur vulputate arcu odio, ac facilisis diam accumsan ut. Ut mperdiet et leo in vulputate.</p>
                <p class="customer-information">${customer.name}, ${customer.location}</p>
            `;
        
        return div;
    });
}

export async function render(htmlPromise) {
    const html = await htmlPromise;
    const main = document.querySelector('main');
    main.replaceChildren(html);
    const ourCustomersItems = main.querySelector('.our-customers-items');
    const travelSuitcasesItems = main.querySelector('.travel-suitcases-items');

    const travelSuitcases = createTravelSuitcaseCards();
    travelSuitcasesItems.append(...travelSuitcases);

    ourCustomersItems.append(...createCustomerCards());

    const response = await fetchData();
    const selectedProductsItems = main.querySelector('.selected-products-items');
    const newProductsItems = main.querySelector('.new-products-items');

    if (!response.success)  {
        travelSuitcasesItems.innerHTML = response.error;
        selectedProductsItems.innerHTML = response.error;
        newProductsItems.innerHTML = response.error;
        return;
    }

    const data = response.data.data;
    const selectedProducts = (filterByBlocks(data, 'Selected Products') || []).slice(0, 4);
    const newProducts = (filterByBlocks(data, 'New Products Arrival') || []).slice(0, 4);
    selectedProductsItems.innerHTML = 
        selectedProducts.length 
            ? createProductCards(selectedProducts, 'selected-products-item') 
            : '<p>No selected products available.</p>';

    newProductsItems.innerHTML = 
        newProducts.length 
            ? createProductCards(newProducts, 'new-products-item') 
            : '<p>No new products available.</p>';

    selectedProductsItems.addEventListener('click', (event) => {
        const target = event.target;
        target.closest('.add-to-cart') && addToCart(event, data);
        target.closest('.product-image-container') && goToProductPage(event);
    });

    newProductsItems.addEventListener('click', (event) => {
        const target = event.target.closest('.view-product, .product-image-container');
        target && goToProductPage(event);

    });

    const imageSlider = {
        previous: main.querySelector('.image-slider-previous'),
        next: main.querySelector('.image-slider-next')
    }

    imageSlider.next.addEventListener('click', () => {
        if (travelSuitcases.length === 0) return;
        const lastElement = travelSuitcases.pop();
        travelSuitcases.unshift(lastElement);
        travelSuitcasesItems.replaceChildren(...travelSuitcases);
    });

    imageSlider.previous.addEventListener('click', () => {
        if (travelSuitcases.length === 0) return;
        const firstElement = travelSuitcases.shift();
        travelSuitcases.push(firstElement);
        travelSuitcasesItems.replaceChildren(...travelSuitcases);
    });

}