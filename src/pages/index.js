import {
  enableValidation,
  settings,
  toggleButtonState,
  resetFormValidation,
} from "../scripts/validation.js";

import "./index.css";

import Api from "../utils/Api.js";

import User from "../scripts/User.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "9f012fb0-4f68-460c-9642-788128245a37",
    "Content-Type": "application/json",
  },
});

const user = new User(
  ".profile__header",
  ".profile__description",
  ".profile__picture"
);

api
  .getInfo()
  .then((data) => {
    user.setUserInfo(data[0]);
    user.loadUserData();
    return data[1];
  })
  .then((cards) => {
    cards.forEach((card) => {
      addCardElement(getCardElement({ name: card.name, link: card.link }));
    });
  })
  .catch((err) => console.error(err));

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const cardContainer = document.querySelector(".cards");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit");

const editProfileForm = document.forms.editProfile;
const newPostForm = document.forms.newPost;

const profilePicture = document.querySelector(".profile__picture");
const profileNameText = document.querySelector(".profile__header");
const profileDescriptionText = document.querySelector(".profile__description");
const profileNameInput = editProfileForm.name;
const profileDescriptionInput = editProfileForm.description;
const editProfileSaveBtn = editProfileModal.querySelector(
  ".modal__save-button"
);

const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__new-post");
const newPostLinkInput = newPostForm["image-link"];
const newPostCaptionInput = newPostForm.caption;
const newPostSaveBtn = newPostForm.querySelector(".modal__save-button");

const cardModal = document.querySelector("#card-modal");
const cardModalImg = cardModal.querySelector(".modal__image");
const cardModalTitle = cardModal.querySelector(".modal__title");
const modals = document.querySelectorAll(".modal");

modals.forEach((modal) => {
  modal.addEventListener("mousedown", (e) => {
    if (e.target.classList.contains("modal_is-opened")) {
      closeModal(modal);
    }
    if (e.target.classList.contains("modal__close-button")) {
      closeModal(modal);
    }
  });
});

editProfileBtn.addEventListener("click", (e) => {
  const inputList = Array.from(
    editProfileModal.querySelectorAll(".modal__input")
  );
  profileNameInput.value = profileNameText.textContent;
  profileDescriptionInput.value = profileDescriptionText.textContent;
  resetFormValidation(inputList, editProfileSaveBtn);
  openModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileDescriptionInput.value,
    })
    .then((data) => {
      user.setUserInfo(data);
      user.loadUserData();
    });
  closeModal(editProfileModal);
});

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newCardObject = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  addCardElement(getCardElement(newCardObject));
  closeModal(newPostModal);
  newPostForm.reset();
  toggleButtonState(
    [newPostCaptionInput, newPostLinkInput],
    newPostSaveBtn,
    settings
  );
});

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keyup", closeOnEscape);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keyup", closeOnEscape);
}

function closeOnEscape(e) {
  if (e.key !== "Escape") return;
  const modal = document.querySelector(".modal_is-opened");
  closeModal(modal);
}

function getCardElement(data) {
  const cardElement = document
    .querySelector("#card-template")
    .content.querySelector(".card")
    .cloneNode(true);

  const cardImg = cardElement.querySelector(".card__image");
  cardImg.src = data.link;

  cardImg.setAttribute("alt", data.name);

  const cardTitle = cardElement.querySelector(".card__title");
  cardTitle.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  cardLikeBtn.addEventListener("click", (e) => {
    e.target.classList.toggle("card__like-button_liked");
  });

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  cardDeleteBtn.addEventListener("click", (e) => {
    e.target.closest(".card").remove();
  });

  cardImg.addEventListener("click", () => {
    cardModalImg.src = cardImg.src;
    cardModalImg.alt = cardImg.alt;
    cardModalTitle.textContent = cardTitle.textContent;

    openModal(cardModal);
  });

  return cardElement;
}

function addCardElement(card) {
  cardContainer.prepend(card);
}

enableValidation(settings);
