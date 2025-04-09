import ApiService from "../common/apiService";

export default {
  getStudentUngradReasons(id) {
    return ApiService.apiAxios.get(
      "/api/v1/studentgraduation/undocompletion/studentundocompletionreason/studentid/" +
        id
    );
  },
  getUngradReasons() {
    return ApiService.apiAxios.get(
      "/api/v1/studentgraduation/undocompletion/undocompletionreason"
    );
  },
};
