import ApiService from '../../common/apiService';
import AuthService from '../../common/authService';
import { defineStore } from 'pinia';

function isFollowUpVisit(jwtToken) {
  return !!jwtToken;
}

function tokenRemainingTime(jwtToken) {
  const now = Date.now().valueOf() / 1000;
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  return (payload.exp - now);
}
function isExpiredToken(jwtToken) {
  const now = Date.now().valueOf() / 1000;
  const jwtPayload = jwtToken.split('.')[1];
  const payload = JSON.parse(window.atob(jwtPayload));
  return payload.exp <= now;
}

export const useAuthStore = defineStore('auth', {
  namespaced: true,
  state: () => ({
    acronyms: [],
    isAuthenticated: false,
    userInfo: null,
    error: false,
    isLoading: true,
    loginError: false,
    jwtToken: localStorage.getItem('jwtToken'),
  }),
  getters: {
    acronymsGet: state => state.acronyms,
    isAuthenticatedGet: state => state.isAuthenticated,
    jwtTokenGet: state => state.jwtToken,
    userInfoGet: state => state.userInfo,
    loginErrorGet: state => state.loginError,
    errorGet: state => state.error,
    isLoadingGet: state => state.isLoading,
    userFullName: state => state.userInfo.userFullName
  },
  actions: {
    //sets Json web token and determines whether user is authenticated
    async setJwtToken(token = null){
      if (token) {
        this.isAuthenticated = true;
        this.jwtToken = token;
        localStorage.setItem('jwtToken', token);
      } else {
        this.isAuthenticated = false;
        this.jwtToken = null;
        localStorage.removeItem('jwtToken');
      }
    },
    

    async setUserInfo(userInfo){
      if(userInfo){
        this.userInfo = userInfo;
      } else {
        this.userInfo = null;
      }
    },
    async setLoginError(){
      this.loginError = true;
    },
    async setError(error){
      this.error = error;
    },
    async setLoading(isLoading){
      this.isLoading = isLoading;
    },
    async loginErrorRedirect(){
      this.loginError = true;
    },
    async logout() {
      await this.setJwtToken();
      await this.setUserInfo();
    },
    async getUserInfo(){
      const userInfoRes = await ApiService.getUserInfo();
      this.userInfo = userInfoRes.data;
    },
    async checkJWTTokenExpired(){
      
      return this.jwtToken && isExpiredToken(this.jwtToken)
    },
    async getTokenRemainingTime(){
      return tokenRemainingTime(this.jwtToken)
    },
    //retrieves the json web token from local storage. If not in local storage, retrieves it from API
    async getJwtToken() {
      await this.setError(false);
      if (isFollowUpVisit(this.jwtToken)) {
        if (isExpiredToken(this.jwtToken)) {

          await this.logout();
          return;
        }

        const response = await AuthService.refreshAuthToken(this.jwtToken);
        if (response.jwtFrontend) {
          await this.setJwtToken(response.jwtFrontend);
          ApiService.setAuthHeader(response.jwtFrontend);
        } else {
          throw 'No jwtFrontend';
        }
      } else {  //inital login and redirect
        const response = await AuthService.getAuthToken();

        if (response.jwtFrontend) {
          await this.setJwtToken(response.jwtFrontend);
          ApiService.setAuthHeader(response.jwtFrontend);
        } else {
          throw 'No jwtFrontend';
        }
      }
    },
  }
});