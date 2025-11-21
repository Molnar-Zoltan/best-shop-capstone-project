import { imgLocationPNG, imgLocationSVG } from "../assets/constants.js";

const aboutItems = [
    { 
        name: 'Superior Accuracy', 
        description: 'Qewist vestibulum elit vel neque pharetra vulputate scelerisque nisi urna.',
        image: `..${imgLocationSVG}about-page-accuracy.svg`
    },
    { 
        name: 'Awards', 
        description: 'Vestibulum elit vel neque pharetra vulputate. Quisque scelerisque nisi urna.',
        image: `..${imgLocationSVG}about-page-awards.svg`
    },
    { 
        name: 'Ecological', 
        description: 'Elit vel neque duis vestibulum pharetra vulputateuisque scelerisque nisi urna.',
        image: `..${imgLocationSVG}about-page-ecological.svg`
    },
    { 
        name: 'Shipping Worldwide', 
        description: 'Quisque scelerisque nisi urna. Duis vestibulum elit vel neque pharetra vulputate.',
        image: `..${imgLocationSVG}about-page-worldwide.svg`
    },
];

const teamMembers = [
    { 
        name: 'NATALIA FOSTER', 
        description: 'Product Manager',
        image: `..${imgLocationPNG}about-natalia-foster.png`
    },
    { 
        name: 'ALEXANDRA THOMPSON', 
        description: 'Graphic Designer',
        image: `..${imgLocationPNG}about-alexandra-thompson.png`
    },
    { 
        name: 'IRYNA BROOKS', 
        description: 'Head of Marketing',
        image: `..${imgLocationPNG}about-iryna-brooks.png`
    }
];


export async function render(htmlPromise) {
    const html = await htmlPromise;
    const main = document.querySelector('main');
    const aboutInformation = html.querySelector('.about-information');
    const aboutTeam = html.querySelector('.about-team-members-container');

    aboutInformation.append(
        ...aboutItems.map(aboutItem => {
            const div = document.createElement('div');
            div.classList.add('about-information-item');

            div.innerHTML =
                `
                    <img class="item-information-image" src=${aboutItem.image} alt="${aboutItem.name}">
                    <p class="item-information-name">${aboutItem.name}</p>
                    <p class="item-information-description">${aboutItem.description}</p>
                `;

            return div;
        })
    );

    aboutTeam.append(
        ...teamMembers.map(teamMember => {
            const div = document.createElement('div');
            div.classList.add('about-team-member');

            div.innerHTML = 
                `
                    <img class="team-member-image" src="${teamMember.image}" alt="${teamMember.name}">
                    <h4 class="team-member-name">${teamMember.name}</h4>
                    <p class="team-member-description">${teamMember.description}</p>
                `;

            return div;
        })
    )

    main.replaceChildren(html);

    const seeAllModelsButton = main.querySelector('.see-all-models-button');

    seeAllModelsButton.addEventListener('click', () => window.location.hash = 'catalog');
}