import urlJoin from "url-join";

export class School {
  constructor(name, founder, type, zipCode, address) {
    this.name = name;
    this.founder = founder;
    this.type = type;
    this.zipCode = zipCode;
    this.address = address;
  }

  info() {
    return `
    学校名     : ${this.name}
    設置区分   : ${this.founder}
    学校種     : ${this.type}
    郵便番号   : ${this.zipCode}
    学校所在地 : ${this.address}
    `;
  }

  mapUrl() {
    return urlJoin(
      "https://www.google.com/maps/search",
      encodeURI(this.address) + "+" + encodeURI(this.name)
    );
  }
}
