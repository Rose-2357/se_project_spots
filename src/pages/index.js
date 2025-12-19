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
    authorization: "b3cf45ab-a205-4542-aabe-b7604be4593e",
    "Content-Type": "application/json",
  },
});

const user = new User(
  ".profile__header",
  ".profile__description",
  ".profile__image"
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
      addCardElement(
        getCardElement({
          name: card.name,
          link: card.link,
          _id: card._id,
          isLiked: card.isLiked,
        }),
        true
      );
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
    name: "A long bridge over the forest",
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

const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardCancelBtn = deleteCardModal.querySelector(
  ".modal__save-button_role_cancel-delete-card"
);
const deleteForm = document.forms.deleteForm;

const editAvatarBtn = document.querySelector(".profile__picture-edit-button");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.forms.editAvatar;

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

editAvatarBtn.addEventListener("click", () => {
  openModal(editAvatarModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const saveBtn = e.target.querySelector(".modal__save-button");
  if (saveBtn.textContent === "Saving...") return;
  saveBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: profileNameInput.value,
      about: profileDescriptionInput.value,
    })
    .then((data) => {
      user.setUserInfo(data);
      user.loadUserData();
      closeModal(editProfileModal);
      saveBtn.textContent = "Save";
    })
    .catch((err) => console.error(err));
});

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newCardObject = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  const saveBtn = e.target.querySelector(".modal__save-button");
  if (saveBtn.textContent === "Saving...") return;
  saveBtn.textContent = "Saving...";
  api
    .postCard(newCardObject)
    .then((data) => {
      addCardElement(getCardElement(data), false);
      closeModal(newPostModal);
      newPostForm.reset();
      saveBtn.textContent = "Save";
    })
    .catch((err) => console.error(err));
  toggleButtonState(
    [newPostCaptionInput, newPostLinkInput],
    newPostSaveBtn,
    settings
  );
});

deleteCardCancelBtn.addEventListener("click", () =>
  closeModal(deleteCardModal)
);

deleteForm.addEventListener("submit", handleDeleteSubmit);

editAvatarForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const saveBtn = e.target.querySelector(".modal__save-button");
  if (saveBtn.textContent === "Saving...") return;
  saveBtn.textContent = "Saving...";
  saveBtn.disabled = true;
  api.editAvatar({ avatar: e.target["image-link"].value }).then((data) => {
    user.setUserInfo(data);
    user.loadUserData();
    closeModal(editAvatarModal);
    editAvatarForm.reset();
    saveBtn.textContent = "Save";
  });
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

let selectedCard;
let selectedCardId;

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
    api.handleCardLike(
      e.target.classList.contains("card__like-button_liked"),
      data._id
    );
    e.target.classList.toggle("card__like-button_liked");
  });

  if (data.isLiked) cardLikeBtn.classList.add("card__like-button_liked");

  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");
  cardDeleteBtn.addEventListener("click", (e) => {
    handleDeleteCard(cardElement, data);
  });

  cardImg.addEventListener("click", () => {
    cardModalImg.src = cardImg.src;
    cardModalImg.alt = cardImg.alt;
    cardModalTitle.textContent = cardTitle.textContent;

    openModal(cardModal);
  });

  return cardElement;
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;

  openModal(deleteCardModal);
}

function handleDeleteSubmit(e) {
  e.preventDefault();
  const saveBtn = e.target.querySelector(".modal__save-button");
  if (saveBtn.textContent === "Deleting...") return;
  saveBtn.textContent = "Deleting...";
  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
      saveBtn.textContent = "Delete";
    })
    .catch((err) => console.error(err));
}

function addCardElement(card, initialize) {
  if (initialize) {
    cardContainer.append(card);
    return;
  }
  cardContainer.prepend(card);
}

enableValidation(settings);
