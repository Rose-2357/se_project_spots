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
    name: "Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

const cardContainer = document.querySelector(".cards");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit");
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");

const profileNameText = document.querySelector(".profile__header");
const profileNameInput = editProfileModal.querySelector("#modal-form-name");
const profileDescriptionText = document.querySelector(".profile__description");
const profileDescriptionInput = editProfileModal.querySelector(
  "#modal-form-description"
);

const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__new-post");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");
const newPostLinkInput = newPostModal.querySelector("#modal-form-image-link");
const newPostCaptionInput = newPostModal.querySelector("#modal-form-caption");
const newPostForm = newPostModal.querySelector(".modal__form");

initialCards.forEach((card) => {
  addCardAndModal(card);
});

editProfileBtn.addEventListener("click", () => {
  openModal(editProfileModal);
  profileNameInput.value = profileNameText.textContent;
  profileDescriptionInput.value = profileDescriptionText.textContent;
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

  const newCardElement = {
    link: newPostLinkInput.value,
    name: newPostCaptionInput.value,
  };
  addCardAndModal(newCardElement);
  closeModal(newPostModal);
});

function closeModal(modal) {
  modal.classList.add("modal_close-animation");
  let modalStyles = getComputedStyle(modal);
  let animationDurationString = modalStyles.getPropertyValue(
    "--close-animation-duration"
  );
  let animationDurationMS;

  if (animationDurationString.toLowerCase().endsWith("ms")) {
    animationDurationMS = parseFloat(animationDurationString);
  } else if (animationDurationString.toLowerCase().endsWith("s")) {
    let animationDurationSeconds = parseFloat(animationDurationString);
    animationDurationMS = animationDurationSeconds * 1000;
  } else {
    throw "--close-animation-duration in modal.css does not have a valid unit";
  }
  setTimeout(() => {
    modal.classList.remove("modal_close-animation");
    modal.classList.remove("modal_is-opened");
  }, animationDurationMS);
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
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

  newCard.addEventListener("click", (e) => {
    const cardModal = e.target.closest(".card").querySelector(".modal");
    openModal(cardModal);
  });
  cardContainer.prepend(newCard);
}
