import ApiService from "../common/apiService";

export default {
  // STUDENT INFO
  getStudentPen(id) {
    return ApiService.apiAxios.get("/api/v1/student/stdid/" + id);
  },
  getStudentByPen(pen) {
    return ApiService.apiAxios.get("/api/v1/student/pen/" + pen);
  },
  getStudentByID(studentID) {
    return ApiService.apiAxios.get("/api/v1/student/stdid/" + studentID);
  },
  getStudentsByAdvancedSearch(advancedSearchInput) {
    let queryString = "";
    for (const key in advancedSearchInput) {
      if (advancedSearchInput.hasOwnProperty(key)) {
        if (advancedSearchInput[key].value) {
          let contains = advancedSearchInput[key].contains ? "*" : "";
          queryString +=
            key + "=" + advancedSearchInput[key].value + contains + "&";
        }
      }
    }
    return ApiService.apiAxios.get(
      "/api/v1/student/gradstudentsearch?" + queryString
    );
  },

  // STUDENT GRAD STATUS
  getGraduationStatus(id) {
    return ApiService.apiAxios.get("/api/v1/student/studentid/" + id);
  },
  editGraduationStatus(id, json) {
    return ApiService.apiAxios.post(
      "/api/v1/student/gradstudent/studentid/" + id,
      json
    );
  },
  ungradStudent(id, reasonCode, reasonDesc, json) {
    return ApiService.apiAxios.post(
      "/api/v1/student/undocompletionstudent/studentid/" +
        id +
        "?ungradReasonCode=" +
        reasonCode +
        "&ungradReasonDesc=" +
        reasonDesc,
      json
    );
  },

  // STUDENT OPTIONAL PROGRAMS
  getGraduationStatusOptionalPrograms(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/optionalprogram/studentid/" + id
    );
  },
  getStudentCareerPrograms(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentcareerprogram/studentid/" + id
    );
  },
  createStudentOptionalProgram(studentId, optionalProgramId) {
    return ApiService.apiAxios.post(
      "/api/v1/student/" + studentId + "/optionalPrograms/" + optionalProgramId
    );
  },
  createStudentCareerPrograms(studentId, json) {
    return ApiService.apiAxios.post(
      "/api/v1/student/" + studentId + "/careerPrograms",
      json
    );
  },
  deleteStudentOptionalProgram(studentId, sOPId) {
    return ApiService.apiAxios.delete(
      "/api/v1/student/" + studentId + "/optionalPrograms/" + sOPId
    );
  },
  deleteStudentCareerProgram(studentId, careerProgramCode) {
    return ApiService.apiAxios.delete(
      "/api/v1/student/" + studentId + "/careerPrograms/" + careerProgramCode
    );
  },

  // STUDENT NOTES
  getStudentNotes(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentnotes/studentid/" + id
    );
  },
  addStudentNotes(json) {
    return ApiService.apiAxios.post("/api/v1/student/studentnotes", json);
  },
  deleteStudentNotes(noteID) {
    return ApiService.apiAxios.delete("/api/v1/student/studentnotes/" + noteID);
  },

  // STUDENT HISTORIES
  getStudentHistory(id) {
    return ApiService.apiAxios.get("/api/v1/student/studentHistory/" + id);
  },
  getStudentOptionalProgramHistory(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentOptionalProgramHistory/" + id
    );
  },
  getStudentUngradReasons(id) {
    return ApiService.apiAxios.get(
      "/api/v1/studentgraduation/undocompletion/studentundocompletionreason/studentid/" +
        id
    );
  },

  // BATCH
  getBatchHistory(id, page) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentHistory/batchid/" + id + "?pageNumber=" + page
    );
  },

  // CODES
  getStudentStatusCodes() {
    return ApiService.apiAxios.get("/api/v1/student/studentstatus");
  },
  getUngradReasons() {
    return ApiService.apiAxios.get(
      "/api/v1/studentgraduation/undocompletion/undocompletionreason"
    );
  },
  getStudentHistoryActivityCode() {
    return ApiService.apiAxios.get("/api/v1/student/historyactivity");
  },
};
