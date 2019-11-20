<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="menu-item-container">
        <v-btn text exact-active-class to="/">Home</v-btn>
        <v-btn text exact-active-class to="/preload">Preload</v-btn>
        <v-btn text exact-active-class to="/about">About</v-btn>
      </div>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style scoped >
.menu-item-container {
  display: block;
  margin: 0 auto;
}
</style>
