import "../pages/index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import { validationSettings } from "../utils/constants.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";
import Api from "../components/Api.js";
import PopupDeleteCard from "../components/PopupDeleteCard.js";

// Selecting DOM elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector("#profile-description-input");
const addNewCardButton = document.querySelector(".profile__add-button");
const profileAvatarButton = document.querySelector(".profile__avatar-button");
const addCardForm = document.forms["card-form"];
const profileAvatarForm = document.forms["avatar-form"];
const profileEditForm = document.forms["profile-form"];


// User info instance
const userInfo = new UserInfo(".profile__title", ".profile__description", ".profile__image");

// API instance
const api = new Api({
    baseUrl: "https://around-api.en.tripleten-services.com/v1",
    headers: {
        authorization: "77757dbf-b91c-4ea3-9b26-87b0b8ebbc26",
        "Content-Type": "application/json"
    }
});

// Function to create a new card
function createCard(cardData) {
    const card = new Card(cardData, "#card-template", handleCardClick, handleDeleteCard, handleLikeClick);
    return card.getView();
}

// Function to handle card click (image preview)
function handleCardClick(data) {
    imagePopup.open(data);
}

// Function to handle add card form submission
function handleAddCardFormSubmit(data) {
    const cardData = { name: data["title"], link: data["URL"] };
    addCardPopup.renderLoading(true);
    api.addCard(cardData)
        .then((newCard) => {
            const cardElement = createCard(newCard);
            cardSection.addItem(cardElement);
            addCardPopup.close();
            addCardForm.reset();
        })
        .catch(console.error)
        .finally(() => {
            addCardPopup.renderLoading(false);
        })
}

// Function to handle profile form submission
function handleProfileFormSubmit(formData) {
    profileEditPopup.renderLoading(true);
    api.updateProfileInfo({ name: formData.title, description: formData.description })
        .then((data) => {
            userInfo.setUserInfo({ name: data.name, job: data.about });
            profileEditPopup.close();
        })
        .catch(console.error)
        .finally(() => {
            profileEditPopup.renderLoading(false);
        })
}

// Function to handle avatar form submission

function handleAvatarFormSubmit(data){
    editAvatarPopup.renderLoading(true);
  api.updateProfilePicture(data.url)
  .then((res)=>{
    userInfo.setUserAvatar(res);
    editAvatarPopup.close();
  })
  .catch(console.error)
  .finally(() =>{
    editAvatarPopup.renderLoading(false);
  })
}

// Event listeners
profileEditButton.addEventListener("click", () => {
    const profileData = userInfo.getUserInfo();
    profileTitleInput.value = profileData.name;
    profileDescriptionInput.value = profileData.job;
    profileEditPopup.open();
    editFormValidator.resetValidation();
});

addNewCardButton.addEventListener("click", () => {
    addCardPopup.open();
    cardFormValidator.resetValidation();
});

profileAvatarButton.addEventListener("click", () => {
    editAvatarPopup.open();
    avatarFormValidator.resetValidation();
} );

// Form validation instances
const cardFormValidator = new FormValidator(validationSettings, addCardForm);
const editFormValidator = new FormValidator(validationSettings, profileEditForm);
const avatarFormValidator = new FormValidator(validationSettings, profileAvatarForm);
avatarFormValidator.enableValidation();
editFormValidator.enableValidation();
cardFormValidator.enableValidation();

/*
const formValidators = {};

const enableValidation = (validationSettings) => {
    const formList = Array.from(document.querySelectorAll(validationSettings.formSelector))
    formList.forEach((formElement) => {
        const validator = new FormValidator(validationSettings, formElement)
        const formName = formElement.getAttribute("name");
        formValidators[formName] = validator;
        validator.enableValidation;
    })
}
enableValidation(validationSettings); */

// Section instance for cards
const cardSection = new Section(
    {
        items: [],
        renderer: (cardData) => {
            const cardElement = createCard(cardData);
            cardSection.addItem(cardElement);
        },
    },
    ".cards__list"
);

// Initial cards and user info
api.getAppData()
    .then(([cards, userData]) => {
        userInfo.setUserInfo({ name: userData.name, job: userData.about });
        userInfo.setUserAvatar({ avatar: userData.avatar})
        cardSection.items = cards;
        cardSection.renderItems();
    })
    .catch(console.error)

// Popup instances

const profileEditPopup = new PopupWithForm("#profile-modal", handleProfileFormSubmit);
profileEditPopup.setEventlisteners();

const addCardPopup = new PopupWithForm("#add-card-modal", handleAddCardFormSubmit);
addCardPopup.setEventlisteners();

const imagePopup = new PopupWithImage("#image-preview-modal");
imagePopup.setEventlisteners();

const deleteCardPopup = new PopupDeleteCard("#delete-card-modal");
deleteCardPopup.setEventListeners();

const editAvatarPopup = new PopupWithForm("#edit-avatar-modal", handleAvatarFormSubmit);
editAvatarPopup.setEventlisteners();

// Delete card function

function handleDeleteCard(cardId, cardElement){
    deleteCardPopup.open();
    deleteCardPopup.handleDeleteConfirm(() => {
        api.deleteCard(cardId)
            .then(() => {
                cardElement.removeCardElement();
                deleteCardPopup.close();
                })
                .catch(console.error)
            });
        }

// Handle likes function 

function handleLikeClick(cardId, cardInstance) {  
    if (cardInstance.isLiked()) {
      api.deleteLike(cardId)
        .then((res) => {
          cardInstance.setIsLiked(res.isLiked);
        })
        .catch(console.error);
    } else {
      api.addLike(cardId)
        .then((res) => {
          cardInstance.setIsLiked(res.isLiked);
        })
        .catch(console.error);
    }
  }
