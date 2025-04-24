class Urls {
  constructor() {
    this.url = "http://0.0.0.0:9090";
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
