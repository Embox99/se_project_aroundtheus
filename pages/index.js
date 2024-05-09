import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";

const initialCards = [
  {
    name: "Yosemite Valley",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/yosemite.jpg",
  },
  {
    name: "Lake Louise",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lake-louise.jpg",
  },
  {
    name: "Bald Mountains",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/bald-mountains.jpg",
  },
  {
    name: "Latemar",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/latemar.jpg",
  },
  {
    name: "Vanoise National Park",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/vanoise.jpg",
  },
  {
    name: "Lago di Braies",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/around-project/lago.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const profileEditModal = document.querySelector("#profile-modal");
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileTitleInput = document.querySelector("#profile-title-input");
const profileDescriptionInput = document.querySelector(
  "#profile-description-input"
);
const profileEditForm = document.forms["profile-edit-form"];
const imagePreviewModal = document.querySelector("#image-preview-modal");
const imagePreviewImage = document.querySelector("#image-preview");
const imagePreviewTitle = document.querySelector(".modal__image-title");
const cardList = document.querySelector(".cards__list");
const addNewCardButton = document.querySelector(".profile__add-button");
const addCardModal = document.querySelector("#add-card-modal");
const addCardForm = document.forms["add-card-form"];
const cardTitleInput = document.querySelector("#card-title-input");
const cardUrlInput = document.querySelector("#card-image-input");
const allModals = document.querySelectorAll(".modal");

const validationSettings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__button",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

//functions//

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keydown", closeModalEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keydown", closeModalEscape);
}

function openImagePreviewModal({name, link}) {
  imagePreviewImage.src = link;
  imagePreviewImage.alt = name;
  imagePreviewTitle.textContent = name;
  openModal(imagePreviewModal);
}

function createCard(cardData){
  const cardElement = new Card(cardData, "#card-template", openImagePreviewModal);
  return cardElement.getView();
}

function renderCard(cardData, method = "prepend") {
  const cardElement = createCard(cardData);
  cardList.prepend(cardElement);
}

function handleAddCardFormSumbit(e) {
  e.preventDefault();
  const name = cardTitleInput.value;
  const link = cardUrlInput.value;
  renderCard({ name, link });
  closeModal(addCardModal);
  addCardForm.reset();
}

function handleProfileFormSubmit(e) {
  e.preventDefault();
  profileName.textContent = profileTitleInput.value;
  profileDescription.textContent = profileDescriptionInput.value;
  closeModal(profileEditModal);
}

function closeModalEscape(e) {
  if (e.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

//Listeners//
addCardForm.addEventListener("submit", handleAddCardFormSumbit);
profileEditForm.addEventListener("submit", handleProfileFormSubmit);

profileEditButton.addEventListener("click", () => {
  profileTitleInput.value = profileName.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  openModal(profileEditModal);
  editFormValidator.resetValidation();
});

addNewCardButton.addEventListener("click", () => {
  openModal(addCardModal);
  cardFormValidator.resetValidation();
});

initialCards.forEach(renderCard);

allModals.forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("modal_opened")) {
      closeModal(modal);
    }
    if (e.target.classList.contains("modal__close")) {
      closeModal(modal);
    }
  });
});

// Form Validation

const cardFormValidator = new FormValidator(validationSettings, addCardForm);
const editFormValidator = new FormValidator(
  validationSettings,
  profileEditForm
);
editFormValidator.enableValidation();
cardFormValidator.enableValidation();
