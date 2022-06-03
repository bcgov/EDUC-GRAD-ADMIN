export default {
    namespaced: true,
    state: {
      token:"",
      refreshToken: "",
      
    },
    mutations: {
      logout(state){
        state.token ="";
        state.refreshToken ="";
      }, 
      setToken(state, payload) {
        localStorage.setItem("jwt", payload);
        state.token = payload;
      },
      setRefreshToken(state, payload) {
        localStorage.setItem("refresh", payload);
        state.refreshToken = payload;
      }   
    },
    actions: {
      setToken({commit}, payload) {
        commit('setToken', payload);
      },
      setRefreshToken({commit}, payload) {
        commit('setRefreshToken', payload);
      },
    },
    getters: {
      getToken(state){
        return state.token;
      },
      getRefreshToken(state){
        return state.refreshToken;
      },    
    },
  };