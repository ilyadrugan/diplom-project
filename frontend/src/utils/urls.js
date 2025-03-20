class Urls {
  constructor() {
    this.url = "http://co68153-django-fbq7w.tw1.ru";
  }

  types() {
    return `${this.url}/types/`;
  }
  photos() {
    return `${this.url}/photos/`;
  }
  users() {
    return `${this.url}/users/`;
  }
  requests() {
    return `${this.url}/requests/`;
  }
}
const urls = new Urls();
export default urls;
