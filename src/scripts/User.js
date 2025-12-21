export default class User {
  constructor(nameSelector, aboutSelector, avatarSelector) {
    this._nameElement = document.querySelector(nameSelector);
    this._aboutElement = document.querySelector(aboutSelector);
    this._avatarElement = document.querySelector(avatarSelector);
  }

  setUserInfo({ name, about, avatar }) {
    if (name) this._name = name;
    if (about) this._about = about;
    if (avatar) this._avatar = avatar;
  }

  loadUserData() {
    if (this._name && this._about && this._avatar) {
      this._nameElement.textContent = this._name;
      this._aboutElement.textContent = this._about;
      this._avatarElement.src = this._avatar;
      this._avatarElement.alt = `${this._name}'s profile picture`;
    } else {
      throw new Error("User data is incomplete");
    }
  }
}
