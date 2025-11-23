import { 
    createProductCards, 
    fetchData, 
    cart,
    imgLocationPNG, imgLocationSVG,
    setInputLength, maxEmailLength, maxUserInputLength, maxMessageLength,
    validateEmailInput, validateTextInput, isInput, resetInputs,
    emailRegex,
    goToProductPage, addToCart,
    generateStars,
    colors, sizes, categories,
    createOptions
} from "../assets/constants.js";

const getProductByID = (products, productID) => {
    return products.find(product => product.id === productID);
}

const updateQuantity = (quantityNumber, operator) => {
    if (operator !== '-' && operator !== '+') return;

    const operations = { '+': 1, '-': -1 };
    
    let number = Number(quantityNumber.textContent);
    number += operations[operator];
    number >= 1 && (quantityNumber.textContent = number); 
}

const updateProperty = (event, product) => {
    event.target.value !== '' && 
        (product[event.target.dataset.property] = event.target.value);
}

const getRandomProducts = (products) => {
    const newArrayLength = 4;
    if (products.length < newArrayLength) return;
    const productsArray = [...products];
    const newArray = [];

    for (let i = 0; i < newArrayLength; i++) {
        const j = Math.floor(Math.random() * (productsArray.length));
        newArray.push(productsArray.splice(j, 1)[0]);
    }
    return newArray;
}

const generateReviewStars = (rating) => {
    const starsMax = 5;
    const starsEmpty = starsMax - rating;
    const starsArray = [];

    for (let i = 0; i < rating; i++) {
        const starImage = document.createElement('img');
        starImage.setAttribute('src', `..${imgLocationSVG}star-full.svg`);
        starImage.setAttribute('alt', 'Review Star Full');
        starImage.classList.add(`rate-product-star-${starsArray.length + 1}`);
        starsArray.push(starImage);
    }

    for (let i = 0; i < starsEmpty; i++) {
        const starImage = document.createElement('img');
        starImage.setAttribute('src', `..${imgLocationSVG}star-review.svg`);
        starImage.setAttribute('alt', 'Review Star Empty');
        starImage.classList.add(`rate-product-star-${starsArray.length + 1}`);
        starsArray.push(starImage);
    }

    return starsArray;
}

const modifyReviewStars = (rating, starsImageArray) => {
    const starsEmpty = Array.from(starsImageArray).length - rating;
    let count = 0;

    for (let i = 0; i < rating; i++) {
        starsImageArray[count].setAttribute('src', `..${imgLocationSVG}star-full.svg`);
        starsImageArray[count].setAttribute('alt', 'Review Star Full');
        count++;
    }

    for (let i = 0; i < starsEmpty; i++) {
        starsImageArray[count].setAttribute('src', `..${imgLocationSVG}star-review.svg`);
        starsImageArray[count].setAttribute('alt', 'Review Star Full');
        count++;
    }
}

const switchTab = (event, newContent, previousTab, previousContent) => {
    event.target.classList.add('tab-active');
    previousTab.classList.remove('tab-active');

    newContent.style.display = 'flex';
    previousContent.style.display = 'none';
}

