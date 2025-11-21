import { 
    htmlLocation,
    maxEmailLength,
    maxUserInputLength,
    emailRegex,
    validateEmailInput,
    validateTextInput,
    setInputLength,
    cart,
    imgLocationSVG
} from "../assets/constants.js";

const routes = [
    { path: 'home',     label: 'Home',          page: () => loadPage('home') },
    { path: 'catalog',  label: 'Catalog',       page: () => loadPage('catalog') },
    { path: 'about',    label: 'About Us',      page: () => loadPage('about') },
    { path: 'contact',  label: 'Contact Us',    page: () => loadPage('contact') },
    { path: 'cart',     label: '',              page: () => loadPage('cart') },
    { path: 'product',  label: '',              page: () => loadPage('product') },
];

const socials = [
    { href: 'https://facebook.com',     title: 'Facebook',      src: `${imgLocationSVG}socials-facebook.svg` },
    { href: 'https://x.com',            title: 'Twitter',       src: `${imgLocationSVG}socials-twitter.svg` },
    { href: 'https://instagram.com',    title: 'Instagram',     src: `${imgLocationSVG}socials-instagram.svg` },
];

const benefitsItems = [
    { img: `${imgLocationSVG}benefits-item1.svg`,  text: 'Velit nisl sodales eget donec quis. volutpat orci.' },
    { img: `${imgLocationSVG}benefits-item2.svg`,  text: 'Dolor eu varius. Morbi fermentum velit nisl.' },
    { img: `${imgLocationSVG}benefits-item3.svg`,  text: 'Malesuada fames ac ante ipsum primis in faucibus.' },
    { img: `${imgLocationSVG}benefits-item4.svg`,  text: 'Nisl sodales eget donec quis. volutpat orci.' },
];

const nav = document.querySelector("nav");
const socialsContainer = document.querySelector(".socials");
const hamburgerButton = document.querySelector(".hamburger-button");
const hamburgerButtonClose = document.querySelector(".hamburger-button-close");
const benefitsItemsContainer = document.querySelector(".benefits-items-container");
const copyrightYearText = document.querySelector(".copyright-year");
const loginIcon = document.querySelector(".login-icon");
const loginOverlay = document.querySelector(".login-overlay");
const loginCloseButton = document.querySelector(".login-close");
const loginForm = document.querySelector('.login-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginPasswordEyeIcon = document.querySelector('.password-eye-icon');
const loginEmailInvalid = document.querySelector('.email-invalid-text');
const loginPasswordEmpty = document.querySelector('.login-password-empty');
const loginPasswordLong = document.querySelector('.login-password-long');
const cartCircle = document.querySelector('.cart-circle');
const cartCount = document.querySelector('.cart-count');
setInputLength(loginEmailInput, maxEmailLength);
setInputLength(loginPasswordInput, maxUserInputLength);

const fetchHTML = async (pageName) => {
    try {
        const response = await fetch(`${htmlLocation}${pageName}.html`);

        if (!response.ok) {
            throw new Error(`Failed to fetch ${pageName}.html (HTTP ${response.status})`);
        }

        const text = await response.text();
        const template = document.createElement('template');
        template.innerHTML = text.trim();

        return template.content.firstElementChild;
    }
    catch(error) {
        const p = document.createElement('p');
        p.textContent = error.message;
        return p;
    }
}

const loadPage = async (pageName) => {
    try {
        const module = await import(`./${pageName}.js`);
        return module.render(fetchHTML(pageName));
    }
    catch(error) {
        return `<p>Error loading module: ${error.message}</p>`;
    }
}

socialsContainer.innerHTML = socials.map(social => 
    `<a href=${social.href} title=${social.title} target="_blank" rel="noopener noreferrer">
        <img src=${social.src} alt="Facebook">
    </a>`
).join('');

const visibleRoutes = routes.filter(route => route.label?.trim());
nav.innerHTML = visibleRoutes.map(route => `<a href="#${route.path}">${route.label}</a>`).join('');
const menuItems = document.querySelectorAll("nav a");

const catalog = document.querySelector('a[href="#catalog"]');
catalog && catalog.classList.add('catalog-menu-item');
const arrowIcon = document.createElement("img");
arrowIcon.setAttribute('src', `${imgLocationSVG}catalog-arrow.svg`);
arrowIcon.setAttribute('alt', 'Arrow icon');
catalog && catalog.append(arrowIcon);

document.addEventListener('cartChanged', () => {
    localStorage.setItem('cart', JSON.stringify(cart.products));

    if (!cart.getLength()) {
        cartCircle.style.display = 'none';
        return;
    }

    cartCircle && (cartCircle.style.display = 'flex');
    cartCount && (cartCount.textContent = cart.getLength());
});

cart.initialize();

[hamburgerButton, hamburgerButtonClose].forEach((button) => {
    button.addEventListener("click", () => {
        hamburgerButton.classList.toggle("hidden-mobile");
        hamburgerButtonClose.classList.toggle("hidden-mobile");
        nav.classList.toggle("hidden-mobile");
    });
});

loginIcon.addEventListener('click', () => {
    loginOverlay.classList.add("show");
});

loginCloseButton.addEventListener('click', () => {
    loginOverlay.classList.remove('show');
});

loginPasswordEyeIcon.addEventListener('click', (event) => {
    const isPassword = loginPasswordInput.type === 'password';
    loginPasswordInput.type = isPassword ? 'text' : 'password';
    event.target.title = isPassword ? 'Hide password' : 'Show password';
});

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const loginEmail = loginEmailInput.value.trim();
    const loginPassword = loginPasswordInput.value.trim();

    if (!emailRegex.test(loginEmail) ||  loginEmail.length > maxEmailLength) {
        validateEmailInput(loginEmail, loginEmailInvalid, maxEmailLength);
        return;
    }

    if (!loginPassword || loginPassword.length > maxUserInputLength) {
        validateTextInput(loginPassword, loginPasswordEmpty, loginPasswordLong, maxUserInputLength);
        return;
    }

    loginEmailInput.value = '';
    loginPasswordInput.value = '';
    loginOverlay.classList.remove('show');
});

