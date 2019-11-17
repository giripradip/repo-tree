

export default class Helper {
  static getBaseUrl() {
    return `${process.env.BASE_URL}education/pub/s4/`;
  }

  static generateGroupUrl(commonBaseInfo, uid) {
    return `${Helper.getBaseUrl() + commonBaseInfo.root.tclass}/${uid}/${commonBaseInfo.entity_filename}`;
  }

  static getBaseInfoUrl() {
    return `${Helper.getBaseUrl()}library.txt`;
  }
}
