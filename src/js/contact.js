import { 
    emailRegex, 
    maxEmailLength, maxMessageLength, maxUserInputLength,
    validateEmailInput, validateTextInput, isInput, resetInputs,
    setInputLength,
    imgLocationSVG
} from "../assets/constants.js";

const contactItems = [
    { 
        name: 'Our Location', 
        description1: '1234 NW Bobcat Lane, St.',
        description2: 'Robert, MO 65584-5678',
        image: `${imgLocationSVG}contact-page-location.svg`
    },
    { 
        name: 'Operating Time', 
        description1: 'Weekends: 10:30 AM - 6 PM',
        description2: 'Monday - Friday: 9 AM - 6 PM',
        image: `${imgLocationSVG}contact-page-time.svg`
    },
    { 
        name: 'Our Email', 
        description1: 'info@bestshop.com',
        description2: 'best@shop.com',
        image: `${imgLocationSVG}contact-page-email.svg`
    },
    { 
        name: 'Call Us', 
        description1: '(760)265-2917',
        description2: '(268)142-8413',
        image: `${imgLocationSVG}contact-page-phone.svg`
    },
];

export async function render(htmlPromise) {

    const html = await htmlPromise;
    const main = document.querySelector('main');
    const contactInformation = html.querySelector('.contact-information');

    contactInformation.append(
        ...contactItems.map(contactItem => {
            const div = document.createElement('div');
            div.classList.add('contact-information-item');

            div.innerHTML =
                `
                    <img class="item-information-image" src=${contactItem.image} alt="${contactItem.name}">
                    <p class="item-information-name">${contactItem.name}</p>
                    <div class="item-information-description-container">
                        <p class="item-information-description">${contactItem.description1}</p>
                        <p class="item-information-description">${contactItem.description2}</p>
                    </div>
                `;

            return div;
        })
    );

    main.replaceChildren(html);

    const contactNameInput = document.getElementById('contact-name');
    const contactEmailInput = document.getElementById('contact-email');
    const contactTopicInput = document.getElementById('contact-topic');
    const contactMessageInput = document.getElementById('contact-message');
    const contactForm = document.querySelector('.contact-form');

    const contactNameEmpty = document.querySelector('.error-contact-name-empty');
    const contactNameLong = document.querySelector('.error-contact-name-long');
    const contactEmailInvalid = document.querySelector('.error-contact-email-invalid');
    const contactTopicEmpty = document.querySelector('.error-contact-topic-empty');
    const contactTopicLong = document.querySelector('.error-contact-topic-long');
    const contactMessageEmpty = document.querySelector('.error-contact-message-empty');
    const contactMessageLong = document.querySelector('.error-contact-message-long');
    const contactSuccess = document.querySelector('.contact-success-message');

    setInputLength(contactNameInput, maxUserInputLength);
    setInputLength(contactEmailInput, maxEmailLength);
    setInputLength(contactTopicInput, maxUserInputLength);
    setInputLength(contactMessageInput, maxMessageLength);

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const contactNameLength = contactNameInput.value.length;
        const contactEmailLength = contactEmailInput.value.length;
        const contactTopicLength = contactTopicInput.value.length;
        const contactMessageLength = contactMessageInput.value.length;

        const contactName = contactNameInput.value.trim();
        const contactEmail = contactEmailInput.value.trim();
        const contactTopic = contactTopicInput.value.trim();
        const contactMessage = contactMessageInput.value.trim();

        if (!contactName || contactNameLength > maxUserInputLength) {
            validateTextInput(contactName, contactNameEmpty, contactNameLong, maxUserInputLength);
            return;
        }

        if (!emailRegex.test(contactEmail) || contactEmailLength > maxEmailLength) {
            validateEmailInput(contactEmail, contactEmailInvalid, maxEmailLength);
            return;
        }

        if (!contactTopic || contactTopicLength > maxUserInputLength) {
            validateTextInput(contactTopic, contactTopicEmpty, contactTopicLong, maxUserInputLength);
            return;
        }

        if (!contactMessage || contactMessageLength > maxMessageLength) {
            validateTextInput(contactMessage, contactMessageEmpty, contactMessageLong, maxMessageLength);
            return;
        }

        resetInputs(
            contactNameInput, 
            contactEmailInput, 
            contactTopicInput, 
            contactMessageInput
        );

        contactSuccess.style.display = 'block';
        setTimeout(() => (contactSuccess.style.display = 'none'), 5000);
    });

    contactForm.addEventListener('focusout', (event) => {
        const target = event.target;
       
        if (isInput(target)) {
            switch(target.id) {
                case 'contact-name': {
                    const contactName = target.value.trim();
                    validateTextInput(contactName, contactNameEmpty, contactNameLong, maxUserInputLength);
                }
                break;
                case 'contact-email': {
                    const contactEmail = target.value.trim();
                    validateEmailInput(contactEmail, contactEmailInvalid, maxEmailLength);
                }
                break;
                case 'contact-topic': {
                    const contactTopic = target.value.trim();
                    validateTextInput(contactTopic, contactTopicEmpty, contactTopicLong, maxUserInputLength);
                }
                break;
                case 'contact-message': {
                    const contactMessage = target.value.trim();
                    validateTextInput(contactMessage, contactMessageEmpty, contactMessageLong, maxMessageLength);
                }
                break;
            }
        }
    });

}

