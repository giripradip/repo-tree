

export default class Helper {
  static getBaseUrl() {
    return 'https://education.hana.ondemand.com/education/pub/s4/';
  }

  static generateGroupUrl(commonBaseInfo, uid) {
    return `${Helper.getBaseUrl() + commonBaseInfo.root.tclass}/${uid}/${commonBaseInfo.entity_filename}`;
  }

  static getBaseInfoUrl() {
    return `${Helper.getBaseUrl()}library.txt`;
  }
}