loginEmailInput.addEventListener('blur', () => {
    const loginEmail = loginEmailInput.value;
    validateEmailInput(loginEmail, loginEmailInvalid, maxEmailLength);
});

loginPasswordInput.addEventListener('blur', () => {
    const loginPassword = loginPasswordInput.value;
    validateTextInput(loginPassword, loginPasswordEmpty, loginPasswordLong, maxUserInputLength);
});

const render = async () => {
    let hash = location.hash.slice(1);

    if(hash.includes('=')) {
        hash = hash.slice(0, hash.indexOf('='));
    } 

    const route = routes.find(r => r.path === hash);

    if (!route) {
        await routes[0].page();
        menuItems[0].classList.add('menu-item-active');
        return;
    }

    await route.page();

    Array.from(menuItems).forEach(menuItem => {
        menuItem.hash !== location.hash 
        ? 
            menuItem.classList.remove('menu-item-active')
        :
            menuItem.classList.add('menu-item-active');
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

benefitsItemsContainer.append(
    ...benefitsItems.map(item => {
        const benefitsItem = document.createElement('div');
        benefitsItem.classList.add('benefits-item');

        const img = document.createElement('img');
        img.setAttribute('src', item.img);
        img.setAttribute('alt', 'Benefits item');

        const span = document.createElement('span');
        span.textContent = item.text;

        benefitsItem.append(img, span);
        return benefitsItem;
    })
);




window.addEventListener('hashchange', render);
render();

const updateCopyrightYear = () => {
    if (!copyrightYearText) return;

    const copyrightYear = copyrightYearText.textContent;
    const currentYear = String(new Date().getFullYear());

    if (copyrightYear !== currentYear) {
        copyrightYearText.textContent = String(currentYear);
    }
}

updateCopyrightYear();
