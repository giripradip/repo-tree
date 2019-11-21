import Vue from 'vue';
import VueRouter from 'vue-router';
import PreLoadRepoTree from '../components/PreLoadRepoTree.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: PreLoadRepoTree,
  },
  {
    path: '/load',
    name: 'Load',
    component: () => import('../components/RepoTree.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../components/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
