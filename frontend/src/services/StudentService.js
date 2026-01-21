import ApiService from "../common/apiService";
import {isEmpty, omitBy} from "lodash";

export default {
  // STUDENT COURSES
  getStudentCourses(studentID) {
    return ApiService.apiAxios.get(`/api/student/${studentID}/courses`);
  },
  updateStudentCourse(studentID, json) {
    return ApiService.apiAxios.put(`/api/student/${studentID}/courses`, json);
  },
  createStudentCourses(studentID, json) {
    return ApiService.apiAxios.post(`/api/student/${studentID}/courses`, json);
  },
  deleteStudentCourses(studentID, courses) {
    return ApiService.apiAxios.delete(`/api/student/${studentID}/courses`, {
      data: courses,
    });
  },
  transferStudentCourses(sourceStudentID, targetStudentID, json) {
    return ApiService.apiAxios.post(
      `/api/student/${sourceStudentID}/courses/transfer/${targetStudentID}`,
      json
    );
  },
  transferStudentAssesments(sourceStudentID, targetStudentID, json) {
    return ApiService.apiAxios.post(
      `/api/student-assessment/transfer?sourceStudentID=${sourceStudentID}&targetStudentID=${targetStudentID}`,
      json
    );
  },
  mergeStudentCourses(sourceStudentID, targetStudentID, json) {
    return ApiService.apiAxios.post(
      `/api/student/${sourceStudentID}/courses/merge/${targetStudentID}`,
      json
    );
  },
  completeStudentDataMerge(sourceStudentID, targetStudentID, json) {
    return ApiService.apiAxios.post(
      `/api/student/${sourceStudentID}/complete-merge/${targetStudentID}`,
      json
    );
  },
  getStudentCourseHistory(studentID) {
    return ApiService.apiAxios.get(`/api/student/${studentID}/history/courses`);
  },
  // STUDENT ASSESSMENTS
  mergeStudentAssessments(sourceStudentID, targetStudentID, json) {
    return ApiService.apiAxios.post(
      `/api/student-assessment/merge?sourceStudentID=${sourceStudentID}&targetStudentID=${targetStudentID}`,
      json
    );
  },
  // OPTIONAL STUDENT GRADUATION STATUS
  getStudentCareerPrograms(studentID) {
    return ApiService.apiAxios.get(`/api/student/${studentID}/careerPrograms`);
  },
  createStudentCareerPrograms(studentID, json) {
    return ApiService.apiAxios.post(
      `/api/student/${studentID}/careerPrograms`,
      json
    );
  },
  deleteStudentCareerProgram(studentID, careerProgramCode) {
    return ApiService.apiAxios.delete(
      `/api/student/${studentID}/careerPrograms/${careerProgramCode}`
    );
  },
  createStudentOptionalProgram(studentID, optionalProgramID) {
    return ApiService.apiAxios.post(
      `/api/student/${studentID}/optionalPrograms/${optionalProgramID}`
    );
  },
  deleteStudentOptionalProgram(studentID, optionalProgramID) {
    return ApiService.apiAxios.delete(
      `/api/student/${studentID}/optionalPrograms/${optionalProgramID}`
    );
  },
  getGraduationStatusOptionalPrograms(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/optionalPrograms/status`
    );
  },
  // STUDENT GRADUATION STATUS
  getStudentHistory(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/gradProgram/history`
    );
  },
  getBatchHistory(batchID, itemsPerPage, page) {
    return ApiService.apiAxios.get(
      `/api/student/batchHistory/${batchID}?pageNumber=${page}&pageSize=${itemsPerPage}`
    );
  },
  getGraduationStatus(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/gradProgram/status`
    );
  },
  editGraduationStatus(studentID, json) {
    return ApiService.apiAxios.post(
      `/api/student/${studentID}/gradProgram/status`,
      json
    );
  },
  getStudentOptionalProgramHistory(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/optionalPrograms/history`
    );
  },
  getStudentUndoCompletionReasons(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/gradProgram/undoCompletion`
    );
  },
  undoStudentProgramCompletion(studentID, reasonCode, reasonDesc, json) {
    return ApiService.apiAxios.post(
      `/api/student/${studentID}/gradProgram/undoCompletion?reasonCode=${reasonCode}&reasonDecision=${reasonDesc}`,
      json
    );
  },
  graduateStudent(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/runGradAlgorithm`
    );
  },
  projectedGradFinalMarks(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/previewFinalMarks`
    );
  },
  projectedGradStatusWithFinalAndReg(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/updateTranscriptVerification`
    );
  },
  updateStudentReports(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/${studentID}/updateTranscript`
    );
  },
  mergeStudentGradStatus(mergeStudentID, trueStudentID, json) {
    return ApiService.apiAxios.post(
      `/api/student/${mergeStudentID}/gradStatus/merge/${trueStudentID}`,
      json
    );
  },
  // STUDENT REPORTS
  getStudentTranscript(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/studentReports/${studentID}/transcript`
    );
  },

  getStudentTVR(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/studentReports/${studentID}/transcriptVerificationReport`
    );
  },

  getStudentCertificates(studentID) {
    return ApiService.apiAxios.get(
      `/api/student/studentReports/${studentID}/certificate`
    );
  },

  getStudentXMLReport(pen) {
    return ApiService.apiAxios.get(`/api/student/studentReports/${pen}/XML`);
  },

  // STUDENT NOTES
  addStudentNotes(studentID, json) {
    return ApiService.apiAxios.post(`/api/student/${studentID}/notes`, json);
  },
  deleteStudentNotes(studentID, noteID) {
    return ApiService.apiAxios.delete(
      `/api/student/${studentID}/notes/${noteID}`
    );
  },
  getStudentNotes(studentID) {
    return ApiService.apiAxios.get(`/api/student/${studentID}/notes`);
  },
  getStudentsBySearchCriteria(searchParams, sort, pageNumber, pageSize) {
      return ApiService.apiAxios
        .get('/api/student/paginated', {
            params: {
                pageNumber: pageNumber - 1,
                pageSize: pageSize,
                searchParams: omitBy(searchParams, isEmpty),
                sort: sort,
            },
        })
  },
  downloadStudentSearchReport(searchParams) {
    return ApiService.apiAxios.get('/api/student/students/search/download', {
      params: {
        searchParams: omitBy(searchParams, isEmpty),
      },
      responseType: 'blob',
    });
  },
  // STUDENT DEMOGRAPHICS
  // getStudentsByAdvancedSearch below will be deprecated. Use getStudentStudentsBySearchCriteria instead
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
    return ApiService.apiAxios.get("/api/student/search?" + queryString);
  },
  getStudentByPen(pen) {
    return ApiService.apiAxios.get(`/api/student/pen/${pen}`);
  },
  getStudentByID(studentID) {
    return ApiService.apiAxios.get(`/api/student/id/${studentID}`);
  },
  adoptPENStudent(studentID) {
    return ApiService.apiAxios.post(`/api/student/adopt/${studentID}`, null);
  },
  // HISTORIC ACTIVITIES
  getHistoricActivityByID(studentID) {
    return ApiService.apiAxios.get(`/api/student/${studentID}/historicActivity`);
  },
};
