import StudentService from '@/services/StudentService.js';
import ProgramManagementService from '@/services/ProgramManagementService.js';
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
      setApplicationVariables({commit,rootState}) {
        ProgramManagementService.getGraduationPrograms(rootState.auth.token).then(
          (response) => {
            commit('setProgramOptions', response.data);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
        StudentService.getStudentStatusCodes(rootState.auth.token).then(
          (response) => {
            commit('setStudentStatusCodesOptions', response.data);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
        StudentService.getUngradReasons(rootState.auth.token).then(
          (response) => {
            commit('setUngradReasons', response.data);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });        
      }, 
    },
  };