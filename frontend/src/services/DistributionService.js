import ApiService from '../common/apiService';

export default {
  downloadDISTRUN(batchId){
    return ApiService.apiAxios.get('/api/v1/distribute/download/' + batchId);
  }
}