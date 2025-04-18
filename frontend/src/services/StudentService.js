import ApiService from "../common/apiService";

export default {
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
  getGraduationStatus(id) {
    return ApiService.apiAxios.get("/api/v1/student/studentid/" + id);
  },
  getGraduationStatusOptionalPrograms(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/optionalprogram/studentid/" + id
    );
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
  getStudentCareerPrograms(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentcareerprogram/studentid/" + id
    );
  },
  getStudentStatusCodes() {
    return ApiService.apiAxios.get("/api/v1/student/studentstatus");
  },
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
  getStudentHistory(id) {
    return ApiService.apiAxios.get("/api/v1/student/studentHistory/" + id);
  },
  getBatchHistory(id, itemsPerPage, page) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentHistory/batchid/" +
        id +
        "?pageNumber=" +
        page +
        "&pageSize=" +
        itemsPerPage
    );
  },
  getStudentOptionalProgramHistory(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentOptionalProgramHistory/" + id
    );
  },
  getStudentHistoryActivityCode() {
    return ApiService.apiAxios.get("/api/v1/student/historyactivity");
  },
  getStudentPen(id) {
    return ApiService.apiAxios.get("/api/v1/student/stdid/" + id);
  },
  //Student Optional Program CRUD
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
  deleteStudentOptionalProgram(studentId, optionalProgramId) {
    return ApiService.apiAxios.delete(
      "/api/v1/student/" + studentId + "/optionalPrograms/" + optionalProgramId
    );
  },
  deleteStudentCareerProgram(studentId, careerProgramCode) {
    return ApiService.apiAxios.delete(
      "/api/v1/student/" + studentId + "/careerPrograms/" + careerProgramCode
    );
  },
};
