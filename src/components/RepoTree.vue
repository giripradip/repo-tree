<template>
  <v-card class="container-box">
    <v-card-title class="indigo white--text headline">Content-Server Repo Info</v-card-title>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="5">
        <v-treeview
          v-model="tree"
          :items="items"
          :return-object="true"
          :active.sync="active"
          :open.sync="open"
          item-key="uid"
          select
          open-on-click
          transition
        >
          <template slot="label" slot-scope="{ item, open }">
            <div text class="item-container body-1" @click="repoSelected(item)">
              <v-icon v-if="item.tclass == group">
                {{ open ? files.groupOpen : files.group }}
                </v-icon>
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
import Vue from 'vue';
import UrlHelper from '../helper/UrlHelper';
import RepoService from '../Service/RepoService';
import itemType from '../helper/ItemType';
import temClickedHandler from '../helper/ItemClickedHandler';

export default {
  data: () => ({
    tree: [],
    open: [],
    active: [],
    items: [],
    files: {
      group: 'mdi-folder',
      groupOpen: 'mdi-folder-open',
      book: 'mdi-book-open-page-variant',
      slide: 'mdi-file-powerpoint',
      project: 'mdi-lightbulb-on-outline',
    },
    book: itemType.BOOK,
    group: itemType.GROUP,
    commonBaseInfo: undefined,
    selected: undefined,
  }),

  mounted() {
    // lifecycle hooks called when page is ready
    this.getBaseInfoForRepo(UrlHelper.getBaseInfoUrl());
  },

  methods: {
    async getBaseInfoForRepo(url) {
      try {
        const response = await RepoService.getRepoInfo(url);
        this.commonBaseInfo = response.data; // save the common information for other request
        const repoUrl = UrlHelper.generateGroupUrl(
          // creating url for getting root element
          this.commonBaseInfo,
          this.commonBaseInfo.root.uid,
        );
        this.getRootLevelRepo(repoUrl); // request for getting root level repo
      } catch (err) {
        console.log(err);
      }
    },

    async getRootLevelRepo(url) {
      try {
        const response = await RepoService.getRepoInfo(url);
        const responseData = {
          tclass: response.data.tclass,
          uid: response.data.uid,
          caption: response.data.caption,
          children: response.data.assets,
        };
        this.items.push(responseData);
      } catch (err) {
        console.log(err);
      }
    },

    async repoSelected(selectedItem) {
      this.selected = selectedItem;
      if (selectedItem.children && selectedItem.children.length) {
        return;
      }
      if (selectedItem.tclass !== itemType.GROUP) {
        console.log('Not group= ', selectedItem);
        return;
      }
      try {
        const url = UrlHelper.generateGroupUrl(
          this.commonBaseInfo,
          selectedItem.uid,
        );
        const response = await RepoService.getRepoInfo(url);
        const responseData = response.data;
        Vue.set(selectedItem, 'children', responseData.assets);
      } catch (err) {
        console.log(err);
      }
    },

    handleItemClick(item) {
      temClickedHandler(item);
    },
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
