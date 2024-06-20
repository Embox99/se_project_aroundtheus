export default class Card {
  constructor(data, cardSelector, handleImageClick, handleDeleteCard, handleLikeClick) {
    this._name = data.name;
    this._link = data.link;
    this._id = data._id;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteCard = handleDeleteCard;
    this._handleLikeClick = handleLikeClick;
    this._isLiked = data.isLiked;
  }

  _renderLikes() {
    const likeButton = this._cardElement.querySelector(".card__like-button");
    if (this._isLiked) {
      likeButton.classList.add("card__like-button_active");
    } else {
      likeButton.classList.remove("card__like-button_active");
    }
  }



  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeClick(this._id, this._cardElement);
    });
    this._trashButton.addEventListener("click", (e) => {
      this._handleDeleteCard(this._id, this);
    });
    this._cardImageEl.addEventListener("click", () => {
      this._handleImageClick({ name: this._name, link: this._link });
    });
  }

  removeCardElement() {
    this._cardElement.remove();
    this._cardElement = null;
  }

  getView() {
    this._cardElement = document
      .querySelector(this._cardSelector)
      .content.firstElementChild.cloneNode(true);

    this._trashButton = this._cardElement.querySelector(".card__remove-button");
    this._likeButton = this._cardElement.querySelector(".card__like-button");
    this._cardImageEl = this._cardElement.querySelector(".card__image");
    this._cardTitleEl = this._cardElement.querySelector(".card__text");
    this._cardImageEl.src = this._link;
    this._cardTitleEl.textContent = this._name;
    this._cardImageEl.alt = this._name;

    this._setEventListeners();
    this._renderLikes();
    return this._cardElement;
  }
}
