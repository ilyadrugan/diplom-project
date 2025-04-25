class Urls {
  constructor() {
    this.url = "http://192.168.0.12:8000/";
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
