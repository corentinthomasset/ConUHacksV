import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './importUserProfile';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faClock, faBell, faTimes, faMailBulk, faCheckCircle, faPennant, faPlus, faLock, faLockOpen, faArrowLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueTimeago from 'vue-timeago';

library.add(faClock, faBell, faTimes, faMailBulk, faCheckCircle, faPennant, faPlus, faLock, faLockOpen, faArrowLeft);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en', // Default locale
});

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
