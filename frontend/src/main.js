import Vue,{ createApp } from '@vue/compat'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'bootstrap-vue/dist/bootstrap-vue.css';
import './assets/css/bcgov.css';
import './assets/css/global.css';
import '@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css';
import { BootstrapVue, BootstrapVueIcons, ToastPlugin } from "bootstrap-vue";
import VueLogger from "vuejs-logger";
import qs from "query-string";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
Vue.config.productionTip = false;
const options = {
  isEnabled: true,
  logLevel: Vue.config.productionTip ? "error" : "debug",
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: "|",
  showConsoleColors: true,
};

Vue.use(BootstrapVue);

Vue.use(VueLogger, options);
Vue.use(qs);

    
const app = createApp(App)
app.config.globalProperties.$filters = {
   //Format simple Date
   formatSimpleDate(value){
    if (value) {
        return new Date(value).toISOString().split("T")[0].replace(/\//g, "-");
      } else {
        return "";
      }
    },
    //Date time filter - YYYY-MM-DD, hr:mm:ss AM/PM 
    formatTime(value) {
    if (value) {
        return new Date(value).toLocaleString("en-CA", {
            hourCycle: "h23",
        });
        } else {
            return "";
        }
    },
    formatSetenceCase(value) {
        const result = value.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    },
    //Format YYYY-MM Date
    formatYYYYMMDate(value) {
        if (value) {
            return new Date(value)
              .toLocaleString("en-CA", { year: "numeric", month: "2-digit" })
              .split("/")
              .reverse()
              .join("-");
          } else {
            return "";
          }
    }, 
    //Format nulls to n/a
    formatNullsToNA(value){
        if (!value) {
            return "n/a";
        } else {
            return value;
        }
    } 
  }

app.use(createPinia());
app.use(router)
app.mount('#app')
