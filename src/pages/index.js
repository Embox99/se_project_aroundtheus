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
const profileEditForm = document.querySelector("#profile-edit-form");
const addNewCardButton = document.querySelector(".profile__add-button");
const addCardForm = document.querySelector("#add-card-form");
const profileAvatarButton = document.querySelector(".profile__avatar-button");
const profileAvatarForm = document.querySelector("#edit-avatar-form");

// User info instance
const userInfo = new UserInfo(".profile__title", ".profile__description");

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
        .catch((err) => {
            console.log(err);
        })
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
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            profileEditPopup.renderLoading(false);
        })
}

// Function to handle avatar form submission

function handleAvatarFormSubmit(data){
    editAvatarPopup.renderLoading(true);
  api.updateProfilePicture({data: data.avatar})
  .then((res)=>{
    userInfo.setUserAvatar(res.avatar);
    editAvatarPopup.close();
  })
  .catch((err)=>{
    console.log(err);
  })
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
api.renderCards()
    .then(([cards, userData]) => {
        userInfo.setUserInfo({ name: userData.name, job: userData.about });
        cardSection.items = cards;
        cardSection.renderItems();
    })
    .catch((err) => {
        console.log(err);
    });

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

/* function handleDeleteCard(card){
    deleteCardPopup.open();
    api.deleteCard(card)
        .then(() => {
            card.handleDeleteConfirm();
            deleteCardPopup.close();
        })
        .catch((err) => {
            console.log(err);
        });

} */


function handleDeleteCard(cardId, cardElement){
    console.log("Attempting to delete card:", cardId);
    deleteCardPopup.open();
    deleteCardPopup.handleDeleteConfirm(() => {
         console.log("Delete confirmation received");
        api.deleteCard(cardId)
            .then(() => {
                console.log("Card deleted successfully:", cardId);
                cardElement.removeCardElement();
                deleteCardPopup.close();
                })
            .catch((err) => {
                console.log("Error deleting card:", err);
                });
            });
        }

function handleLikeClick(cardId, cardElement) {
  const likeButton = cardElement.querySelector(".card__like-button");
  if (likeButton.classList.contains('card__like-button_active')) {
      api.deleteLike(cardId)
          .then(() => {
              likeButton.classList.remove('card__like-button_active');
          })
          .catch((err) => {
              console.log(err);
          });
  } else {
      api.addLike(cardId)
          .then(() => {
              likeButton.classList.add('card__like-button_active');
          })
          .catch((err) => {
              console.log(err);
          });
  }
}

// Get user info on page load
api.getUserInfo()
    .then((data) => {
        userInfo.setUserInfo({ name: data.name, job: data.about });
    })
    .catch((err) => {
        console.log(err);
    });
