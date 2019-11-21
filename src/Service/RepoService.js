import Vue from 'vue';
import Helper from '../helper/Helper';

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

    const req = { request: childrenData };
    const url = `${Helper.getBaseUrl()}multiple_request`;
    return Vue.axios.post(url, req);
  }
}
