const target = document.forms.newPost;
console.log(target);

enableValidation();

function isValid(input) {
  return input.validity.valid;
}

function hasInvalidInput(inputList) {
  return inputList.some((input) => !isValid(input));
}

function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add("modal__save-button_inactive");
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove("modal__save-button_inactive");
  }
}

function enableValidation() {
  formList = Array.from(document.forms);
  console.log(formList);
  formList.forEach((form) => {
    setEventListeners(form);
  });
}

function setEventListeners(form) {
  const inputList = Array.from(form.querySelectorAll(".modal__input"));
  const buttonElement = form.querySelector(".modal__save-button");
  inputList.forEach((input) => {
    input.addEventListener("input", (e) => {
      checkValidity(e.target);
      toggleButtonState(inputList, buttonElement);
    });
  });
}

function showErrorMessage(input, errorElement) {
  input.classList.add("modal__input_invalid");
  const errorMessage = input.validationMessage;
  errorElement.textContent = errorMessage;
}

function hideErrorMessage(input, errorElement) {
  input.classList.remove("modal__input_invalid");
  errorElement.textContent = "";
}

function checkValidity(input) {
  const errorElement = document.querySelector(`#${input.id}-error`);
  if (!isValid(input)) {
    showErrorMessage(input, errorElement);
  } else {
    hideErrorMessage(input, errorElement);
  }
}
