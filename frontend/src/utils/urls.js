class Urls {
  constructor() {
    this.prodURL = "http://127.0.0.1:8000";
    this.url =  "http://127.0.0.1:8000"
    this.localurl =  "http://localhost:3000"
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
