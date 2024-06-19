import Popup from "./Popup";

export default class PopupDeleteCard extends Popup {
    constructor(modalSelector){
        super(modalSelector);
        this._popupForm = this._popupElement.querySelector(".modal__form");
        this._popupButton = this._popupElement.querySelector(".modal__button");
    }

    handleDeleteConfirm(callback){
        this._handleDeleteConfirm = callback;
    }

    setEventListeners(){
        super.setEventlisteners();
        this._popupForm.addEventListener("submit", (e) => {
            e.preventDefault(); 
            console.log("Delete confirmation received"); 
            this._handleDeleteConfirm();
        });
    }
}
