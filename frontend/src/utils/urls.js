class Urls {
  constructor() {
    this.prodURL = "https://cl55442.tw1.ru";
    this.url =  "https://cl55442.tw1.ru"
  }

  login() {
    return `${this.url}/login/`;
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
    return `${this.url}/requests`;
  }
  prodURL() {
    return `${this.prodURL}`;
  }
}
const urls = new Urls();
export default urls;
