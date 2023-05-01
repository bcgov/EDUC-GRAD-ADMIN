import ApiService from '../../common/apiService.js';

export default {
    namespaced: true,
    state: {
      programOptions:[],
      studentStatusOptions:[],
      ungradReasons:[]
    },
    getters: {
      getProgramOptions(state){
        return state.programOptions;
      },
      getStudentStatusOptions(state){
        return state.studentStatusOptions;
      },
      getUngradReasons(state){
        return state.ungradReasons;
      },
    },
    mutations: {
      setProgramOptions(state, payload){
        state.programOptions = payload;
      },
      setStudentStatusCodesOptions(state, payload){
        state.studentStatusOptions = payload;
      },
      setUngradReasons(state, payload){
        state.ungradReasons = payload;
      },      
    },
    actions: {
      setApplicationVariables({commit}) {
        //ApiService.getGraduationProgram();
        if(localStorage.getItem('jwtToken')){   
          // uncomment after business is ready to implement the "No Program" option
          //ApiService.apiAxios.get('/api/v1/program/programs').then(response => commit('setProgramOptions', response.data))

          ApiService.apiAxios.get('/api/v1/program/programs').then(response => {
            // filters out the "No Program" option until business is ready to implement
            const programs = response.data.filter(obj => {
              return obj.programCode !== "NOPROG";
            })
            commit('setProgramOptions', programs)
          })
          ApiService.apiAxios.get('/api/v1/student/studentstatus').then(response => commit('setStudentStatusCodesOptions', response.data))
          ApiService.apiAxios.get('/api/v1/studentgraduation/undocompletion/undocompletionreason').then(response => commit('setUngradReasons', response.data))
        }   
      }, 
    },
  };