export async function render(htmlPromise) {
    const html = await htmlPromise;
    const main = document.querySelector('main');
    main.replaceChildren(html);

    let hash = window.location.hash;
    const productID = hash.slice(hash.indexOf('=') + 1);

    const response = await fetchData();

    if (!response.success)  {
        main.innerHTML = response.error;
        return;
    }

    const productImageContainer = main.querySelector('.product-image-main');
    const productNames = main.querySelectorAll('.product-name');
    const productPriceText = main.querySelector('.product-price');
    const quantityNumber = main.querySelector('.quantity-number');
    const quantityMinus = main.querySelector('.quantity-minus');
    const quantityPlus = main.querySelector('.quantity-plus');
    const addToCartButton = main.querySelector('.add-to-cart-button');
    const productImageMain = document.createElement('img');
    const dropdownSize = main.querySelector('#dropdown-size');
    const dropdownColor = main.querySelector('#dropdown-color');
    const dropdownCategory = main.querySelector('#dropdown-category');
    const productsItemsContainer = main.querySelector('.products-items');
    const productRatingContainers = main.querySelectorAll('.product-rating');
    const productDetailsTab = main.querySelector('.details');
    const productReviewsTab = main.querySelector('.reviews');
    const productDetailsContent = main.querySelector('.product-details');
    const productReviewsContent = main.querySelector('.product-reviews');
    const rateProductStars = main.querySelector('.rate-product-stars');
    const addReviewForm = main.querySelector('.add-review-form');
    const reviewEmpty = main.querySelector('.error-review-empty');
    const reviewLong = main.querySelector('.error-review-long');
    const nameEmpty = main.querySelector('.error-name-empty');
    const nameLong = main.querySelector('.error-name-long');
    const emailInvalid = main.querySelector('.error-email');
    const reviewInput = main.querySelector('#your-review');
    const nameInput = main.querySelector('#name');
    const emailInput = main.querySelector('#email');
    const successMessage = main.querySelector('.success-message');
    const ratingError = main.querySelector('.error-rating');

    let rating = 0;

    dropdownSize.append(...createOptions(sizes));
    dropdownColor.append(...createOptions(colors));
    dropdownCategory.append(...createOptions(categories));

    rateProductStars.append(...generateReviewStars(rating));

    const data = response.data.data;
    const product = getProductByID(data, productID);

    if (!product) {
        const div = document.createElement('div');
        div.classList.add('product-not-found');

        const h4 = document.createElement('h4');
        h4.textContent = `Product ${productID} not found`;
        div.append(h4);

        main.innerHTML = div.outerHTML;
        return;
    }

    productImageMain.setAttribute('src', `..${imgLocationPNG}products/${product.imageUrl}`);
    productImageMain.setAttribute('alt', product.name);
    productImageContainer.append(productImageMain);

    productRatingContainers.forEach(productRatingContainer => {
        productRatingContainer.append(...generateStars(product.rating));
    });

    productNames.forEach(productName => productName.textContent = product.name);

    productPriceText.textContent = `$${product.price}`;

    quantityMinus.addEventListener('click', () => updateQuantity(quantityNumber, '-'));
    quantityPlus.addEventListener('click', () => updateQuantity(quantityNumber, '+'));

    [dropdownSize, dropdownColor, dropdownCategory].forEach(dropdown => {
        dropdown.addEventListener('change', (event) => updateProperty(event, product));
    });

    addToCartButton.addEventListener('click', () => {
        const quantity = Number(quantityNumber.textContent);
        cart.add(...Array(quantity).fill(product));
    });

    const youMayAlsoLikeArray = getRandomProducts(data);
    productsItemsContainer.innerHTML = createProductCards(youMayAlsoLikeArray);

    productDetailsTab.addEventListener('click', 
        (event) => switchTab(event, productDetailsContent, productReviewsTab, productReviewsContent)
    );

    productReviewsTab.addEventListener('click', 
        (event) => switchTab(event, productReviewsContent, productDetailsTab, productDetailsContent)
    );

    addReviewForm.addEventListener('focusout', (event) => {
        const target = event.target;
       
        if (isInput(target)) {
            switch(target.id) {
                case 'your-review': {
                    const review = target.value.trim();
                    validateTextInput(review, reviewEmpty, reviewLong, maxMessageLength);
                }
                break;
                case 'name': {
                    const name = target.value.trim();
                    validateTextInput(name, nameEmpty, nameLong, maxUserInputLength);
                }
                break;
                case 'email': {
                    const email = target.value.trim();
                    validateEmailInput(email, emailInvalid, maxEmailLength);
                }
                break;
            }
        }
    });

    addReviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const reviewLength = reviewInput.value.length;
        const nameLength = nameInput.value.length;
        const emailLength = emailInput.value.length;

        const review = reviewInput.value.trim();
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();


        if (!review || reviewLength > maxMessageLength) {
            validateTextInput(review, reviewEmpty, reviewLong, maxMessageLength);
            return;
        }

        if (!name || nameLength > maxUserInputLength) {
            validateTextInput(name, nameEmpty, nameLong, maxUserInputLength);
            return;
        }

        if (!emailRegex.test(email) || emailLength > maxEmailLength) {
            validateEmailInput(email, emailInvalid, maxEmailLength);
            return;
        }

        if (rating === 0) {
            ratingError.style.display = 'block';
            return;
        }

        resetInputs(
            reviewInput, 
            nameInput, 
            emailInput
        );


        rating = 0;
        modifyReviewStars(rating, rateProductStarsContainer);
        ratingError.style.display = 'none';

        successMessage.style.display = 'block';
        setTimeout(() => (successMessage.style.display = 'none'), 5000);
    });

    setInputLength(nameInput, maxUserInputLength);
    setInputLength(emailInput, maxEmailLength);
    setInputLength(reviewInput, maxMessageLength);

    const addToCartButtons = main.querySelectorAll('.add-to-cart');
    const productImages = main.querySelectorAll('.product-image-container');

    productImages.forEach(image => image.addEventListener('click', goToProductPage));
    addToCartButtons.forEach(button => button.addEventListener('click', (event) => addToCart(event, data)));

    const rateProductStarsContainer = main.querySelectorAll('.rate-product-stars img');
    rateProductStarsContainer.forEach(ratePorductStar => 
        ratePorductStar.addEventListener('click', (event) => {
            const userRating = event.target.className.slice(-1);
            modifyReviewStars(userRating, rateProductStarsContainer);
            rating = userRating;
            ratingError.style.display = 'none';
        })
    );
    
}