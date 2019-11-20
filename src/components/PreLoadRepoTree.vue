<template>
  <v-card class="container-box">
    <v-card-title class="indigo white--text headline">Content-Server Repo Info</v-card-title>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="5">
        <v-treeview
          v-model="tree"
          :open="open"
          :items="items"
          item-key="uid"
          select
          open-on-click
          transition
        >
          <template slot="label" slot-scope="{ item }">
            <div text class="item-container body-1" @click="repoSelected(item)">
              <v-icon v-if="item.tclass == group ">{{files.group}}</v-icon>
              <v-icon v-else>{{files[item.tclass]}}</v-icon>
              {{ item.caption }}
            </div>
          </template>
        </v-treeview>
      </v-col>

      <v-divider vertical></v-divider>

      <v-col class="d-flex text-center">
        <v-scroll-y-transition mode="out-in">
          <div
            v-if="!selected"
            class="title grey--text text--lighten-1 font-weight-light"
            style="align-self: center;"
          >Select a folder</div>
          <v-card v-else class="pt-6 mx-auto" flat max-width="400">
            <div>{{selected.caption}}</div>
            <div v-if="selected.tclass != group">
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                @click="itemClicked(selected)"
              >{{selected.caption}}</v-btn>
            </div>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
// import Vue from 'vue';
import Helper from '../helper/Helper';
import itemType from '../helper/ItemType';

export default {
  data: () => ({
    open: [],
    items: [],
    tree: [],
    files: {
      group: 'mdi-folder',
      book: 'mdi-book-open-page-variant',
      slide: 'mdi-file-powerpoint',
      project: 'mdi-lightbulb-on-outline',
    },
    book: itemType.BOOK,
    group: itemType.GROUP,
    commonBaseInfo: undefined,
    selected: undefined,
  }),

  methods: {
    callApi(url) {
      const config = {
        headers: {
          Accept: 'application/json',
        },
      };
      return this.axios.get(url, config);
    },

    async getRepo(url) {
      try {
        const response = await this.callApi(url);
        const responseData = {
          tclass: response.data.tclass,
          uid: response.data.uid,
          caption: response.data.caption,
          children: response.data.assets,
        };
        this.items.push(responseData);
        this.callPostRepo(this.items[0].children);
      } catch (err) {
        console.log(err);
      }
    },

    async callPostRepo(children) {
      const childrenData = children.map(item => ({
        method: 'GET',
        url: `group/${item.uid}/entity.txt`,
        body: {},
      }));

      const req = { request: childrenData };
      const url = `${Helper.getBaseUrl()}multiple_request`;
      const response = await this.axios.post(url, req);

      const formatedData = response.data.response.map((item) => {
        const obj = {
          children: Array.isArray(item.assets) ? item.assets.slice() : [],
        };
        return Object.assign({}, item, obj);
      });

      // if selected is null its first call.
      if (!this.selected) {
        this.items[0].children = formatedData;
      } else {
        this.selected.children = formatedData;
      }
    },

    async repoSelected(selectedItem) {
      this.selected = selectedItem;
      if (!selectedItem.children) {
        return;
      }
      const hasAlreadyChildren = selectedItem.children.every(
        item => item.children && item.children.length,
      );
      if (hasAlreadyChildren) {
        return;
      }
      const notAllGroup = selectedItem.children.every(
        item => item.tclass !== itemType.GROUP,
      );
      if (notAllGroup) {
        return;
      }
      try {
        const groupChildren = selectedItem.children.filter(
          child => child.tclass === itemType.GROUP,
        );
        this.callPostRepo(groupChildren);
      } catch (err) {
        console.log(err);
      }
    },

    async getRepoInfo(url) {
      try {
        const response = await this.callApi(url);
        this.commonBaseInfo = response.data;
        const repoUrl = Helper.generateGroupUrl(
          this.commonBaseInfo,
          this.commonBaseInfo.root.uid,
        );
        this.getRepo(repoUrl);
      } catch (err) {
        console.log(err);
      }
    },

    itemClicked(item) {
      switch (item.tclass) {
        case itemType.BOOK:
          this.openExternalLink(
            `${Helper.getBaseUrl()}index.html#book!${item.uid}`,
          );
          break;

        case itemType.PROJECT:
          this.openExternalLink(
            `${Helper.getBaseUrl()}index.html#project!${item.uid}`,
          );
          break;

        case itemType.SLIDE:
          this.openExternalLink(
            `${Helper.getBaseUrl()}index.html#slide!${item.uid}`,
          );
          break;

        default:
          break;
      }
    },

    openExternalLink(link) {
      window.open(link, '_blank');
    },
  },

  mounted() {
    const loadUrl = Helper.getBaseInfoUrl();
    this.getRepoInfo(loadUrl);
  },
};
</script>
<style scoped>
.container-box {
  margin: 25px;
}

.item-container {
  display: flex;
  flex-wrap: wrap;
}
</style>
