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
      deleteValueFromTypeInBatchId(state, payload) {
        
        const { id, type, value, valid } = payload;
        const items = state.batchDetails[id][type];
  
        for (const item of items) {
          if (item.value === value) {
            const index = items.indexOf(item);
            items.splice(index, 1);
          }
        }
      
      if(items.length == 0 || !valid){
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


        
        let date = new Date();
        let psiCurrentYear = String(date.getFullYear());
        if (date.getMonth() + 1 > 8) {
          psiCurrentYear = String(date.getFullYear() + 1);
        }
    
      state.batchDetails[payload]['details'].who="";
      state.batchDetails[payload]['details'].where="BC Mail";
      state.batchDetails[payload]['details'].gradDate="Current Students";
      state.batchDetails[payload]['details'].gradDateFrom="";
      state.batchDetails[payload]['details'].gradDateTo="";
      state.batchDetails[payload]['details'].psiYear=psiCurrentYear;
      state.batchDetails[payload]['details'].psiTransmissionMode="";      
      state.batchDetails[payload].schools=[{}];
      state.batchDetails[payload].districts=[{}];
      state.batchDetails[payload].programs=[{}];
      state.batchDetails[payload].students=[{}];
      state.batchDetails[payload].psi=[{}];
      state.batchDetails[payload]['details'].blankCertificateDetails=[{}];
      state.batchDetails[payload]['details'].blankTranscriptDetails=[{}];
      state.batchDetails[payload]['details'].credential="";
      state.batchDetails[payload]['details'].categoryCode="";
      state.batchDetails[payload]['details'].copies="1";
      state.batchDetails[payload]['details'].allPsi=false;
      state.batchDetails[payload]['details'].allDistricts=false;
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

      for (let value of state.scheduledBatchJobs) {
        value.jobParameters = JSON.parse(value.jobParameters); 
      }
    }        
  },
  actions: {
    
    addValueToTypeInBatchId({commit}, payload) {
      commit('addValueToTypeInBatchId', payload);
    },
    
    setScheduledBatchJobs({commit}, payload) {
      commit('setScheduledBatchJobs', payload);
    },
    removeScheduledJobs({state}, payload) {
      if(state.scheduledBatchJobs)
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
    getBatchDetailsTypeById(state){
    
      return function(args){
        return state.batchDetails[args].details['what']
        
      }
    },
    getbatchDetailsGroupById(state){
      return function(args){
        return state.batchDetails[args].details['who']    
      }
    }
  },  
};
