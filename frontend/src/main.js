import  {createApp} from 'vue'
import { createVuetify } from 'vuetify/dist/vuetify';
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/bcgov.css';
import './assets/css/global.css';
import '@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css';
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import * as colors from 'vuetify/lib/util/colors';
import styles from 'vuetify/styles?inline';
import * as labs from 'vuetify/labs/components';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi'
  },
  components: {
    ...labs,
    ...components,
    ...directives,
    ...styles,
    ...colors
  },
});

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
  

app.use(createPinia()).use(router).use(vuetify).mount('#app')
