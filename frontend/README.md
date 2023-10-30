# ECC GRAD ADMIN

Working:
VULIDATE UPDATED
Updated vuelidate for vue 3
-updated validations on advanced search to new syntax.


VUE3/VITE
Vite-dev proxy working with backend
    - /api will be redirected to localhost:8080 (set in vite.config.js)
    - updated port to 8081
BootstrapVue
    is running in compatibility mode
    https://stackblitz.com/edit/bootstrap-vue-with-compat-8p2z4u?file=vite.config.js

    had to add to vite.config.js
      alias: {
      vue: '@vue/compat',
    },

    ADDED BCGOV STYLES

KEYCloak - auth - setup
localhost:8080/api/auth/login - to login in with idir

APIService - can connect and get a repsonse from api


Auth.js
-updated

To do:
remove vue compat
connect to api / vuex / keycloak
displaytable (need to rename to dataTable) component VUE 3 Compatibility
upgrade router -add routes 
vue3 forms



## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
