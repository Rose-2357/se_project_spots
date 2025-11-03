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
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);

const editProfileForm = document.forms.editProfile;
const newPostForm = document.forms.newPost;

const profileNameText = document.querySelector(".profile__header");
const profileNameInput = editProfileForm.name;
const profileDescriptionText = document.querySelector(".profile__description");
const profileDescriptionInput = editProfileForm.description;
const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__new-post");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");
const newPostLinkInput = newPostForm["image-link"];
const newPostCaptionInput = newPostForm.caption;

initialCards.forEach((card) => {
  addCardAndModal(card);
});

document.addEventListener("click", (e) => {
  if (!(e.target.classList.contains("modal") && isOpened(e.target))) return;

  closeModal(e.target);
});

editProfileBtn.addEventListener("click", () => {
  const inputList = Array.from(
    editProfileForm.querySelectorAll(".modal__input")
  );
  const buttonElement = editProfileForm.querySelector(".modal__save-button");
  profileNameInput.value = profileNameText.textContent;
  profileDescriptionInput.value = profileDescriptionText.textContent;
  inputList.forEach((input) => {
    checkValidity(input);
    toggleButtonState(inputList, buttonElement);
  });
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

newPostBtn.addEventListener("click", () => {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

editProfileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  profileNameText.textContent = profileNameInput.value;
  profileDescriptionText.textContent = profileDescriptionInput.value;
  closeModal(editProfileModal);
});

newPostForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newCardObject = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  addCardAndModal(newCardObject);
  closeModal(newPostModal);
  newPostForm.reset();
});

function isOpened(modal) {
  const classArray = Array.from(modal.classList);
  return classArray.some((modalClass) => modalClass === "modal_is-opened");
}

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

  return cardElement;
}

function getCardModal(cardElement) {
  const cardModal = document
    .querySelector("#card-modal-template")
    .content.querySelector(".modal")
    .cloneNode(true);

  const modalImg = cardModal.querySelector(".modal__image");
  const cardImg = cardElement.querySelector(".card__image");

  modalImg.src = cardImg.src;
  modalImg.setAttribute("alt", `${cardImg.alt}`);

  const modalTitle = cardModal.querySelector(".modal__title");
  const cardTitle = cardElement.querySelector(".card__title");

  modalTitle.textContent = cardTitle.textContent;

  const modalCloseBtn = cardModal.querySelector(".modal__close-button");

  modalCloseBtn.addEventListener("click", (e) => {
    closeModal(e.target.closest(".modal"));
  });

  return cardModal;
}

function addCardAndModal(card) {
  const newCard = getCardElement(card);
  const newCardModal = getCardModal(newCard);
  newCard.prepend(newCardModal);

  newCard.querySelector(".card__image").addEventListener("click", (e) => {
    const cardModal = e.target.closest(".card").querySelector(".modal");
    openModal(cardModal);
  });
  cardContainer.prepend(newCard);
}
