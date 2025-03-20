class Urls {
  constructor() {
    this.url = 'https://billsticker.tmweb.ru/';
  }

  types() {
    return `${this.url}types/`;
  }
  photos() {
    return `${this.url}photos/`;
  }
  users() {
    return `${this.url}users/`;
  }
  requests() {
    return `${this.url}requests/`;
  }
}

export default urls = new Urls();
