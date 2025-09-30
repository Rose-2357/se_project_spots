const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit");
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);
const profileNameText = document.querySelector(".profile__header");
const profileNameInput = editProfileModal.querySelector("#modal-form-name");
const profileDescriptionText = document.querySelector(".profile__description");
const profileDescriptionInput = editProfileModal.querySelector(
  "#modal-form-description"
);
const editProfileForm = editProfileModal.querySelector(".modal__form");

const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__new-post");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");
const newPostLinkInput = newPostModal.querySelector("#modal-form-image-link");
const newPostCaotionInput = newPostModal.querySelector("#modal-form-caption");
const newPostForm = newPostModal.querySelector(".modal__form");

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
  console.log(newPostLinkInput.value);
  console.log(newPostCaotionInput.value);
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
