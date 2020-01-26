import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Box from "../views/Box";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/box/:boxId',
    name: 'box',
    component: Box,
    props: true
  }

];

const router = new VueRouter({
  routes
});

export default router
