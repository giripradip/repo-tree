import Vue from 'vue';
import UrlHelper from '../helper/UrlHelper';

export default class RepoService {
  static getConfig() {
    return {
      headers: {
        Accept: 'application/json',
      },
    };
  }

  static getRepoInfo(url) {
    return Vue.axios.get(url, RepoService.getConfig());
  }

  static postChildrenInfo(children) {
    const childrenData = children.map(item => ({
      method: 'GET',
      url: `group/${item.uid}/entity.txt`,
      body: {},
    }));

    const requestObject = { request: childrenData };
    const url = `${UrlHelper.BASE_URL}/multiple_request`;
    return Vue.axios.post(url, requestObject, RepoService.getConfig());
  }
}
