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
import Helper from '../helper/Helper';
import RepoService from '../Service/RepoService';
import itemType from '../helper/ItemType';
import temClickedHandler from '../helper/ItemClickedHandler';

export default {
  data: () => ({
    open: [],
    active: [],
    items: [],
    tree: [],
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
    this.getBaseInfoForRepo(Helper.getBaseInfoUrl());
  },

  methods: {
    /**
     * Function to get basic information for requesting repo information.
     * The response contains uid, entity_filename and tclass for root repo
     */
    async getBaseInfoForRepo(url) {
      try {
        const response = await RepoService.getRepoInfo(url);
        this.commonBaseInfo = response.data; // save the common information for other request
        const repoUrl = Helper.generateGroupUrl(
          // creating url for getting root element
          this.commonBaseInfo,
          this.commonBaseInfo.root.uid,
        );
        this.getRootLevelRepo(repoUrl); // request for getting root level repo
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * Function to get the root level repo by calling api
     * The response contains uid, tclass and assets
     * assets is converted into children to display in the tree
     */
    async getRootLevelRepo(url) {
      try {
        const response = await RepoService.getRepoInfo(url);
        const responseData = {
          tclass: response.data.tclass,
          uid: response.data.uid,
          caption: response.data.caption,
          children: response.data.assets,
        };
        // updates the item array which contains all the tree information
        this.items.push(responseData);
        // children of root leve is sent to get thier child info
        this.postChildrenInfo(this.items[0].children);
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * Function to post children data for getting their children info
     * This is used for preloading information when folder is selected
     */
    async postChildrenInfo(children) {
      const response = await RepoService.postChildrenInfo(children);
      this.updateChildrenInfo(response);
    },

    /**
     * Function to parse child of child info which is later updated in the dom
     */
    updateChildrenInfo(response) {
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
        this.selected.children = formatedData; // replaces the children data of selected item
      }
    },

    /**
     * Function to handle repo clicked event
     * Calls a methods to preload child info of selected item
     * Avoids multiple request when folder is clicked many times
     */
    repoSelected(selectedItem) {
      this.selected = selectedItem; // saves selected item
      if (!selectedItem.children) {
        // if no children no request is needed
        return;
      }
      const hasAlreadyChildren = selectedItem.children.every(
        item => item.children && item.children.length,
      );
      if (hasAlreadyChildren) {
        // Avoid preload call if already has children
        return;
      }
      const notAllGroup = selectedItem.children.every(
        item => item.tclass !== itemType.GROUP,
      );
      if (notAllGroup) {
        // Avoid preload call if children are not group type
        return;
      }
      try {
        // do not include in a request if children contains item other than group
        const groupTypeChildren = selectedItem.children.filter(
          child => child.tclass === itemType.GROUP,
        );
        this.postChildrenInfo(groupTypeChildren); // make a preload request
      } catch (err) {
        console.log(err);
      }
    },

    /**
     * Function to handle item clicked event if the item is not type of group
     * The other type are project, slide and book
     * Generates url and open link in new tab
     */
    itemClicked(item) {
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
