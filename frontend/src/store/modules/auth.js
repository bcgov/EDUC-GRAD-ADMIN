import ApiService from '@/common/apiService';
import AuthService from '@/common/authService';
import { Routes, RolePermissions } from '@/utils/constants';

export default {
  namespaced: true,
  state: {
    acronyms: [],
    isAuthenticated: localStorage.getItem('jwtToken') !== null,
    isAuthorizedUser: localStorage.getItem('isAuthorizedUser') !== null,
    userInfo: null,
    error: false,
    isLoading: true,
    loginError: false,
    jwtToken: localStorage.getItem('jwtToken'),
  },
  getters: {
    acronyms: state => state.acronyms,
    isAuthenticated: state => state.isAuthenticated,
    getToken: state => state.jwtToken,
    jwtToken: () => localStorage.getItem('jwtToken'),
    userInfo: state => state.userInfo,
    userFullName: state => state.userInfo.userFullName,
    roles: state => { 
      if (state.userInfo.userRoles && state.userInfo.userRoles.includes(RolePermissions.ADMINISTRATOR)){
        return "Administrator"
      }else if (state.userInfo.userRoles){
        return "Authenticated"
      }else return "Not Authenticated"
    },
    loginError: state => state.loginError,
    error: state => state.error,
    isLoading: state => state.isLoading
  },
  mutations: {
    //sets Json web token and determines whether user is authenticated
    setJwtToken: (state, token = null) => {
      if (token) {
        state.isAuthenticated = true;
        localStorage.setItem('jwtToken', token);
      } else {
        state.isAuthenticated = false;
        localStorage.removeItem('jwtToken');
      }
    },
    setAuthorizedUser: (state, isAdminUser) => {
      if (isAdminUser) {
        state.isAuthorizedUser = true;
        localStorage.setItem('isAuthorizedUser', 'true');
      } else {
        state.isAuthorizedUser = false;
        localStorage.removeItem(('isAuthorizedUser'));
      }
    },
    setUserInfo: (state, userInfo) => {
      if(userInfo){
        state.userInfo = userInfo;
      } else {
        state.userInfo = null;
      }
    },

    setLoginError: (state) => {
      state.loginError = true;
    },

    setError: (state, error) => {
      state.error = error;
    },

    setLoading: (state, isLoading) => {
      state.isLoading = isLoading;
    },

    //sets the token required for refreshing expired json web tokens
    logoutState: (state) => {
      localStorage.removeItem('jwtToken');
      state.userInfo = null;
      state.isAuthenticated = false;
    }
  },
  actions: {
    loginErrorRedirect(context){
      context.commit('setLoginError');
    },
    logout(context) {
      context.commit('setJwtToken');
      context.commit('setUserInfo');
    },

    async getUserInfo(context) {
      if(localStorage.getItem('jwtToken')) {
        await ApiService.apiAxios
          .get(Routes.USER)
          .then(response => {
            context.commit('setUserInfo', response.data);
          })
          .catch((e) => {
            throw e;
          });
      }
    },

    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken(context) {
      try {
        if (context.getters.isAuthenticated && !!context.getters.jwtToken) {
          const response = await AuthService.refreshAuthToken(context.getters.jwtToken);
          setAuthorizations(context, response);
        } else {
          const response = await AuthService.getAuthToken();
          setAuthorizations(context, response);
        }
      } catch (e) {
        // Remove tokens from localStorage and update state
        context.commit('setJwtToken');
        throw e;
      }
    },
  }
};

function setAuthorizations(context, response) {
  if (response.jwtFrontend) {
    context.commit('setJwtToken', response.jwtFrontend);
  }
  context.commit('setAuthorizedUser', response.isAuthorizedUser);
  ApiService.setAuthHeader(response.jwtFrontend);
}