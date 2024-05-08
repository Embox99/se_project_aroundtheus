export default class FormValidator {
  constructor(settings, formElement) {
    this._inputSelector = settings.inputSelector;
    this._submitButtonSelector = settings.submitButtonSelector;
    this._inactiveButtonClass = settings.inactiveButtonClass;
    this._inputErrorClass = settings.inputErrorClass;
    this._errorClass = settings.errorClass;
    this._formElement = formElement;
  }

  _hideInputError(inputEl) {
    errorMassageEl = this._formElement.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.remove(this._inputErrorClass);
    errorMassageEl.textContent = "";
    errorMassageEl.classList.remove(this._errorClass);
  }

  _showInputError(inputEl) {
    errorMassageEl = this._formElement.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.add(this._inputErrorClass);
    errorMassageEl.textContent = inputEl.validationMessage;
    errorMassageEl.classList.add(this._errorClass);
  }

  _checkInputValidity(inputEl) {
    if (!inputEl.validity.valid) {
      showInputError(inputEl);
    } else {
      hideInputError(inputEl);
    }
  }

  _toggleButtonState() {
    let foundInvalid = false;
    this._inputElements.forEach((inputEl) => {
      if (!inputEl.validity.valid) {
        foundInvalid = true;
      }
    });

    if (foundInvalid) {
      submitButton.classList.add(this._inactiveButtonClass);
      submitButton.disabled = true;
    } else {
      submitButton.classList.remove(this._inactiveButtonClass);
      submitButton.disabled = false;
    }
  }

  _setEventListeners() {
    this._inputElements = Array.from(
      this._formElement.querySelectorAll(this._inputSelector)
    );
    this._submitButton = this._formElement.querySelector(
      this._submitButtonSelector
    );
    inputElements.forEach((inputEl) => {
      inputEl.addEventListener("input", () => {
        _checkInputValidity(inputEl);
        _toggleButtonState();
      });
    });
  }

  enableValidation() {
    this._formElement.addEventListener("submit", (e) => {
      e.preventDefault;
    });
    setEventListeners(formEl, config);
  }
}
