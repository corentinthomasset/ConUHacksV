import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import User from './Models/User';
import Box from "./Models/Box";
import Alert from "./Models/Alert";

Vue.use(Vuex);

// Create a new instance of Database.
const database = new VuexORM.Database();

// Register Models to Database.
database.register(User);
database.register(Box);
database.register(Alert);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  plugins: [VuexORM.install(database)]
})
