import ApiService from "../common/apiService";

export default {
  // STUDENT STATUS
  getStudentStatusCodes() {
    return ApiService.apiAxios.get("/api/v1/student/studentstatus");
  },
  // STUDENT COURSES
  getStudentCourses(studentID) {
    return ApiService.apiAxios.get("/api/v1/student/courses/" + studentID);
  },
  updateStudentCourses(studentID, json) {
    return ApiService.apiAxios.put(
      `/api/v1/student/courses/${studentID}`,
      json
    );
  },
  createStudentCourses(studentID, json) {
    return ApiService.apiAxios.put(
      `/api/v1/student/courses/${studentID}`,
      json
    );
  },
  deleteStudentCourses(studentID, json) {
    return ApiService.apiAxios.put(
      `/api/v1/student/courses/${studentID}`,
      json
    );
  },
  getStudentCourseHistory(studentID) {
    return ApiService.apiAxios.put(
      `/api/v1/student/courses/${studentID}/history`
    );
  },
  // OPTIONAL STUDENT GRADUATION STATUS
  createStudentCareerPrograms(studentId, json) {
    return ApiService.apiAxios.post(
      "/api/v1/student/" + studentId + "/careerPrograms",
      json
    );
  },
  deleteStudentCareerProgram(studentId, careerProgramCode) {
    return ApiService.apiAxios.delete(
      "/api/v1/student/" + studentId + "/careerPrograms/" + careerProgramCode
    );
  },
  createStudentOptionalProgram(studentId, optionalProgramId) {
    return ApiService.apiAxios.post(
      "/api/v1/student/" + studentId + "/optionalPrograms/" + optionalProgramId
    );
  },
  deleteStudentOptionalProgram(studentId, optionalProgramId) {
    return ApiService.apiAxios.delete(
      "/api/v1/student/" + studentId + "/optionalPrograms/" + optionalProgramId
    );
  },
  getGraduationStatusOptionalPrograms(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/optionalprogram/studentid/" + id
    );
  },
  // STUDENT GRADUATION STATUS
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
  getGraduationStatus(id) {
    return ApiService.apiAxios.get("/api/v1/student/studentid/" + id);
  },
  editGraduationStatus(id, json) {
    return ApiService.apiAxios.post(
      "/api/v1/student/gradstudent/studentid/" + id,
      json
    );
  },
  getStudentOptionalProgramHistory(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentOptionalProgramHistory/" + id
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
  // STUDENT NOTES
  addStudentNotes(json) {
    return ApiService.apiAxios.post("/api/v1/student/studentnotes", json);
  },
  deleteStudentNotes(noteID) {
    return ApiService.apiAxios.delete("/api/v1/student/studentnotes/" + noteID);
  },
  getStudentNotes(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentnotes/studentid/" + id
    );
  },
  // STUDENT DEMOGRAPHICS
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
  getStudentByPen(pen) {
    return ApiService.apiAxios.get("/api/v1/student/pen/" + pen);
  },
  getStudentPen(id) {
    return ApiService.apiAxios.get("/api/v1/student/stdid/" + id);
  },
  getStudentByID(studentID) {
    return ApiService.apiAxios.get("/api/v1/student/stdid/" + studentID);
  }, // duplicate - CLEAN UP
  // CAREER PROGRAMS
  getStudentCareerPrograms(id) {
    return ApiService.apiAxios.get(
      "/api/v1/student/studentcareerprogram/studentid/" + id
    );
  },
  // HISTORY ACTIVITY (code)
  getStudentHistoryActivityCode() {
    return ApiService.apiAxios.get("/api/v1/student/historyactivity");
  },
};
