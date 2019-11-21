

export default class UrlHelper {
  static BASE_URL = 'https://education.hana.ondemand.com/education/pub/s4';

  static generateGroupUrl(commonBaseInfo, uid) {
    return `${UrlHelper.BASE_URL}/${commonBaseInfo.root.tclass}/${uid}/${commonBaseInfo.entity_filename}`;
  }

  static getBaseInfoUrl() {
    return `${UrlHelper.BASE_URL}/library.txt`;
  }
}
