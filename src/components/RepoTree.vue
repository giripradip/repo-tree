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
          color="success"
          open-on-click
          transition
        >
          <template slot="label" slot-scope="{ item }">
            <div text class="item-container body-1" @click="repoSelected(item)">
              <v-icon v-if="item.tclass == 'group'">mdi-folder</v-icon>
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
          </v-card>
        </v-scroll-y-transition>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import Vue from 'vue';

export default {
  data: () => ({
    open: [],
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-json',
      md: 'mdi-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    },
    items: [],
    tree: [],
    selected: undefined,
  }),

  methods: {
    callApi(uid) {
      const config = {
        headers: {
          Accept: 'application/json',
        },
      };
      return this.axios.get(
        `${process.env.BASE_URL}education/pub/s4/group/${uid}/entity.txt`,
        config,
      );
    },

    async getRepo(uid) {
      try {
        const response = await this.callApi(uid);
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
      try {
        const response = await this.callApi(selectedItem.uid);
        const responseData = response.data;
        Vue.set(selectedItem, 'children', responseData.assets);
      } catch (err) {
        console.log(err);
      }
    },
  },

  mounted() {
    console.log(process.env.BASE_URL);
    this.getRepo('GR_5B103DE89EE75A1F8');
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
