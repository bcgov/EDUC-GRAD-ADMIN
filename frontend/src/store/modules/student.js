export default {
    namespaced: true,
    state: {
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
        hasGradStatusPendingUpdates: false,
        hasNotes: false,
        certificates: [],
        reports: [],
        transcripts: [],
        xmlReports: [],
        ungradReasons: "",
        careerPrograms: [],
        auditHistory:[],
        auditHistoryOptionalPrograms:[],
      }
    },
    mutations: {
      setStudentAuditHistory(state, payload){
        state.student.auditHistory = payload; 
      },
      setStudentOptionalProgramsAuditHistory(state, payload){
        state.student.auditHistoryOptionalPrograms = payload;
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
        state.student.hasGradStatusPendingUpdates = false;
        state.student.certificates = [];
        state.student.reports = [];
        state.student.transcripts = [];
        state.student.xmlReports = [];
        state.student.ungradReasons = [];
        state.student.careerPrograms = [];
      },   
      setStudentCareerPrograms(state, payload){
        state.student.careerPrograms = payload; 
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
      setHasGradStatusPendingUpdates(state, payload) {
        state.student.hasGradStatusPendingUpdates = payload;
      },
      setStudentGradStatusOptionalPrograms(state, payload) {
        state.student.optionalPrograms = payload;
        for (let optionalProgram of state.student.optionalPrograms) {
          optionalProgram.studentOptionalProgramData = JSON.parse(optionalProgram.studentOptionalProgramData); 
        }
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
      setStudentTranscripts(state, payload){
        state.student.transcripts = payload;         
      }, 
      setStudentXmlReport(state, payload){
        state.student.xmlReports = payload;         
      },      
      setStudentGradStatus(state, payload) {
        state.student.gradStatus = payload;
        //when commiting gradstatus to store, we need to put the json string in to a json object to call it easier
        if(state.student.gradStatus.studentGradData){
          state.student.gradStatus.studentGradData = JSON.parse(state.student.gradStatus.studentGradData);
        } else {
          state.student.gradStatus.studentGradData = {};
        }         
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
      
    },
    actions: {
      
      setStudentAuditHistory({commit}, payload){
        commit('setStudentAuditHistory', payload);
      },
      setStudentOptionalProgramsAuditHistory({commit}, payload){
        commit('setStudentOptionalProgramsAuditHistory', payload);
      },
      setStudentCareerPrograms({commit}, payload){
        commit('setStudentCareerPrograms', payload);
      },    
      setStudentUngradReasons({commit}, payload) {
        commit('setStudentUngradReasons', payload);
      },  
      setStudentCertificates({commit}, payload) {
        commit('setStudentCertificates', payload);
      },  
      setStudentReports({commit}, payload) {
        commit('setStudentReports', payload);
      },
      setHasGradStatusPendingUpdates({commit}, payload) {
        commit('setHasGradStatusPendingUpdates', payload);
      },
      setStudentGradStatusOptionalPrograms({commit}, payload) {
        commit('setStudentGradStatusOptionalPrograms', payload);
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
      setStudentNotes({
        commit
      }, payload) {
        commit('setStudentNotes', payload);
      },   
      setStudentTranscripts({commit}, payload) {
        commit('setStudentTranscripts', payload);
      },
      setStudentXmlReport({commit}, payload) {
        commit('setStudentXmlReport', payload);
      }, 
      setStudentGradStatus({
        commit
      }, payload) {
        commit('setStudentGradStatus', payload);
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
    },
    getters: {
      getStudentAuditHistory(state){
        return state.student.auditHistory;
      },
      getStudentOptionalProgramAuditHistory(state){
        return state.student.auditHistoryOptionalPrograms;
      },    
      getStudentUngradReasons(state){
        return state.student.ungradReasons;
      },
      getStudentReports(state){
        return state.student.reports;
      },     
      getStudentTranscripts(state){
        return state.student.transcripts;
      },     
      getStudentXmlReports(state){
        return state.student.xmlReports;
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
      getStudentCertificates(state){
        return state.student.certificates;
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
      studentHasGradStatus(state){
        return state.student.hasGradStatus;
      },
      gradStatusCourses(state){
    
        if(state.student.gradStatus.studentGradData && state.student.gradStatus.studentGradData.studentCourses){
          return state.student.gradStatus.studentGradData.studentCourses.studentCourseList;
        }else {
          return {};
        }
        
      },
      gradStatusAssessments(state){
        if(state.student.gradStatus.studentGradData && state.student.gradStatus.studentGradData.studentAssessments) {
          return state.student.gradStatus.studentGradData.studentAssessments.studentAssessmentList;
        } else {
          return {};
        }
      },  
      getRequirementsMet(state){
        if(state.student.gradStatus.studentGradData){
          return state.student.gradStatus.studentGradData.requirementsMet;
        } else {
          return {};
        }
      },   
      getNongradReasons(state){
        if(state.student.gradStatus.studentGradData){
          return state.student.gradStatus.studentGradData.nonGradReasons;
        } else {
          return {};
        }
      },
      getStudentCareerPrograms(state){
        return state.student.careerPrograms;
      },
    },
  };