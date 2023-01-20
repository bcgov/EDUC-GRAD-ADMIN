import Vue from 'vue';
import Vuex from 'vuex'
import App from './App.vue';
import router from './router'
import VueLogger from 'vuejs-logger';
import Vuelidate from 'vuelidate';
import {BootstrapVue, BootstrapVueIcons, ToastPlugin} from 'bootstrap-vue';
import qs from 'query-string';
import VueFilterDateParse from '@vuejs-community/vue-filter-date-parse';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';
import store from './store/index.js';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import '@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import '../src/assets/css/bcgov.css';
import '../src/assets/css/global.css';


// Install BootstrapVue
Vue.use(Vuelidate);
Vue.config.productionTip = false;
const options = {
  isEnabled: true,
  logLevel : Vue.config.productionTip  ? 'error' : 'debug',
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(qs);
Vue.use(VueFilterDateParse);
Vue.use(VueFilterDateFormat);
Vue.use(Vuex);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(ToastPlugin);


//Job Label Render
Vue.filter('jobIdLabel', function(value) {
  if(value){
    return value.replace("job-","")
  }
  
});

//Date time filter
Vue.filter('formatTime', function(value) {
  if(value){
    var date = new Date(value);
    return date.toLocaleString();  
  }else{
    return "";
  }
  
});
//Format simple Date
Vue.filter('formatSimpleDate', function(value) {
  if(value){
    var date = new Date(value);
    return date.toISOString().split('T')[0];
  }else{
    return "";
  }
});
//Format nulls to n/a
Vue.filter('formatNullsToNA', function(value) {
  if(!value){
    return 'n/a';
  }else{
    return value;
  }
});

Vue.filter('formatSetenceCase', function(value) {
  
  const result = value.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
  
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
