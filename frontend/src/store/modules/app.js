import { defineStore } from 'pinia';
import ApiService from '../../common/apiService.js'

export const useAppStore = defineStore('app',{
  state: () => ({
    programOptions: [],
    studentStatusOptions: [],
    ungradReasons: [],
    pageTitle: "GRAD",
  }),
  getters: {
    getProgramOptions: (state) => state.programOptions,
    getStudentStatusOptions: (state)  => state.studentStatusOptions,
    getUngradReasons: (state) => state.ungradReasons,
  },
  actions: {  
    setApplicationVariables() {
    
      if (localStorage.getItem('jwtToken')) {
        ApiService.apiAxios.get('/api/v1/program/programs').then(response => {
          const programs = response.data.filter(obj => {
            return obj.programCode !== "NOPROG";
          });
          this.programOptions = programs;
        });

        ApiService.apiAxios.get('/api/v1/student/studentstatus').then(response => {
          try{
            this.studentStatusOptions = response.data;
          }catch(error){
            console.log(error)
          }
        });

        ApiService.apiAxios.get('/api/v1/studentgraduation/undocompletion/undocompletionreason').then(response => {
          try{
            this.ungradReasons = response.data;
          }catch(error){
            console.log(error)
          }
        });

        ApiService.apiAxios.get('/api/v1/batch/batchjobtype').then(response => {
          try{
            this.batchTypeCodes = response.data;
          }catch(error){
            console.log(error)
          }
        });        
      }
    },
  },
});