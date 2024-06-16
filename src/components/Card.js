export default class Card {
  constructor({ name, link, id }, cardSelector, handleImageClick, handleDeleteCard, handleLike) {
    this._name = name;
    this._link = link;
    this._id = id;
    this._cardSelector = cardSelector;
    this._handleImageClick = handleImageClick;
    this._handleDeleteCard = handleDeleteCard;
    this._handleLike = handleLike;
  }

  _handleLikeIcon() {
    this._likeButton.classList.toggle("card__like-button_active");
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => {
      this._handleLikeIcon();
    });
    this._trashButton.addEventListener("click", () => {
      this._handleDeleteCard(this._id);
    });
    this._cardImageEl.addEventListener("click", () => {
      this._handleImageClick({ name: this._name, link: this._link });
    });
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
    return this._cardElement;
  }
}
