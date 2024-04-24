
function hideInputError(formEl, inputEl, config){
    errorMassageEl = formEl.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.remove(config.inputErrorClass);
    errorMassageEl.textContent = "";
    errorMassageEl.classList.remove(config.errorClass);
}

function showInputError(formEl, inputEl, config){  
    errorMassageEl = formEl.querySelector(`#${inputEl.id}-error`);
    inputEl.classList.add(config.inputErrorClass);
    errorMassageEl.textContent = inputEl.validationMessage;
    errorMassageEl.classList.add(config.errorClass);
}

function checkInputValidity(formEl, inputEl, config){
    if(!inputEl.validity.valid){
        showInputError(formEl, inputEl, config);
    }
    else{
        hideInputError(formEl, inputEl, config);
    }
}

function toggleButtonState(inputElements, submitButton, config){
    let foundInvalid = false;
    inputElements.forEach((inputEl) =>{
        if(!inputEl.validity.valid){
            foundInvalid = true;
        }
    });

    if(foundInvalid){
        submitButton.classList.add(config.inactiveButtonClass);
        submitButton.disabled = true;
    }
    else{
        submitButton.classList.remove(config.inactiveButtonClass);
        submitButton.disabled = false;
    }
}

function setEventListeners(formEl, config){
    const inputElements = Array.from(formEl.querySelectorAll(config.inputSelector));
    const submitButton = formEl.querySelector(config.submitButtonSelector)
    inputElements.forEach((inputEl) =>{
        inputEl.addEventListener("input", () =>{
            checkInputValidity(formEl, inputEl, config);
            toggleButtonState(inputElements, submitButton, config);
        });
    });
}

function enableValidation(config){
    const formElements = Array.from(document.querySelectorAll(config.formSelector));
    formElements.forEach((formEl) =>{
        formEl.addEventListener("submit", (e) =>{
            e.preventDefault;
        });
        setEventListeners(formEl, config);
    });
}


const config = {   
formSelector: ".modal__form",
inputSelector: ".modal__input",
submitButtonSelector: ".modal__button",
inactiveButtonClass: "modal__button_disabled",
inputErrorClass: "modal__input_type_error",
errorClass: "modal__error_visible"};

enableValidation(config);