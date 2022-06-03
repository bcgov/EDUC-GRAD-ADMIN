import StudentService from '@/services/StudentService.js';
export default {
  namespaced: true,
  state: {
    batchDetails: [],
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
      state.batchDetails[payload].schools=[{}];
      state.batchDetails[payload].districts=[{}];
      state.batchDetails[payload].programs=[{}];
      state.batchDetails[payload].students=[{}];
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
    },     
    clearBatchCredentialsDetails(state,payload){
      state.batchDetails[payload].details['blankCertificateDetails']=[{}];
      state.batchDetails[payload].details['blankTranscriptDetails']=[{}];
    }             
  },
  actions: {
    validateStudentInGrad({state}, payload){
        
      StudentService.getStudentByPen(payload['pen'],state.token).then(
        (response) => {
          this.$store.commit("batchprocessing/addValueToTypeInBatchId", payload);
          return response;
        }
      ).catch((error) => {
        // eslint-disable-next-line
        console.log(error.response.status);
      });
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
  },  
};