import { cart, imgLocationPNG, imgLocationSVG } from "../assets/constants.js";


let checkoutItems;
let productsContainer;
let cartCheckoutTextContainer;
const checkout = {
    subTotal: 0,
    discount: 0,
    shipping: 0,
    total: 0
}

const createCheckoutList = () => {
    const uniqueMap = new Map();

    for (const item of cart.products) {
        const key = JSON.stringify([item.id, item.name, item.size, item.color]);

        if (!uniqueMap.has(key)) {
            uniqueMap.set(key, {...item, quantity: 1});
        }
        else {
            uniqueMap.get(key).quantity++;
        }
    }

    return [...uniqueMap.values()];
}

const deleteProduct = (event) => {
    const { name, size, color } = event.target.dataset;

    cart.remove(name, size, color);
    checkoutItems = checkoutItems.filter(p => !(p.name === name && p.size === size && p.color === color));

    productsContainer.replaceChildren(...renderCheckoutList());
    updateCheckout();
}

const increaseQuantity = (event) => {
    const { name, size, color } = event.target.dataset;

    const product = cart.products.find(p => p.name === name && p.size === size &&  p.color === color);
    if (!product) return;
    cart.add({ ...product });

    const checkoutItem = checkoutItems.find(p => p.name === name && p.size === size &&  p.color === color);
    if (checkoutItem) checkoutItem.quantity++;
    
    productsContainer.replaceChildren(...renderCheckoutList());
    updateCheckout();
}

const decreaseQuantiy = (event) => {
    const { name, size, color, quantity } = event.target.dataset;

    if (quantity === '1') return;

    const productIndex = cart.products.findIndex(p => p.name === name && p.size === size &&  p.color === color);
    if (productIndex === -1) return;
    cart.decreaseQuantity(productIndex);

    const checkoutItem = checkoutItems.find(p => p.name === name && p.size === size &&  p.color === color);
    if (checkoutItem) checkoutItem.quantity--;

    productsContainer.replaceChildren(...renderCheckoutList());
    updateCheckout();
}

const renderCheckoutList = () => {
    return checkoutItems.map(product => {
        const div = document.createElement('div');
        div.classList.add('checkout-product');
        const properties = 
            `
                data-name="${product.name}"${' '}
                data-size="${product.size}"${' '}
                data-color="${product.color}"
            `;

        div.innerHTML = 
            `
                <div class="product-image">
                    <img src="${imgLocationPNG}products/${product.imageUrl}" alt="${product.name}">
                </div>
                <p class="product-name">${product.name}</p>
                <p class="product-price">$${product.price}</p>
                <p class="product-quantity">
                    <span class="decrease-quantity" ${properties} data-quantity="${product.quantity}">
                        -
                    </span>
                    <span class="quantity">
                        ${product.quantity}
                    </span>
                    <span class="increase-quantity" ${properties}>
                        +
                    </span>
                </p>
                <p class="product-total">$${product.price * product.quantity}</p>
                <div>
                    <img src="${imgLocationSVG}cart-remove.svg"${' '}
                        alt="Delete Product"${' '}
                        class="product-delete"${' '}
                        ${properties}
                    >
                </div>
            `;

            return div;
    });
}

const updateCheckout = () => {
    const subTotalSpan = cartCheckoutTextContainer.querySelector('.sub-total');
    const totalSpan = cartCheckoutTextContainer.querySelector('.total-cost');
    const shippingText = cartCheckoutTextContainer.querySelector('.shipping-text');
    const shippingCostSpan = shippingText.querySelector('.shipping-cost');
    const discountText = cartCheckoutTextContainer.querySelector('.discount-text');
    const discountAmountSpan = cartCheckoutTextContainer.querySelector('.discount-amount');
    const discountLine = cartCheckoutTextContainer.querySelector('.discount-line');
    const shippingLine = cartCheckoutTextContainer.querySelector('.shipping-line');

    if (!checkoutItems || checkoutItems.length === 0) {
        Object.keys(checkout).forEach(key => {
            checkout[key] = 0;
        });

        shippingText.style.display = 'none';
        shippingLine.style.display = 'none';
    } 
    else {
        checkout.shipping = 30;
        shippingText.style.display = 'flex';
        shippingLine.style.display = 'block';
    }

    shippingCostSpan.textContent = `$${checkout.shipping}`;
    
    checkout.subTotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    subTotalSpan.textContent = `$${checkout.subTotal}`;

    if (checkout.subTotal >= 3000) {
        checkout.discount = checkout.subTotal * 0.1;
        discountText.style.display = 'flex';
        discountLine.style.display = 'block';
    }
    else {
        checkout.discount = 0;
        discountText.style.display = 'none'; 
        discountLine.style.display = 'none';     
    }

    discountAmountSpan.textContent = `$${checkout.discount}`;


    checkout.total = checkout.subTotal + checkout.shipping - checkout.discount;
    totalSpan.textContent = `$${checkout.total}`;
}

const clearShoppingCart = () => {
    cart.clear();
    checkoutItems = [];
    productsContainer.replaceChildren(...renderCheckoutList());
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateCheckout();
}

export async function render(htmlPromise) {
    const html = await htmlPromise;
    const main = document.querySelector('main');
    main.replaceChildren(html);

    productsContainer = main.querySelector('.products-container');
    cartCheckoutTextContainer = main.querySelector('.cart-checkout-text-container');
    const clearShoppingCartButton = main.querySelector('.clear-shopping-cart');
    const checkoutButton = main.querySelector('.checkout-button');
    const continueShoppingButton = main.querySelector('.continue-shopping');
    
    checkoutItems = createCheckoutList();
    productsContainer.replaceChildren(...renderCheckoutList());

    updateCheckout();

    clearShoppingCartButton.addEventListener('click', clearShoppingCart);
    
    checkoutButton.addEventListener('click', () => {
        const checkoutCompleteText = document.querySelector('.checkout-complete-text');
        clearShoppingCart();
        checkoutCompleteText.style.display = 'block';
    });

    continueShoppingButton.addEventListener('click', () => {
        window.location.hash = '#catalog';
    });

    productsContainer.addEventListener('click', (event) => {
        const target = event.target;

        target.closest('.product-delete') && deleteProduct(event);
        target.closest('.increase-quantity') && increaseQuantity(event);
        target.closest('.decrease-quantity') && decreaseQuantiy(event);
    });
}
