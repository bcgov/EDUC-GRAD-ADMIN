import { createApp } from "vue";
import { createVuetify } from "vuetify/dist/vuetify";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "@bcgov/bootstrap-theme/dist/css/bootstrap-theme.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import "vuetify/styles";
import * as colors from "vuetify/lib/util/colors";
import styles from "vuetify/styles?inline";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "@mdi/font/css/materialdesignicons.css";
import Snackbar from "./components/Common/Snackbar.vue";

// Custom CSS
import "./assets/css/bcgov.css";
import "./assets/css/global.css";

// test comment

//define custom theme
const bcGovTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF", //formerly #F9F9F9
    surface: "#FFFFFF",
    primary: "#38598A",
    secondary: "#7490BA",
    bcGovBlue: "#003366",
    bcGovGold: "#FCBA19",
    bcGovLightGrey: "#EEEEEE",
    error: "#D8292F",
    info: "#003366",
    success: "#2E8540",
    warning: "#926700",
    debug: "#8522a2",
  },
  //override vue variables below; each variable appears in the DOM and can be accessed via CSS with '--v-' prepended,
  // so btn-size will become --v-btn-size in the DOM and CSS
  variables: {
    // "btn-size": "1rem",
    "table-padding": "0 4px",
  },
};

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
  },
  components: {
    ...components,
    ...directives,
    ...styles,
    ...colors,
  },
  theme: {
    defaultTheme: "bcGovTheme",
    themes: { bcGovTheme },
  },
});

const app = createApp(App);
app.config.globalProperties.$filters = {
  //Format simple Date in YYYYMMDD format
  formatSimpleDate(value) {
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
        timeZone: "UTC", 
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
  //format dates with YYYYMM to YYYY-MM
  formatYYYYMMStringDate(value) {
    return value.replace(/^(\d{4})(\d{2})$/, "$1-$2");
  },
  //Format nulls to n/a
  formatNullsToNA(value) {
    if (!value) {
      return "n/a";
    } else {
      return value;
    }
  },
};
app.component("Snackbar", Snackbar);
app.use(createPinia()).use(router).use(vuetify).mount("#app");
