  import Vue from "vue";
  import Vuex from "vuex";

  Vue.use(Vuex);
  import ProgramManagementService from '@/services/ProgramManagementService.js';
  import SchoolService from '@/services/SchoolService.js';
  import StudentService from '@/services/StudentService.js';
  export default new Vuex.Store({
    init: {
      //Initialize the store
    },
    
    state: {
      advancedSearchProps:"",
      tokenTimeout: "",
      token:"",
      refreshToken: "",
      roles: "unauthenticated",
      permissions: "",
      username: "",
      student: {
        profile: {},
        courses: "not loaded",
        assessments: "not loaded",
        exams: "not loaded",
        notes: [],
        gradStatus: "not loaded",
        optionalPrograms: "not loaded",
        hasExams: false,
        hasAssessments: false,
        hasCourses: false,
        hasGradStatus: false,
        hasgradStatusPendingUpdates: false,
        hasNotes: false,
        certificates: "not loaded",
        reports: "not loaded",
        transcripts: "not loaded",
        ungradReasons: "",
        careerPrograms: [],
        auditHistory:[],
        auditHistoryOptionalPrograms:[],
      },
      applicationVariables:{
        programOptions:[],
        studentStatusOptions:[],
        ungradReasons:[]
      },
      tabs: [],
      batchDetails: [],
      batchAutoIncrement: 1,
      batchTabsLoading: [],

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

      setStudentAuditHistory(state, payload){
        state.student.auditHistory = payload; 
      },
      setStudentOptionalProgramsAuditHistory(state, payload){
        state.student.auditHistoryOptionalPrograms = payload;
      },      
      setStudentCareerPrograms(state, payload){
        state.student.careerPrograms = payload; 
      },
      setAdvancedSearchProps(state, payload){
        state.advancedSearchProps = payload; 
      },
      setStudentUngradReasons(state, payload){
        state.student.ungradReasons = payload; 
      },
      setStudentCertificates(state, payload){
        state.student.certificates = payload;        
      },
      setStudentReports(state, payload){
        state.student.reports = payload;         
      },
      setStudentTranscripts(state, payload){
        state.student.transcripts = payload;         
      },      
      setProgramOptions(state, payload){
        state.applicationVariables.programOptions = payload;
      },
      setStudentStatusCodesOptions(state, payload){
        
        state.applicationVariables.studentStatusOptions = payload;
     
      },
      setUngradReasons(state, payload){
        state.applicationVariables.ungradReasons = payload;
      },      
      setUsername(state, payload){
        state.username = payload;
      },
      setPermissions(state, payload){
        state.permissions = payload;
      },
      setStudentGradStatusOptionalPrograms(state, payload) {
        state.student.optionalPrograms = payload;
        for (let i = 0; i < state.student.optionalPrograms.length; i++) {
          state.student.optionalPrograms[i].studentOptionalProgramData = JSON.parse(state.student.optionalPrograms[i].studentOptionalProgramData); 
        }
      },
      setHasGradStatusPendingUpdates(state, payload) {
          state.student.hasGradStatusPendingUpdates = payload;
      },
      setToken(state, payload) {
        localStorage.setItem("jwt", payload);
        state.token = payload;
      },
      setRefreshToken(state, payload) {
        localStorage.setItem("refresh", payload);
        state.refreshToken = payload;
      },
      setStudentProfile(state, payload) {
        state.student.profile = payload;
      },
      setStudentCourses(state, payload) {
        state.student.courses = payload;
        if(state.student.courses.length){
          state.student.hasCourses = true;
        }
      },
      setStudentNotes(state, payload) {
        state.student.notes = payload;
        if(state.student.notes.length){
          state.student.hasNotes = true;
        }
      },
      setStudentGradStatus(state, payload) {
        state.student.gradStatus = payload;
        //when commiting gradstatus to store, we need to put the json string in to a json object to call it easier
        state.student.gradStatus.studentGradData = JSON.parse(state.student.gradStatus.studentGradData); 
        if(state.student.gradStatus != "not loaded" || state.student.gradStatus == ""){
          state.student.hasGradStatus = true;
        }
      },
      setStudentAssessments(state, payload) {
        state.student.assessments = payload;
        if(state.student.assessments.length){
          state.student.hasAssessments = true;
        }
      },
      setStudentExams(state, payload) {
        state.student.exams = payload;
        if(state.student.exams.length){
          state.student.hasExams = true;
        }
      },
      unsetStudent(state) {
        state.student.profile = {};
        state.student.notes = [];
        state.student.id = "not loaded";
        state.student.courses = "not loaded";
        state.student.assessments = "not loaded";
        state.student.exams = "not loaded";
        state.student.gradStatus = "not loaded";
        state.student.optionalPrograms = "not loaded";
        state.student.hasExams = false;
        state.student.hasAssessments = false;
        state.student.hasCourses = false;
        state.student.hasNotes = false;
        state.student.hasGradStatus = false;
        state.student.hasgradStatusPendingUpdates = false;
        state.student.certificates = "not loaded";
        state.student.reports = "not loaded";
        state.student.transcripts = "not loaded";
        state.student.ungradReasons = "";
        state.student.careerPrograms = [];
      },
      setRoles(state, payload){
        state.roles = payload;
      },
      logout(state){
        state.token ="";
        state.refreshToke ="";
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
            this.$store.commit("addValueToTypeInBatchId", payload);
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
      setApplicationVariables({commit,state}) {
        ProgramManagementService.getGraduationPrograms(state.token).then(
          (response) => {
            commit('setProgramOptions', response.data);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
        StudentService.getStudentStatusCodes(state.token).then(
          (response) => {
            commit('setStudentStatusCodesOptions', response.data);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
        StudentService.getUngradReasons(state.token).then(
          (response) => {
            commit('setUngradReasons', response.data);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });        
      }, 
      setUsername({commit}, payload){
        commit('setUsername', payload);
      },
      setPermissions({commit}, payload){
        commit('setPermissions', payload);
      },

      // Programs
      
      createProgram({state}, payload) {
        ProgramManagementService.createProgram(payload, state.token).then(
          (response) => {
            return "STORE REspsonse to display table" + response;
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },   
      deleteProgram({state}, payload) {
        
        ProgramManagementService.deleteProgram(payload, state.token).then(
          (response) => {
            // eslint-disable-next-line
            console.log(response);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },   
      updateProgram({state}, payload) {
        
        ProgramManagementService.updateProgram(payload, state.token).then(
          (response) => {
            // eslint-disable-next-line
            console.log(response);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },   
       // Optional Programs
       createOptionalProgram({state}, payload) {
        ProgramManagementService.createOptionalProgram(payload, state.token).then(
          (response) => {
            return "STORE REspsonse to display table" + response;
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },   
      deleteOptionalProgram({state}, payload) {
        
        ProgramManagementService.deleteOptionalProgram(payload, state.token).then(
          (response) => {
            // eslint-disable-next-line
            console.log(response);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },   
      updateOptionalProgram({state}, payload) {
        
        ProgramManagementService.updateOptionalProgram(payload, state.token).then(
          (response) => {
            // eslint-disable-next-line
            console.log(response);
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },   
      getGraduationPrograms({state}) {
        
        ProgramManagementService.getGraduationPrograms(state.token).then(
          (response) => {
            return response.data;
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error.response.status);
        });
      },    
      setStudentAuditHistory({commit}, payload){
        commit('setStudentAuditHistory', payload);
      },
      setStudentOptionalProgramsAuditHistory({commit}, payload){
        commit('setStudentOptionalProgramsAuditHistory', payload);
      },      
      setStudentCareerPrograms({commit}, payload){
        commit('setStudentCareerPrograms', payload);
      },
      setStudentCertificates({commit}, payload) {
        commit('setStudentCertificates', payload);
      },
      setStudentReports({commit}, payload) {
        commit('setStudentReports', payload);
      },
      setStudentTranscripts({commit}, payload) {
        commit('setStudentTranscripts', payload);
      },            
      setAdvancedSearchProps({commit}, payload) {
        commit('setAdvancedSearchProps', payload);
      },
      setStudentUngradReasons({commit}, payload) {
        commit('setStudentUngradReasons', payload);
      },      
      setHasGradStatusPendingUpdates({commit}, payload) {
        commit('setHasGradStatusPendingUpdates', payload);
      },
      setStudentGradStatusOptionalPrograms({commit}, payload) {
        commit('setStudentGradStatusOptionalPrograms', payload);
      },
      
      setToken({commit}, payload) {
        commit('setToken', payload);
      },
      setRefreshToken({commit}, payload) {
        commit('setRefreshToken', payload);
      },
      setStudentProfile({
        commit
      }, payload) {
        commit('setStudentProfile', payload[0]);
      },
      setStudentCourses({
        commit
      }, payload) {
        commit('setStudentCourses', payload);
      },
      setStudentAssessments({
        commit
      }, payload) {
        commit('setStudentAssessments', payload);
      },
      setStudentExams({
        commit
      }, payload) {
        commit('setStudentExams', payload);
      },
      setStudentGradStatus({
        commit
      }, payload) {
        commit('setStudentGradStatus', payload);
      },
      setRoles({
        commit
      }, payload) {
        commit('setRoles', payload);

      },    
      setStudentNotes({
        commit
      }, payload) {
        commit('setStudentNotes', payload);
      },    
      // SEARCH
      searchSchools({state},payload) {
        SchoolService.searchSchools(payload,state.token).then(
          (response) => {
            return response.data;
          }
        ).catch((error) => {
          // eslint-disable-next-line
          console.log(error);
        });
      },      
    },

    

    getters: {
      getStudentAuditHistory(state){
        return state.student.auditHistory;
      },
      getStudentOptionalProgramAuditHistory(state){
        return state.student.auditHistoryOptionalPrograms;
      },      
      getAdvancedSearchProps(state){
        return state.advancedSearchProps;
      },
      getStudentUngradReasons(state){
        return state.student.ungradReasons;
      },
      getStudentCertificates(state){
          return state.student.certificates;
      },
      getStudentReports(state){
        return state.student.reports;
      },      
      getStudentTranscripts(state){
        return state.student.transcripts;
      },            
      getStudentGraduationCreationAndUpdate(state){
        return {
          "createdBy" : state.student.gradStatus.createdBy,
          "createdTimestamp": state.student.gradStatus.createdTimestamp,
          "updatedBy" : state.student.gradStatus.updatedBy,
          "updatedTimestamp": state.student.gradStatus.updatedTimestamp
        }
      },
      getHasGradStatusPendingUpdates(state){
          return state.student.hasGradStatusPendingUpdates;
      },
      getStudentId(state) {
        return state.student.profile.studentID;
      },
      getStudentProfile(state) {
        return state.student.profile;
      },
      getStudentFullName(state) {
        return {
          "legalLastName": state.student.profile.legalLastName,
          "legalFirstName": state.student.profile.legalFirstName,
          "legalMiddleNames": state.student.profile.legalMiddleNames,
          "pen": state.student.profile.pen
        };
      },
      getStudentPen(state) {
        return state.student.profile.pen;
      },
      getStudentGradStatus(state) {
        return state.student.gradStatus;
      },
      getStudentOptionalPrograms(state) {
        return state.student.optionalPrograms;
      },
      getStudentCourses(state) {
        return state.student.courses;
      },
      getStudentExams(state) {
        return state.student.exams;
      },
      getStudentAssessments(state) {
        return state.student.assessments;
      },
      getStudentNotes(state) {
        return state.student.notes;
      },
      studentHasCourses(state){
        return state.student.hasCourses;
      },
      studentHasExams(state){
        return state.student.hasExams;
      },
      studentHasAssessments(state){
        return state.student.hasAssessments;
      },
      studentHasGradStatus(state){
        return state.student.hasGradStatus;
      },
      studentHasNotes(state){
        return state.student.hasNotes;
      },
      gradStatusCourses(state){
    
        if(state.student.gradStatus.studentGradData && state.student.gradStatus.studentGradData.studentCourses){
          return state.student.gradStatus.studentGradData.studentCourses.studentCourseList;
        }else {
          return {};
        }
        
      },
      gradStatusAssessments(state){
        return state.student.gradStatus.studentGradData.studentAssessments.studentAssessmentList;
      },      
      getToken(state){
        return state.token;
      },
      getRefreshToken(state){
        return state.refreshToken;
      },      
      getRoles(state){
        return state.roles;
      },
      isAdmin(state){
        return (state.roles == "administrator")
      },
      isAuthenticated(state){
        return (state.roles == "authenticated")
      },
      getPermissions(state){
        return state.permissions;
      },
      getUsername(state){
        return state.username;
      },
      getProgramOptions(state){
        return state.applicationVariables.programOptions;
      },
      getStudentStatusOptions(state){
        return state.applicationVariables.studentStatusOptions;
      },
      getUngradReasons(state){
        return state.applicationVariables.ungradReasons;
      },
      getRequirementsMet(state){
        return state.student.gradStatus.studentGradData.requirementsMet;
      },
      getNongradReasons(state){
        return state.student.gradStatus.studentGradData.nonGradReasons;
      },
      getStudentCareerPrograms(state){
        return state.student.careerPrograms;
      },
      getTabs(state){
        return state.tabs;
      },
      getBatchDetails(state){
        return state.batchDetails;
      },
      getBatchCounter(state){
          return state.batchAutoIncrement;
      },
      getBatchTabsLoading(state){
        return state.batchTabsLoading;
      }

      
        
    },
    modules: {}
  })
