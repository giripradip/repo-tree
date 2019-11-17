<template>
  <v-card class="container-box">
    <v-card-title class="indigo white--text headline">Content-Server Repo Info</v-card-title>
    <v-row class="pa-4" justify="space-between">
      <v-col cols="5">
        <v-treeview
          v-model="tree"
          :open="open"
          :items="items"
          item-key="caption"
          select
          open-on-click
          transition
        >
          <template slot="label" slot-scope="{ item }">
            <div text class="item-container body-1" @click="repoSelected(item)">
              <v-icon v-if="item.tclass != book ">mdi-folder</v-icon>
              <v-icon v-else>mdi-file-pdf</v-icon>
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
            <v-card-text>{{selected.caption}}</v-card-text>
            <v-vard-text v-if="selected.tclass == book">
              <v-btn
                class="ma-2"
                outlined
                color="indigo"
                @click="openBook(selected)"
              >{{selected.caption}}</v-btn>
            </v-vard-text>
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue';
import Helper from '../helper/Helper';
import itemType from '../helper/ItemType';

export default {
  data: () => ({
    open: [],
    items: [],
    tree: [],
    book: itemType.BOOK,
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
        const url = Helper.generateGroupUrl(
          this.commonBaseInfo,
          selectedItem.uid,
        );
        const response = await this.callApi(url);
        const responseData = response.data;
        Vue.set(selectedItem, 'children', responseData.assets);
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

    openBook(item) {
      window.open(
        `https://education.hana.ondemand.com/education/pub/s4/index.html#book!${item.uid}`,
        '_blank',
      );
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
