import "../pages/index.css";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import { initialCards, validationSettings } from "../utils/constants.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithImage from "../components/PopupWithImage.js";
import UserInfo from "../components/UserInfo.js";

// Selecting DOM elements
const profileEditButton = document.querySelector(".profile__edit-button");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = document.querySelector("#profile-edit-form");
const addNewCardButton = document.querySelector(".profile__add-button");
const addCardForm = document.querySelector("#add-card-form");

// User info instance
const userInfo = new UserInfo(".profile__title", ".profile__description");

// Function to create a new card
function createCard(cardData) {
  const card = new Card(cardData, "#card-template", handleCardClick);
  return card.getView();
}

// Function to handle card click (image preview)
function handleCardClick(data) {
  imagePopup.open(data);
}

// Function to handle add card form submission
function handleAddCardFormSubmit(data) {
  const cardData = { name: data["title"], link: data["URL"] };
  const cardElement = createCard(cardData);
  cardSection.addItem(cardElement);
  addCardPopup.close();
  addCardForm.reset();
}

// Function to handle profile form submission
function handleProfileFormSubmit(formData) {
  userInfo.setUserInfo({ name: formData.title, job: formData.description });
  profileEditPopup.close();
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

// Form validation instances
const cardFormValidator = new FormValidator(validationSettings, addCardForm);
const editFormValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
editFormValidator.enableValidation();
cardFormValidator.enableValidation();

// Render initial cards
const cardSection = new Section(
  {
    items: initialCards,
    renderer: (cardData) => {
      const cardElement = createCard(cardData);
      cardSection.addItem(cardElement);
    },
  },
  ".cards__list"
);
cardSection.renderItems();

// Popup instances
const profileEditPopup = new PopupWithForm(
  "#profile-modal",
  handleProfileFormSubmit
);
profileEditPopup.setEventlisteners();

const addCardPopup = new PopupWithForm(
  "#add-card-modal",
  handleAddCardFormSubmit
);
addCardPopup.setEventlisteners();

const imagePopup = new PopupWithImage("#image-preview-modal");
imagePopup.setEventlisteners();
