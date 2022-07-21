import ApiService from '../common/apiService';

export default {
  getCoursesByAdvanceSearch(params) {
    return ApiService.apiAxios.get('/api/v1/course/coursesearch/?' + params);
  },
  getCourses(courseCode){
    return ApiService.apiAxios.get('/api/v1/course/' + courseCode);
  },
  getAllCourses(){
    return ApiService.apiAxios.get('/api/v1/course/');
  },
  getAllCourseRequirements(){
    return ApiService.apiAxios.get('/api/v1/course/requirement');
  },
  getCourseRestrictions(){
    return ApiService.apiAxios.get('/api/v1/course/restriction');
  },
  getCourseRestriction(mainCourseLevel,mainCourseCode){
    return ApiService.apiAxios.get('/api/v1/course/courserestrictionsearch?mainCourseLevel=' + mainCourseLevel + '&mainCourseCode=' + mainCourseCode);
  },
  getRuleCourseRequirements(rule){
    return ApiService.apiAxios.get('/api/v1/course/requirement/rule?rule=' + rule);
  },
  getCourseRequirements(params){
    return ApiService.apiAxios.get('/api/v1/course/courserequirementsearch?' + params);
  },
  getStudentCourseAchievements(pen) {
    return ApiService.apiAxios.get('/api/v1/course/studentcourse/pen/' + pen + '?sortForUI=true');
  },
  getStudentExamDetails(pen) {
    return ApiService.apiAxios.get('/api/v1/course/studentexam/pen/' + pen + '?sortForUI=true');
  }
}
