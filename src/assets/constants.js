export const htmlLocation = './html/';
export const imgLocationPNG = '/assets/images/png/';
export const imgLocationSVG = '/assets/images/svg/';
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const maxUserInputLength = 32;
export const maxEmailLength = 254;
export const maxMessageLength = 600;
export const colors = ['Red', 'Blue', 'Green', 'Black', 'Grey', 'Yellow', 'Pink'];
export const sizes = ['S', 'M', 'L', 'XL', 'S, M, XL'];
export const categories = ["suitcases", "kids' luggage", "luggage sets", 'carry-ons'];

export const validateTextInput = (input, errorMessageEmpty, errorMessageLong, maxLength) => {
    errorMessageEmpty.style.display = !input ? 'block' : 'none';
    errorMessageLong.style.display = input.length > maxLength ? 'block' : 'none';
}

export const validateEmailInput = (input, errorMessageInvalid, maxLength) => {
    errorMessageInvalid.style.display = (!emailRegex.test(input) || input.length > maxLength) ? 'block' : 'none';
}

export const setInputLength = (input, length) => {
    input.setAttribute('maxlength', length);
}

export const isInput = (input) => {
    if (!input) return false;
    return (input.tagName === 'INPUT' && (input.type === 'text' || input.type === 'email'))
            || input.tagName === 'TEXTAREA';
}

export const resetInputs = (...inputs) => {
    inputs.forEach(input => input.value = '');
}

export const dispatchCartChange = () => {
    document.dispatchEvent(new Event('cartChanged', { detail: cart }));
}

export const cart = {
    products: [],

    initialize() {
        this.products = JSON.parse(localStorage.getItem('cart') || '[]');
        dispatchCartChange();
    },
    
    add(...product) {
        this.products.push(...product);
        dispatchCartChange();
    },

    decreaseQuantity(index) {
        this.products.splice(index, 1);
        dispatchCartChange();
    },
    remove(name, size, color) {
        this.products = this.products.filter(p => !(p.name === name && p.size === size && p.color === color));
        dispatchCartChange();
    },

    getLength() {
        return this.products.length;
    },

    getItems() {
        return this.products;
    },

    clear() {
        localStorage.clear();
        this.products = [];
        dispatchCartChange();
    }
}


export const fetchData = async () => {
    try {
        const response = await fetch('../assets/data.json');

        if (!response.ok) {
            throw new Error('Failed to fetch data.');
        }

        const data = await response.json();
        return { success: true, data };

    }
    catch(error) {
        return { success: false, error: error.message };
    }
}

export const createProductCards = (products, className) => {
    return  products.map(product => {
                const isNewProductsItem = className === 'new-products-item';

                const div = document.createElement('div');
                className && div.classList.add(className);
                div.classList.add('products-item'); 

                div.innerHTML = 
                    `
                        <div class="product-image-container" data-id="${product.id}">
                            ${product.salesStatus ? 
                                `<span class="product-sale" data-id="${product.id}">SALE</span>` : 
                                ''
                            }
                        </div>
                        <div class="product-details">
                            <div class="product-text-container">
                                <p class="product-name">${product.name}</p>
                                <p class="product-price">$${product.price}</p>
                            </div>
                            <button type="button"
                                class="${isNewProductsItem ? 'view-product' : 'add-to-cart'}"
                                data-id="${product.id}"
                            >
                                    ${isNewProductsItem ? 'View Product' : 'Add to Cart'}
                            </button>
                        </div>
                    `;

                const productImageContainer = div.querySelector('.product-image-container');
                
                productImageContainer.style.backgroundImage = 
                    `url('..${imgLocationPNG}products/${product.imageUrl}')`;

                return div.outerHTML;
            }).join('');
}

export const goToProductPage = (event) => {
    const productID = event.target.dataset.id;
    window.location.hash = `product=${productID}`;  
}

export const addToCart = (event, products) => {
    const productID = event.target.dataset.id;
    const product = products.find(product => product.id === productID);
    cart.add(product);
}

export const generateStars = (rating) => {
    const starsMax = 5;
    const starsFull = Math.floor(rating);
    const starsEmpty = starsMax - starsFull;
    const starsArray = [];

    for (let i = 0; i < starsFull; i++) {
        const starImage = document.createElement('img');
        starImage.setAttribute('src', `..${imgLocationSVG}star-full.svg`);
        starImage.setAttribute('alt', 'Full Star');
        starsArray.push(starImage);
    }
    
    for (let i = 0; i < starsEmpty; i++) {
        const starImage = document.createElement('img');
        starImage.setAttribute('src', `..${imgLocationSVG}star-empty.svg`);
        starImage.setAttribute('alt', 'Empty Star');
        starsArray.push(starImage);
    }

    return starsArray;
}

export const createOptions = (optionNames, type = 'option') => {
    return optionNames.map(optionName => {
        const option = document.createElement(type);
        option.textContent = optionName;
        optionName = optionName.length > 2 ? 
            optionName.toLowerCase() :
            optionName.toUpperCase();
            
        type == 'option' && option.setAttribute('value', optionName);
        return option;
    });
}