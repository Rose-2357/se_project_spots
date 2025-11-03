const settings = {
  inactiveButtonClass: "modal__save-button_inactive",
  invalidInputClass: "modal__input_invalid",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
};

enableValidation(settings);

function isValid(input) {
  return input.validity.valid;
}

function hasInvalidInput(inputList) {
  return inputList.some((input) => !isValid(input));
}

function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(config.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
}

function enableValidation(config) {
  formList = Array.from(document.forms);
  formList.forEach((form) => {
    setEventListeners(form, config);
  });
}

function setEventListeners(form, config) {
  const inputList = Array.from(form.querySelectorAll(config.inputSelector));
  const buttonElement = form.querySelector(config.submitButtonSelector);
  toggleButtonState(inputList, buttonElement, config);
  inputList.forEach((input) => {
    input.addEventListener("input", (e) => {
      checkValidity(e.target, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

function showErrorMessage(input, errorElement, config) {
  input.classList.add(config.invalidInputClass);
  const errorMessage = input.validationMessage;
  errorElement.textContent = errorMessage;
}

function hideErrorMessage(input, errorElement, config) {
  input.classList.remove(config.invalidInputClass);
  errorElement.textContent = "";
}

function checkValidity(input, config) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  if (!isValid(input)) {
    showErrorMessage(input, errorElement, config);
  } else {
    hideErrorMessage(input, errorElement, config);
  }
}
