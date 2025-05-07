class Urls {
  constructor() {
    this.url = "http://127.0.0.1:8000";
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
