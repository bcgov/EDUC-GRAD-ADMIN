import StudentService from '@/services/StudentService.js';
import BatchProcessingService from '@/services/BatchProcessingService.js';
export default {
  namespaced: true,
  state: {
    batchDetails: [],
    scheduledBatchJobs: [],
    batchAutoIncrement: 1,
    batchTabsLoading: [],
    tabs: [],
    
  },
  mutations: {
    setTabLoading(state, payload){
      state.batchTabsLoading[payload['index']] = payload['value'];
    },
    addValueToTypeInBatchId(state, payload){
      state.batchDetails[payload['id']][payload['type']].push({})
    },
    addTypeToBatchId(state, payload){
      state.batchDetails[payload['id']][payload['type']].push({})
    },
    addSchoolToBatch(state,payload){
      state.batchDetails[payload].schools.push({})
    },
    addDistrictToBatch(state,payload){
      state.batchDetails[payload].districts.push({})
    },
    addStudentToBatch(state,payload){
      state.batchDetails[payload].students.push({})
    },
    //id, type, value
    deleteValueFromTypeInBatchId(state,payload){
      let items = state.batchDetails[payload['id']][payload['type']];

      for( var i = 0; i < items.length; i++){    
        if ( items[i].value === payload['value']) { 
          items.splice(i--, 1); 
        }
      }
      if(items.length == 0){
        items.push({});
      }
    },  
    addBatchJob(state,id){
      state.batchAutoIncrement++;
      state.tabs.push(id);
    }, 
    editBatchDetails(state,payload){
      state.batchDetails[payload['id']]=payload['batchDetail'];
    },
    clearBatchDetails(state,payload){
      state.batchDetails[payload]['details'].who="Choose...";
      state.batchDetails[payload]['details'].where="";
      state.batchDetails[payload]['details'].gradDate="Current Students";
      state.batchDetails[payload]['details'].gradDateFrom="";
      state.batchDetails[payload]['details'].gradDateTo="";
      state.batchDetails[payload].schools=[{}];
      state.batchDetails[payload].districts=[{}];
      state.batchDetails[payload].programs=[{}];
      state.batchDetails[payload].students=[{}];
      state.batchDetails[payload].psi=[{}];
      state.batchDetails[payload]['details'].blankCertificateDetails=[{}];
      state.batchDetails[payload]['details'].blankTranscriptDetails=[{}];
      state.batchDetails[payload]['details'].credential="";
      state.batchDetails[payload]['details'].categoryCode="";
      state.batchDetails[payload]['details'].copies="";
    },
    clearBatchGroupDetails(state,payload){
      state.batchDetails[payload].schools=[{}];
      state.batchDetails[payload].districts=[{}];
      state.batchDetails[payload].programs=[{}];
      state.batchDetails[payload].students=[{}];
      state.batchDetails[payload].psi=[{}];
      
    },     
    clearBatchCredentialsDetails(state,payload){
      state.batchDetails[payload].details['blankCertificateDetails']=[{}];
      state.batchDetails[payload].details['blankTranscriptDetails']=[{}];
    },     
    setScheduledBatchJobs(state, payload){
      state.scheduledBatchJobs = payload;
    }        
  },
  actions: {
    
    validateStudentInGrad(payload){
        
      StudentService.getStudentByPen(payload['pen']).then(
        (response) => {
          this.$store.commit("batchprocessing/addValueToTypeInBatchId", payload);
          return response;
        }
      ).catch((error) => {
        // eslint-disable-next-line
        console.log(error.response.status);
      });
    },
    setScheduledBatchJobs({commit}, payload) {
      commit('setScheduledBatchJobs', payload);
    },
    removeScheduledJobs({state}, payload) {
       // eslint-disable-next-line
      console.log(state.batchDetails)
      return BatchProcessingService.removeScheduledJobs(payload['id']);
      
    },    
    addStudentToBatch({commit}, payload){
      commit('addStudentToBatch', payload);
    },
    addSchoolToBatch({commit}, payload){
      commit('addSchoolToBatch', payload);
    },
    addDistrictToBatch({commit}, payload){
      commit('addDistrictToBatch', payload);
    },        
  },
  getters: {
    getBatchDetails(state){
      return state.batchDetails;
    },
    getBatchCounter(state){
        return state.batchAutoIncrement;
    },
    getBatchTabsLoading(state){
      return state.batchTabsLoading;
    },
    getBatchProcessingTabs(state){
      return state.tabs;
    },    
    getScheduledBatchJobs(state){
      return state.scheduledBatchJobs;
    },        
  },  
};