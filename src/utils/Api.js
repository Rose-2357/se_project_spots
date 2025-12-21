export default class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _handleResponse = (res) =>
    res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);

  _request(endpoint, options = {}) {
    const url = `${this._baseUrl}${endpoint}`;
    const finalOptions = {
      headers: this._headers,
      ...options,
    };
    return fetch(url, finalOptions).then((res) => res.json());
  }

  _getOptions(method, data) {
    const options = {
      method,
    };
    if (data) options.body = JSON.stringify({ ...data });
    return options;
  }

  getInitialCards() {
    return this._request("/cards");
  }

  getUserInfo() {
    return this._request("/users/me");
  }

  getInfo() {
    return Promise.all([this.getUserInfo(), this.getInitialCards()]);
  }

  editUserInfo({ name, about }) {
    return this._request(
      "/users/me",
      this._getOptions("PATCH", { name, about })
    );
  }

  editAvatar({ avatar }) {
    return this._request(
      "/users/me/avatar",
      this._getOptions("PATCH", { avatar })
    );
  }

  postCard({ name, link }) {
    return this._request("/cards", this._getOptions("POST", { name, link }));
  }

  removeCard(cardId) {
    return this._request(`/cards/${cardId}`, this._getOptions("DELETE"));
  }

  handleCardLike(isLiked, cardId) {
    const method = isLiked ? "DELETE" : "PUT";
    return this._request(`/cards/${cardId}/likes`, this._getOptions(method));
  }
}
